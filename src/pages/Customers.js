import React, { useEffect, useState } from 'react';
import { customerAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';
import './Customers.css';

const initialFormData = {
  name: '',
  contact: '',
  email: '',
  password: '',
  address: '',
  city: '',
  state: '',
  postal_code: ''
};

const Customers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const canEdit = user?.role === 'admin' || user?.role === 'staff';

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await customerAPI.getAll();
      setCustomers(response.data.customers);
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      fetchCustomers();
      return;
    }

    try {
      const response = await customerAPI.search(query.trim());
      setCustomers(response.data.customers);
    } catch (err) {
      setError('Search failed');
    }
  };

  const handleFormChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setNotice('');

    try {
      if (editingId) {
        await customerAPI.update(editingId, formData);
        setNotice('Customer updated successfully.');
      } else if (formData.email && formData.password) {
        await customerAPI.registerCustomer({ name: formData.name, email: formData.email, password: formData.password, contact: formData.contact });
        setNotice('Customer account registered successfully.');
      } else {
        await customerAPI.create(formData);
        setNotice('Customer created successfully.');
      }

      await fetchCustomers();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name || '',
      contact: customer.contact || '',
      email: customer.email || '',
      password: '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      postal_code: customer.postal_code || ''
    });
    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer and related transactions?')) {
      return;
    }

    try {
      await customerAPI.delete(id);
      setNotice('Customer deleted successfully.');
      await fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="customers">
      <div className="customers-header">
        <div>
          <h1>Customers</h1>
          <p className="page-subtitle">Manage customer records with fast search and clean account details.</p>
        </div>
        {canEdit && (
          <button onClick={() => setShowForm((current) => !current)} className="btn btn-primary">
            {showForm ? 'Close Form' : 'Add Customer'}
          </button>
        )}
      </div>

      {notice && <div className="alert alert-success">{notice}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-container">
        <input
          type="text"
          className="form-input search-input"
          placeholder="Search by customer name, contact, or linked email"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {showForm && canEdit && (
        <div className="card form-card">
          <div className="card-header">
            <h2>{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input type="text" className="form-input" name="name" value={formData.name} onChange={handleFormChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input type="password" className="form-input" name="password" value={formData.password} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Contact</label>
                <input type="text" className="form-input" name="contact" value={formData.contact} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" className="form-input" name="city" value={formData.city} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input type="text" className="form-input" name="state" value={formData.state} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input type="text" className="form-input" name="postal_code" value={formData.postal_code} onChange={handleFormChange} />
              </div>

              <div className="form-group form-group-span">
                <label className="form-label">Address</label>
                <textarea className="form-textarea" name="address" value={formData.address} onChange={handleFormChange} />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Customer' : 'Create Customer'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Customer List</h2>
          <span className="customer-count">{customers.length} total</span>
        </div>

        {loading ? (
          <div className="text-center mt-20">
            <span className="loader"></span>
          </div>
        ) : customers.length === 0 ? (
          <p className="text-center text-muted mt-20">No customers found</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Created</th>
                  {canEdit && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="customer-name">{customer.name}</td>
                    <td>{customer.contact || '-'}</td>
                    <td>{customer.email || '-'}</td>
                    <td>{[customer.city, customer.state].filter(Boolean).join(', ') || '-'}</td>
                    <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                    {canEdit && (
                      <td className="actions">
                        <button onClick={() => handleEdit(customer)} className="btn-icon edit" title="Edit">
                          Edit
                        </button>
                        {user?.role === 'admin' && (
                          <button onClick={() => handleDelete(customer.id)} className="btn-icon delete" title="Delete">
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

export default Customers;
