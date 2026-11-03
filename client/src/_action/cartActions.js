import api from '../api/client';

export const fetchCart = async () => {
  const res = await api.get('/api/cart');
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await api.post('/api/cart/items', { productId, quantity });
  return res.data;
};

export const updateCartItemQuantity = async (productId, quantity) => {
  const res = await api.patch(`/api/cart/items/${productId}`, { quantity });
  return res.data;
};

export const removeFromCart = async (productId) => {
  const res = await api.delete(`/api/cart/items/${productId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete('/api/cart');
  return res.data;
};

// Business rules for discount and coupon validation (Page 1 & 6 of PDF)
export const validateCoupon = (couponCode, subtotal) => {
  const code = (couponCode || '').trim().toUpperCase();
  if (code === 'SAVE10') {
    const discount = Math.round(subtotal * 0.1);
    return {
      isValid: true,
      code: 'SAVE10',
      discountPercentage: 10,
      discountAmount: discount,
      message: 'SAVE10 applied: 10% off',
    };
  }
  return {
    isValid: false,
    code: '',
    discountPercentage: 0,
    discountAmount: 0,
    message: 'Invalid coupon code',
  };
};

export const calculateShipping = (subtotal) => {
  // Free when subtotal >= ₹500, otherwise flat ₹40
  return subtotal >= 500 ? 0 : 40;
};

