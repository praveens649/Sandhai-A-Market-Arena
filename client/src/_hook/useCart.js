import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateQuantity,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  validateCoupon,
  calculateShipping,
} from '../_action/cartActions';

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState({
    code: '',
    isValid: false,
    discountAmount: 0,
    discountPercentage: 0,
    message: '',
  });

  const loadCart = useCallback(async () => {
    try {
      const res = await fetchCart();
      if (res.cart) {
        setCart(res.cart);
      }
    } catch (err) {
      // Cart might be empty or unauthenticated
      setCart({ items: [], subtotal: 0, totalItems: 0 });
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Handle adding an item
  const addItem = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const res = await apiAddToCart(productId, quantity);
      if (res.success) {
        setCart(res.cart);
        return { success: true, message: 'Item added to cart!' };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  // Handle updating quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return await removeItem(productId);
      }
      const res = await apiUpdateQuantity(productId, quantity);
      if (res.success) {
        setCart(res.cart);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // Handle removing item
  const removeItem = async (productId) => {
    try {
      const res = await apiRemoveFromCart(productId);
      if (res.success) {
        setCart(res.cart);
        return { success: true, message: 'Item removed from cart' };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // Handle clearing cart
  const clear = async () => {
    try {
      const res = await apiClearCart();
      if (res.success) {
        setCart({ items: [], subtotal: 0, totalItems: 0 });
        setCoupon({ code: '', isValid: false, discountAmount: 0, discountPercentage: 0, message: '' });
        return { success: true, message: 'Cart cleared' };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // Check how many of a product are currently in cart
  const getItemQuantityInCart = useCallback(
    (productId) => {
      if (!cart || !cart.items) return 0;
      const item = cart.items.find((i) => (i.productId?._id || i.productId) === productId);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  // Apply Coupon Code (SAVE10 business rule from PDF Page 1 & 6)
  const applyCouponCode = (code) => {
    const subtotal = cart?.subtotal || 0;
    const result = validateCoupon(code, subtotal);
    setCoupon(result);
    return result;
  };

  const removeCoupon = () => {
    setCoupon({ code: '', isValid: false, discountAmount: 0, discountPercentage: 0, message: '' });
  };

  // Recalculate coupon discount if subtotal changes
  useEffect(() => {
    if (coupon.isValid && coupon.code === 'SAVE10') {
      const subtotal = cart?.subtotal || 0;
      const newDiscount = Math.round(subtotal * 0.1);
      setCoupon((prev) => ({ ...prev, discountAmount: newDiscount }));
    }
  }, [cart?.subtotal, coupon.isValid, coupon.code]);

  // Derived financial computations
  const subtotal = cart?.subtotal || 0;
  const discountAmount = coupon.isValid ? coupon.discountAmount : 0;
  const shippingFee = calculateShipping(subtotal);
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  return {
    cart,
    setCart,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    getItemQuantityInCart,
    // Coupon & Pricing
    coupon,
    applyCouponCode,
    removeCoupon,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    loadCart,
  };
};

