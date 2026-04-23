import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import './Logs.css';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError('');
        const offset = (page - 1) * itemsPerPage;
        const response = await dashboardAPI.getActivityLogs(itemsPerPage, offset);
        setLogs(response.data.logs);
      } catch (err) {
        setError('Failed to load activity logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page]);

  const formatDate = (date) => new Date(date).toLocaleString();

  const getActionIcon = (action) => {
    if (action.includes('login')) return 'LG';
    if (action.includes('created')) return 'CR';
    if (action.includes('updated')) return 'UP';
    if (action.includes('deleted')) return 'DL';
    return 'AC';
  };

  return (
    <div className="logs">
      <div className="logs-header">
        <h1>Activity Logs</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h2>System Activity</h2>
          <span className="log-count">{logs.length} entries</span>
        </div>

        {loading ? (
          <div className="text-center mt-20">
            <span className="loader"></span>
          </div>
        ) : logs.length === 0 ? (
          <p className="text-center text-muted mt-20">No activity logs found</p>
        ) : (
          <>
            <div className="logs-list">
              {logs.map((log) => (
                <div key={log.id} className="log-entry">
                  <div className="log-icon">{getActionIcon(log.action)}</div>
                  <div className="log-content">
                    <p className="log-user">
                      <strong>{log.user_name || 'System'}</strong>
                    </p>
                    <p className="log-action">{log.action}</p>
                    {log.entity_type && (
                      <p className="log-entity">
                        {log.entity_type} #{log.entity_id}
                      </p>
                    )}
                  </div>
                  <div className="log-date">{formatDate(log.created_at)}</div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="btn btn-secondary">
                Previous
              </button>
              <span className="page-info">Page {page}</span>
              <button onClick={() => setPage(page + 1)} disabled={logs.length < itemsPerPage} className="btn btn-secondary">
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Logs;
