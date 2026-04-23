import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', shortLabel: 'DB' },
    { to: '/transactions', label: 'Transactions', shortLabel: 'TX' },
    ...(user?.role === 'customer' ? [{ to: '/profile', label: 'Profile', shortLabel: 'PF' }] : [])
  ];

  if (user?.role === 'admin' || user?.role === 'staff') {
    navItems.splice(2, 0, { to: '/customers', label: 'Customers', shortLabel: 'CU' });
    navItems.splice(3, 0, { to: '/products', label: 'Products', shortLabel: 'PR' });
    navItems.push({ to: '/reports', label: 'Reports', shortLabel: 'RP' });
  }

  if (user?.role === 'admin') {
    navItems.push({ to: '/logs', label: 'Activity Logs', shortLabel: 'LG' });
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-toggle">
        <button
          onClick={() => setIsOpen((current) => !current)}
          className="toggle-btn"
          aria-label="Toggle sidebar"
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`nav-item ${location.pathname === item.to ? 'active' : ''}`}
            title={item.label}
          >
            <span className="nav-pill">{item.shortLabel}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
