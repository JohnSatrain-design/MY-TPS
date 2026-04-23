import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  search: (query) => api.get('/customers/search', { params: { query } }),
  registerCustomer: (data) => api.post('/customers/register', data),
  updateProfile: (data) => api.patch('/customers/me', data)
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data)
};

export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  updateStatus: (id, status) => api.patch(`/transactions/${id}/status`, { status }),
  getByCustomer: (customerId) => api.get(`/transactions/customer/${customerId}`),
  delete: (id) => api.delete(`/transactions/${id}`)
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentTransactions: (limit = 10, offset = 0) =>
    api.get('/dashboard/transactions/recent', { params: { limit, offset } }),
  getDailySalesReport: () => api.get('/dashboard/reports/daily'),
  getMonthlySalesReport: () => api.get('/dashboard/reports/monthly'),
  getSalesByStatus: () => api.get('/dashboard/reports/status'),
  getTopCustomers: (limit = 10) =>
    api.get('/dashboard/customers/top', { params: { limit } }),
  getTopProducts: (limit = 5) =>
    api.get('/dashboard/products/top', { params: { limit } }),
  getActivityLogs: (limit = 50, offset = 0) =>
    api.get('/dashboard/logs/activity', { params: { limit, offset } }),
  exportTransactions: () =>
    api.get('/dashboard/export/transactions', { responseType: 'blob' })
};

export default api;
