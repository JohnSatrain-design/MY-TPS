import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-mark">TPS</span>
          <span className="brand-copy">
            <strong>Transaction Hub</strong>
            <small>Realtime processing and reporting</small>
          </span>
        </Link>

        {user && (
          <div className="navbar-content">
            <div className="navbar-user">
              <span className="user-name">{user.name}</span>
              <span className={`badge badge-${user.role}`}>{user.role}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
