import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const API = axios.create({ baseURL: apiBaseUrl });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const registerUser = (data) => API.post('/auth/register', data);

export const getMenu = () => API.get('/menu');
export const getCategories = () => API.get('/menu/categories');
export const createMenuItem = (data) => API.post('/menu', data);
export const updateMenuItem = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);

export const getTables = () => API.get('/tables');
export const createTable = (data) => API.post('/tables', data);
export const updateTable = (id, data) => API.put(`/tables/${id}`, data);

export const getOrders = (params) => API.get('/orders', { params });
export const getActiveOrders = () => API.get('/orders/active');
export const getKitchenOrders = () => API.get('/orders/kitchen');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const createOrder = (data) => API.post('/orders', data);
export const updateOrderItems = (id, data) => API.put(`/orders/${id}/items`, data);
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);

export const getDailyReport = (date) => API.get('/reports/daily', { params: { date } });

export default API;
