import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import { formatPeso } from '../utils/currency';
import './Reports.css';

const Reports = () => {
  const [dailyReport, setDailyReport] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [statusReport, setStatusReport] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError('');

        const [daily, monthly, status, customers, products] = await Promise.all([
          dashboardAPI.getDailySalesReport(),
          dashboardAPI.getMonthlySalesReport(),
          dashboardAPI.getSalesByStatus(),
          dashboardAPI.getTopCustomers(10),
          dashboardAPI.getTopProducts(10)
        ]);

        setDailyReport(daily.data.report);
        setMonthlyReport(monthly.data.report);
        setStatusReport(status.data.report);
        setTopCustomers(customers.data.customers);
        setTopProducts(products.data.products);
      } catch (err) {
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await dashboardAPI.exportTransactions();
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="reports">
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="reports-subtitle">MySQL-backed summaries for daily operations and revenue tracking.</p>
        </div>
        <button onClick={handleExport} className="btn btn-primary" disabled={exporting}>
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="text-center mt-20">
          <span className="loader"></span>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="card-header">
              <h2>Sales by Status</h2>
            </div>
            <div className="status-grid">
              {statusReport.map((report) => (
                <div key={report.status} className="status-card">
                  <div className="status-badge-lg">
                    <span className={`badge badge-${report.status}`}>{report.status}</span>
                  </div>
                  <p className="status-count">{report.count} transactions</p>
                  <p className="status-amount">{formatPeso(report.amount)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Top Customers</h2>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Transactions</th>
                    <th>Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="customer-name">{customer.name}</td>
                      <td>{customer.contact || '-'}</td>
                      <td className="text-center">{customer.transaction_count}</td>
                      <td className="amount">{formatPeso(customer.total_spent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Product Performance</h2>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="customer-name">{product.name}</td>
                      <td className="text-center">{product.units_sold}</td>
                      <td className="amount">{formatPeso(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Daily Sales Report</h2>
            </div>
            {dailyReport.length === 0 ? (
              <p className="text-center text-muted mt-20">No data available</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Transactions</th>
                      <th>Sales Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyReport.map((report) => (
                      <tr key={report.date}>
                        <td>{formatDate(report.date)}</td>
                        <td className="text-center">{report.transaction_count}</td>
                        <td className="amount">{formatPeso(report.daily_sales)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Monthly Sales Report</h2>
            </div>
            {monthlyReport.length === 0 ? (
              <p className="text-center text-muted mt-20">No data available</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Transactions</th>
                      <th>Sales Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyReport.map((report) => (
                      <tr key={report.month}>
                        <td>{report.month}</td>
                        <td className="text-center">{report.transaction_count}</td>
                        <td className="amount">{formatPeso(report.monthly_sales)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
