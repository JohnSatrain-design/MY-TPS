import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { customerAPI } from '../services/api';
import './Profile.css';  // Create this or use Customers.css

const Profile = () => {
  const { user, fetchCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    city: '',
    state: '',
    postal_code: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.customer_name || user.name || '',
        contact: user.contact || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postal_code: user.postal_code || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await customerAPI.updateProfile(formData);
      setSuccess('Profile updated successfully! Changes reflected system-wide.');
      // Refetch user to update context
      fetchCurrentUser ? fetchCurrentUser() : window.location.reload();
    } catch (err) {
      setError(err.response?.data?.details?.[0]?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center"><span className="loader"></span></div>;

  return (
    <div className="profile-page">
      <div className="card">
        <div className="card-header">
          <h1>My Profile</h1>
          <p>Update your contact details (visible to admin/staff)</p>
        </div>
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} />
            </div>
            <div className="form-group form-group-span">
              <label>Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

