import api from '../api/client';

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'all') query.append('category', params.category);
  if (params.search) query.append('search', params.search);
  if (params.limit) query.append('limit', params.limit);

  const res = await api.get(`/api/products?${query.toString()}`);
  return res.data;
};

export const fetchCategories = async () => {
  const res = await api.get('/api/categories');
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await api.post('/api/products', productData);
  return res.data;
};

export const updateProduct = async (id, productData) => {
  const res = await api.put(`/api/products/${id}`, productData);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/api/products/${id}`);
  return res.data;
};

