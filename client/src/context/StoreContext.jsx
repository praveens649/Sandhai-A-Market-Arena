import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/client';
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateQuantity,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  validateCoupon,
  calculateShipping,
} from '../_action/cartActions';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Products & Categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);

  // Cart
  const [cart, setCart] = useState({ items: [], subtotal: 0, totalItems: 0 });
  const [cartLoading, setCartLoading] = useState(false);
  const [coupon, setCoupon] = useState({
    code: '',
    isValid: false,
    discountAmount: 0,
    discountPercentage: 0,
    message: '',
  });

  // Wishlist, Orders, Addresses
  const [wishlist, setWishlist] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Global Toast Feedback
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const showToast = useCallback((message, type = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  }, []);

  // 1. Fetch Products & Categories
  const loadCatalog = useCallback(async () => {
    setLoadingProducts(true);
    setProductError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/api/products?limit=100'),
        api.get('/api/categories'),
      ]);

      const dummyRatings = [4.5, 4.7, 4.3, 4.6, 4.8, 4.4, 4.2, 4.5, 4.1, 4.9];
      const dummyReviews = [128, 86, 212, 304, 59, 97, 410, 73, 115, 64];
      const dummyDiscounts = [20, 0, 10, 0, 0, 20, 0, 0, 15, 0];

      const enriched = (prodRes.data.products || []).map((p, idx) => {
        const rating = p.rating || dummyRatings[idx % dummyRatings.length];
        const reviewCount = p.reviewCount || dummyReviews[idx % dummyReviews.length];
        const discountPercentage =
          p.discountPercentage !== undefined
            ? p.discountPercentage
            : dummyDiscounts[idx % dummyDiscounts.length];
        const originalPrice =
          discountPercentage > 0 ? Math.round(p.price / (1 - discountPercentage / 100)) : p.price;

        return {
          ...p,
          rating,
          reviewCount,
          discountPercentage,
          originalPrice,
        };
      });

      setProducts(enriched);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error('Failed to load catalog:', err);
      setProductError(err.message || 'Could not load products.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // 2. Fetch User Data (Cart, Wishlist, Addresses, Orders)
  const loadUserData = useCallback(async () => {
    if (!isAuthenticated || isAdmin) return;
    try {
      const [cartRes, wishRes, addrRes, ordRes] = await Promise.all([
        fetchCart().catch(() => ({ cart: null })),
        api.get('/api/wishlist').catch(() => ({ data: { wishlist: { products: [] } } })),
        api.get('/api/addresses').catch(() => ({ data: { addresses: [] } })),
        api.get('/api/orders/my-orders').catch(() => ({ data: { orders: [] } })),
      ]);

      if (cartRes.cart) setCart(cartRes.cart);
      if (wishRes.data.wishlist) setWishlist(wishRes.data.wishlist.products || []);
      if (addrRes.data.addresses) {
        const addrs = addrRes.data.addresses || [];
        setAddresses(addrs);
        const def = addrs.find((a) => a.isDefault) || addrs[0];
        if (def) setSelectedAddressId(def._id);
      }
      if (ordRes.data.orders) setMyOrders(ordRes.data.orders || []);
    } catch (err) {
      console.error('Failed to load customer data:', err);
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Cart Operations
  const addToCart = async (productId, quantity = 1) => {
    setCartLoading(true);
    try {
      const res = await apiAddToCart(productId, quantity);
      if (res.success) {
        setCart(res.cart);
        showToast('Item added to cart!');
        return { success: true };
      }
      showToast(res.message, 'error');
      return { success: false };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return await removeFromCart(productId);
      }
      const res = await apiUpdateQuantity(productId, quantity);
      if (res.success) {
        setCart(res.cart);
        return { success: true };
      }
      showToast(res.message, 'error');
      return { success: false };
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
      return { success: false };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await apiRemoveFromCart(productId);
      if (res.success) {
        setCart(res.cart);
        showToast('Item removed from cart');
        return { success: true };
      }
      showToast(res.message, 'error');
      return { success: false };
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      const res = await apiClearCart();
      if (res.success) {
        setCart({ items: [], subtotal: 0, totalItems: 0 });
        setCoupon({ code: '', isValid: false, discountAmount: 0, discountPercentage: 0, message: '' });
        showToast('Cart cleared');
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
      return { success: false };
    }
  };

  const getItemQuantityInCart = useCallback(
    (productId) => {
      if (!cart || !cart.items) return 0;
      const item = cart.items.find((i) => (i.productId?._id || i.productId) === productId);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  // Coupon Business Rule (SAVE10)
  const applyCouponCode = (code) => {
    const res = validateCoupon(code, cart.subtotal || 0);
    setCoupon(res);
    return res;
  };

  const removeCoupon = () => {
    setCoupon({ code: '', isValid: false, discountAmount: 0, discountPercentage: 0, message: '' });
  };

  useEffect(() => {
    if (coupon.isValid && coupon.code === 'SAVE10') {
      const newDisc = Math.round((cart.subtotal || 0) * 0.1);
      setCoupon((prev) => ({ ...prev, discountAmount: newDisc }));
    }
  }, [cart.subtotal, coupon.isValid, coupon.code]);

  // Financial computations
  const subtotal = cart?.subtotal || 0;
  const discountAmount = coupon.isValid ? coupon.discountAmount : 0;
  const shippingFee = calculateShipping(subtotal);
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  // Wishlist Operations
  const toggleWishlist = async (productId) => {
    const isSaved = wishlist.some((p) => (p._id || p) === productId);
    try {
      if (isSaved) {
        const res = await api.delete(`/api/wishlist/items/${productId}`);
        if (res.data.success) {
          setWishlist(res.data.wishlist.products || []);
          showToast('Removed from wishlist');
        }
      } else {
        const res = await api.post('/api/wishlist/items', { productId });
        if (res.data.success) {
          setWishlist(res.data.wishlist.products || []);
          showToast('Added to wishlist!');
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  const moveWishlistToCart = async (productId) => {
    const res = await addToCart(productId, 1);
    if (res.success) {
      await toggleWishlist(productId);
    }
  };

  // Order Placement
  const placeOrder = async () => {
    if (!selectedAddressId) {
      showToast('Please select or add a delivery address first', 'error');
      return { success: false };
    }
    try {
      const res = await api.post('/api/orders', {
        addressId: selectedAddressId,
        paymentMethod,
        discountAmount,
      });
      if (res.data.success) {
        showToast('Order placed successfully! Thank you for ordering from Sandhai.');
        setCart({ items: [], subtotal: 0, totalItems: 0 });
        removeCoupon();
        const ordRes = await api.get('/api/orders/my-orders');
        if (ordRes.data.success) setMyOrders(ordRes.data.orders);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await api.patch(`/api/orders/${orderId}/cancel`);
      if (res.data.success) {
        showToast('Order cancelled');
        const ordRes = await api.get('/api/orders/my-orders');
        if (ordRes.data.success) setMyOrders(ordRes.data.orders);
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  const addAddress = async (newAddress) => {
    try {
      const res = await api.post('/api/addresses', newAddress);
      if (res.data.success) {
        setAddresses([res.data.address, ...addresses]);
        setSelectedAddressId(res.data.address._id);
        showToast('Delivery address saved!');
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
      return { success: false };
    }
  };

  const value = {
    // Catalog
    products,
    categories,
    loadingProducts,
    productError,
    retryCatalog: loadCatalog,
    setProducts,
    // Cart
    cart,
    cartLoading,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getItemQuantityInCart,
    // Coupon & Pricing
    coupon,
    applyCouponCode,
    removeCoupon,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    // Wishlist
    wishlist,
    toggleWishlist,
    moveWishlistToCart,
    // Orders & Addresses
    myOrders,
    placeOrder,
    cancelOrder,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    setPaymentMethod,
    addAddress,
    // Toast
    feedback,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

