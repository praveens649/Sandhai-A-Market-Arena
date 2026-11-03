import api from '../api/client';

export const placeOrder = async (orderPayload) => {
  const res = await api.post('/api/orders', orderPayload);
  return res.data;
};

export const fetchMyOrders = async () => {
  const res = await api.get('/api/orders/my-orders');
  return res.data;
};

export const cancelOrder = async (orderId) => {
  const res = await api.patch(`/api/orders/${orderId}/cancel`);
  return res.data;
};

export const fetchAllOrdersAdmin = async () => {
  const res = await api.get('/api/admin/orders');
  return res.data;
};

export const updateOrderStatusAdmin = async (orderId, orderStatus) => {
  const res = await api.patch(`/api/admin/orders/${orderId}/status`, { orderStatus });
  return res.data;
};

