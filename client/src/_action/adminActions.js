import api from '../api/client';

export const fetchAdminDashboard = async () => {
  const res = await api.get('/api/admin/dashboard');
  return res.data;
};

export const fetchAdminOrders = async () => {
  const res = await api.get('/api/admin/orders');
  return res.data;
};

export const updateAdminOrderStatus = async (orderId, orderStatus) => {
  const res = await api.patch(`/api/admin/orders/${orderId}/status`, { orderStatus });
  return res.data;
};

export const fetchAdminUsers = async () => {
  const res = await api.get('/api/admin/users');
  return res.data;
};

export const updateAdminUserStatus = async (userId, isActive) => {
  const res = await api.patch(`/api/admin/users/${userId}/status`, { isActive });
  return res.data;
};

export const createAdminProduct = async (productData) => {
  const res = await api.post('/api/products', productData);
  return res.data;
};

export const updateAdminProduct = async (id, productData) => {
  const res = await api.put(`/api/products/${id}`, productData);
  return res.data;
};

export const deleteAdminProduct = async (id) => {
  const res = await api.delete(`/api/products/${id}`);
  return res.data;
};

export const createAdminCategory = async (categoryData) => {
  const res = await api.post('/api/categories', categoryData);
  return res.data;
};

export const updateAdminCategory = async (id, categoryData) => {
  const res = await api.put(`/api/categories/${id}`, categoryData);
  return res.data;
};

export const deleteAdminCategory = async (id) => {
  const res = await api.delete(`/api/categories/${id}`);
  return res.data;
};

