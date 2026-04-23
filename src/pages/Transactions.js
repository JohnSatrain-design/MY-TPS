import React, { useEffect, useMemo, useState } from 'react';
import { customerAPI, productAPI, transactionAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';
import { formatPeso } from '../utils/currency';
import './Transactions.css';

const Transactions = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const isCustomerRole = user?.role === 'customer';
  const customerId = user?.customer_id;
  const canCheckout = user?.role !== 'customer';

  useEffect(() => {
    if (isCustomerRole && customerId) {
      setSelectedCustomerId(customerId);
    }
  }, [isCustomerRole, customerId]);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError('');

      const requests = [productAPI.getAll(), transactionAPI.getAll()];

      if (canCheckout) {
        requests.splice(1, 0, customerAPI.getAll());
      }

      const responses = await Promise.all(requests);

      setProducts(responses[0].data.products.filter((product) => product.is_active));

      if (canCheckout) {
        setCustomers(responses[1].data.customers);
        setTransactions(responses[2].data.transactions);
      } else {
        setTransactions(responses[1].data.transactions);
      }
    } catch (err) {
      setError('Failed to load POS data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [canCheckout]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cart]
  );

  const changeDue = useMemo(() => {
    const payment = Number(paymentAmount || 0);
    return payment > cartTotal ? payment - cartTotal : 0;
  }, [paymentAmount, cartTotal]);

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      setError(`${product.name} is out of stock`);
      return;
    }

    setError('');
    setNotice(`${product.name} added to cart.`);
    setCart((current) => {
      const existing = current.find((item) => item.product_id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          setError(`Only ${product.stock} units available for ${product.name}`);
          return current;
        }

        return current.map((item) =>
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...current,
        {
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
          price: Number(product.price),
          image: product.image,
          stock: product.stock
        }
      ];
    });
  };

  const updateCartQuantity = (productId, nextQuantity) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.product_id !== productId) {
            return item;
          }

          const safeQuantity = Math.max(0, Math.min(item.stock, nextQuantity));
          return {
            ...item,
            quantity: safeQuantity
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = async () => {
    if (!selectedCustomerId) {
      setError('Please select a customer before checkout.');
      return;
    }

    if (cart.length === 0) {
      setError('Add at least one product to the cart.');
      return;
    }

    if (Number(paymentAmount || 0) < cartTotal) {
      setError('Payment amount must be enough to cover the total.');
      return;
    }

    try {
      setCheckingOut(true);
      setError('');
      setNotice('');

      await transactionAPI.create({
        customer_id: Number(selectedCustomerId),
        payment_amount: Number(paymentAmount),
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      });

      setCart([]);
      setPaymentAmount('');
      setNotice('Checkout completed successfully.');
      await fetchPageData();
    } catch (err) {
      setError(err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleStatusChange = async (transactionId, status) => {
    try {
      await transactionAPI.updateStatus(transactionId, status);
      setNotice('Transaction status updated.');
      await fetchPageData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update transaction status');
    }
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm('Delete this transaction?')) {
      return;
    }

    try {
      await transactionAPI.delete(transactionId);
      setNotice('Transaction deleted successfully.');
      await fetchPageData();
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="transactions">
      <div className="transactions-header">
        <div>
          <h1>POS Transactions</h1>
          <p className="page-subtitle">Run a retail checkout flow with product images, live totals, and stock-aware cart actions.</p>
        </div>
        <div className="pos-badge">{canCheckout ? 'Cashier Mode' : 'Purchase History'}</div>
      </div>

      {notice && <div className="alert alert-success">{notice}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {canCheckout && (
        <div className="pos-shell">
          <div className="product-catalog">
            <div className="card catalog-panel">
              <div className="card-header">
                <h2>Product Catalog</h2>
                <span className="transaction-count">{products.length} products</span>
              </div>
              {loading ? (
                <div className="text-center mt-20">
                  <span className="loader"></span>
                </div>
              ) : (
                <div className="product-grid">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className={`product-card ${product.stock <= 0 ? 'disabled' : ''}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      <div className="product-card-image">
                        <img src={product.image || 'https://via.placeholder.com/400x300?text=Product'} alt={product.name} />
                      </div>
                      <div className="product-card-body">
                        <div>
                          <h3>{product.name}</h3>
                          <p className="product-stock">{product.stock} in stock</p>
                        </div>
                        <div className="product-card-footer">
                          <strong>{formatPeso(product.price)}</strong>
                          <span className="add-label">{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="card cart-panel">
            <div className="card-header">
              <h2>Cart</h2>
              <span className="transaction-count">{cart.length} items</span>
            </div>

            <div className="form-group">
              <label className="form-label">Customer</label>
              <select className="form-select" value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="text-muted">Select products from the catalog to begin checkout.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.product_id} className="cart-item">
                    <div className="cart-item-copy">
                      <strong>{item.product_name}</strong>
                      <span>{formatPeso(item.price)} each</span>
                    </div>
                    <div className="cart-item-controls">
                      <button type="button" className="quantity-btn" onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" className="quantity-btn" onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <div className="cart-item-total">
                      <span>{formatPeso(item.quantity * item.price)}</span>
                      <button type="button" className="cart-remove" onClick={() => updateCartQuantity(item.product_id, 0)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="checkout-block">
              <div className="checkout-row">
                <span>Total</span>
                <strong>{formatPeso(cartTotal)}</strong>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter payment received"
                />
              </div>
              <div className="checkout-row change-row">
                <span>Change</span>
                <strong>{formatPeso(changeDue)}</strong>
              </div>
              <button className="btn btn-primary checkout-btn" type="button" onClick={handleCheckout} disabled={checkingOut}>
                {checkingOut ? 'Processing...' : 'Complete Checkout'}
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="card transaction-history">
        <div className="card-header">
          <h2>{canCheckout ? 'Recent POS Transactions' : 'Your Purchases'}</h2>
          <span className="transaction-count">{transactions.length} total</span>
        </div>

        {loading ? (
          <div className="text-center mt-20">
            <span className="loader"></span>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted mt-20">No transactions found</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  {canCheckout && <th>Cashier</th>}
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Change</th>
                  <th>Status</th>
                  <th>Date</th>
                  {canCheckout && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>#{transaction.id}</td>
                    <td>{transaction.customer_name}</td>
                    {canCheckout && <td>{transaction.staff_name || '-'}</td>}
                    <td className="amount">{formatPeso(transaction.total_amount)}</td>
                    <td>{formatPeso(transaction.payment_amount)}</td>
                    <td>{formatPeso(transaction.change_amount)}</td>
                    <td>
                      {canCheckout ? (
                        <select className="status-select" value={transaction.status} onChange={(e) => handleStatusChange(transaction.id, e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`badge badge-${transaction.status}`}>{transaction.status}</span>
                      )}
                    </td>
                    <td>{new Date(transaction.created_at).toLocaleString()}</td>
                    {canCheckout && (
                      <td className="actions">
                        {user?.role === 'admin' && (
                          <button type="button" className="btn-icon delete" onClick={() => handleDelete(transaction.id)}>
                            Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
