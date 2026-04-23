import React, { useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import './Products.css';

const initialForm = {
  name: '',
  price: '',
  stock: '',
  image: '',
  is_active: true
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productAPI.getAll();
      setProducts(response.data.products);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setNotice('');

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      };

      if (editingId) {
        await productAPI.update(editingId, payload);
        setNotice('Product updated successfully.');
      } else {
        await productAPI.create(payload);
        setNotice('Product created successfully.');
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p className="page-subtitle">Manage retail items, prices, stock, and product images for the POS screen.</p>
        </div>
      </div>

      {notice && <div className="alert alert-success">{notice}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="products-layout">
        <div className="card product-form-card">
          <div className="card-header">
            <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} required />
            </div>
            <div className="form-grid compact-grid">
              <div className="form-group">
                <label className="form-label">Price</label>
                <input type="number" min="0.01" step="0.01" className="form-input" value={form.price} onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input type="number" min="0" className="form-input" value={form.stock} onChange={(e) => setForm((current) => ({ ...current, stock: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Product Image URL / Path</label>
              <input className="form-input" value={form.image} onChange={(e) => setForm((current) => ({ ...current, image: e.target.value }))} placeholder="https://... or /images/product.jpg" />
            </div>
            <label className="checkbox-row">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((current) => ({ ...current, is_active: e.target.checked }))} />
              <span>Available for POS checkout</span>
            </label>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="product-list-section">
          {loading ? (
            <div className="card text-center">
              <span className="loader"></span>
            </div>
          ) : (
            <div className="product-admin-grid">
              {products.map((product) => (
                <div key={product.id} className="card product-admin-card">
                  <div className="product-image-shell">
                    <img src={product.image || 'https://via.placeholder.com/400x300?text=Product'} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-admin-body">
                    <div>
                      <h3>{product.name}</h3>
                      <p className="product-meta">Stock: {product.stock}</p>
                      <p className="product-meta">{product.is_active ? 'Active in POS' : 'Hidden from POS'}</p>
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingId(product.id);
                        setForm({
                          name: product.name,
                          price: product.price,
                          stock: product.stock,
                          image: product.image || '',
                          is_active: Boolean(product.is_active)
                        });
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
