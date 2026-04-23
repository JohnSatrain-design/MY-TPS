import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';
import { formatPeso } from '../utils/currency';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [customerPoints, setCustomerPoints] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        if (user?.role === 'admin' || user?.role === 'staff') {
          const [statsResponse, transactionsResponse, productsResponse] = await Promise.all([
            dashboardAPI.getStats(),
            dashboardAPI.getRecentTransactions(6),
            dashboardAPI.getTopProducts(5)
          ]);

          setStats(statsResponse.data);
          setRecentTransactions(transactionsResponse.data.transactions);
          setTopProducts(productsResponse.data.products);
        } else if (user?.role === 'customer') {
          const transactionsResponse = await dashboardAPI.getRecentTransactions(6);
          setRecentTransactions(transactionsResponse.data.transactions);
          setCustomerPoints(user.points || 0);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role, user?.points]);

  const statCards = [
    { label: 'Total Sales', value: formatPeso(stats?.total_sales), className: 'sales', code: 'TS' },
    { label: 'Completed', value: stats?.completed_transactions || 0, className: 'transactions', code: 'OK' },
    { label: 'Customers', value: stats?.total_customers || 0, className: 'customers', code: 'CU' },
    { label: 'Pending', value: stats?.pending_transactions || 0, className: 'pending', code: 'PD' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Retail Dashboard</h1>
          <p className="greeting">Welcome back, {user?.name}. Your live checkout and sales picture is ready.</p>
        </div>
        <div className="dashboard-highlight">
          <span>Role</span>
          <strong>{user?.role}</strong>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {(user?.role === 'admin' || user?.role === 'staff') && stats && (
        <div className="stats-grid">
          {statCards.map((card) => (
            <div key={card.label} className="card stat-card">
              <div className={`stat-icon ${card.className}`}>{card.code}</div>
              <div className="stat-content">
                <h3>{card.label}</h3>
                <p className="stat-value">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {user?.role === 'customer' && (
        <div className="card stat-card customer-points-card">
          <div className="stat-icon points">
            <span>⭐</span>
          </div>
          <div className="stat-content">
            <h3>Your Reward Points</h3>
            <p className="stat-value">{customerPoints} points</p>
          </div>
        </div>
      )}

      {(user?.role === 'admin' || user?.role === 'staff') && (
        <div className="dashboard-secondary-grid">
          <div className="card top-products-card">
            <div className="card-header">
              <h2 className="card-title">Best Sellers</h2>
              <span className="section-caption">Most sold products</span>
            </div>

            {loading ? (
              <div className="text-center mt-20">
                <span className="loader"></span>
              </div>
            ) : topProducts.length === 0 ? (
              <p className="text-muted">No sales yet</p>
            ) : (
              <div className="top-products-list">
                {topProducts.map((product) => (
                  <div key={product.id} className="top-product-row">
                    <img src={product.image || 'https://via.placeholder.com/160x120?text=Product'} alt={product.name} className="top-product-image" />
                    <div className="top-product-copy">
                      <strong>{product.name}</strong>
                      <span>{product.units_sold} units sold</span>
                    </div>
                    <span className="amount">{formatPeso(product.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card recent-transactions">
        <div className="card-header">
<h2 className="card-title">{user?.role === 'customer' ? 'Recent Purchases' : 'Recent Transactions'}</h2>
          <span className="section-caption">Latest retail checkouts</span>
        </div>

        {loading ? (
          <div className="text-center mt-20">
            <span className="loader"></span>
          </div>
        ) : recentTransactions.length === 0 ? (
          <p className="text-center text-muted mt-20">No transactions yet</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>#{transaction.id}</td>
                    <td>{transaction.customer_name}</td>
                    <td className="amount">{formatPeso(transaction.total_amount)}</td>
                    <td>
                      <span className={`badge badge-${transaction.status}`}>{transaction.status}</span>
                    </td>
                    <td>{new Date(transaction.created_at).toLocaleString()}</td>
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

export default Dashboard;
