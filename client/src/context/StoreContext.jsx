import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import api from '../api/client';
import {
  setCart,
  setLoading as setCartLoadingAction,
  setError as setCartErrorAction,
  applyCoupon as applyCouponAction,
  removeCoupon as removeCouponAction,
  resetCart,
  selectCart,
  selectCartLoading,
  selectCoupon,
  selectDiscountAmount,
  selectShippingFee,
  selectTotalAmount,
  selectSubtotal,
} from '../redux/cartSlice';
import {
  fetchCart as apiFetchCart,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateQuantity,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from '../_action/cartActions';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const dispatch = useDispatch();

  // Products & Categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);

  // Redux-Managed Cart State
  const cart = useSelector(selectCart);
  const cartLoading = useSelector(selectCartLoading);
  const coupon = useSelector(selectCoupon);
  const discountAmount = useSelector(selectDiscountAmount);
  const shippingFee = useSelector(selectShippingFee);
  const totalAmount = useSelector(selectTotalAmount);
  const subtotal = useSelector(selectSubtotal);

  // Wishlist, Orders, Addresses
  const [wishlist, setWishlist] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Global Toast Feedback from ToastContext
  const { showToast: triggerToast } = useToast();
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const showToast = useCallback((message, type = 'success') => {
    setFeedback({ type, message });
    triggerToast(message, type);
  }, [triggerToast]);

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

  // 2. Fetch User Data (Wishlist, Addresses, Orders & Sync Redux Cart)
  const loadUserData = useCallback(async () => {
    if (!isAuthenticated || isAdmin) return;
    try {
      // Fetch Cart directly from API and dispatch pure Redux action
      apiFetchCart()
        .then((data) => {
          if (data && data.cart) {
            dispatch(setCart(data.cart));
          }
        })
        .catch((err) => console.warn('Failed to load cart:', err));

      const [wishRes, addrRes, ordRes] = await Promise.all([
        api.get('/api/wishlist').catch(() => ({ data: { wishlist: { products: [] } } })),
        api.get('/api/addresses').catch(() => ({ data: { addresses: [] } })),
        api.get('/api/orders/my-orders').catch(() => ({ data: { orders: [] } })),
      ]);

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
  }, [isAuthenticated, isAdmin, dispatch]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Synchronize Redux cart lifecycle on logout/role switch
  useEffect(() => {
    if (!isAuthenticated || isAdmin) {
      dispatch(resetCart());
    }
  }, [isAuthenticated, isAdmin, dispatch]);

  // Redux Cart Operations (Direct API call + Pure Redux Action Dispatch)
  const addToCart = async (productId, quantity = 1) => {
    dispatch(setCartLoadingAction(true));
    try {
      const res = await apiAddToCart(productId, quantity);
      if (res.success && res.cart) {
        dispatch(setCart(res.cart));
        showToast('Item added to cart!');
        return { success: true, cart: res.cart };
      }
      dispatch(setCartLoadingAction(false));
      showToast(res.message, 'error');
      return { success: false, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch(setCartErrorAction(msg));
      showToast(msg || 'Failed to add item to cart', 'error');
      return { success: false, message: msg };
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return await removeFromCart(productId);
    }
    dispatch(setCartLoadingAction(true));
    try {
      const res = await apiUpdateQuantity(productId, quantity);
      if (res.success && res.cart) {
        dispatch(setCart(res.cart));
        return { success: true, cart: res.cart };
      }
      dispatch(setCartLoadingAction(false));
      showToast(res.message, 'error');
      return { success: false };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch(setCartErrorAction(msg));
      showToast(msg || 'Failed to update quantity', 'error');
      return { success: false, message: msg };
    }
  };

  const removeFromCart = async (productId) => {
    dispatch(setCartLoadingAction(true));
    try {
      const res = await apiRemoveFromCart(productId);
      if (res.success && res.cart) {
        dispatch(setCart(res.cart));
        showToast('Item removed from cart', 'info');
        return { success: true, cart: res.cart };
      }
      dispatch(setCartLoadingAction(false));
      showToast(res.message, 'error');
      return { success: false };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch(setCartErrorAction(msg));
      showToast(msg || 'Failed to remove item', 'error');
      return { success: false, message: msg };
    }
  };

  const clearCart = async () => {
    dispatch(setCartLoadingAction(true));
    try {
      await apiClearCart();
      dispatch(resetCart());
      showToast('Cart cleared', 'info');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch(setCartErrorAction(msg));
      showToast(msg || 'Failed to clear cart', 'error');
      return { success: false, message: msg };
    }
  };

  // Robust check for item quantity in cart
  const getItemQuantityInCart = useCallback(
    (productId) => {
      if (!cart || !cart.items) return 0;
      const item = cart.items.find((i) => {
        const id =
          i.product?._id ||
          (typeof i.product === 'string' ? i.product : null) ||
          i.productId?._id ||
          (typeof i.productId === 'string' ? i.productId : null);
        return String(id) === String(productId);
      });
      return item ? Number(item.quantity || 0) : 0;
    },
    [cart]
  );

  // Redux Coupon Actions
  const applyCouponCode = (code) => {
    dispatch(applyCouponAction(code));
    const trimmed = (code || '').trim().toUpperCase();
    if (trimmed === 'SAVE10') {
      showToast('Coupon SAVE10 applied! 10% discount added.', 'success');
      return { isValid: true, message: 'SAVE10 applied: 10% off' };
    } else {
      showToast('Invalid coupon code. Try SAVE10.', 'error');
      return { isValid: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    dispatch(removeCouponAction());
    showToast('Coupon removed', 'info');
  };

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
        dispatch(resetCart());
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
    try {
      const res = await api.patch(`/api/orders/${orderId}/cancel`);
      if (res.data.success) {
        showToast('Order cancelled successfully', 'info');
        const ordRes = await api.get('/api/orders/my-orders');
        if (ordRes.data.success) setMyOrders(ordRes.data.orders);
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  const refreshOrders = async () => {
    try {
      const ordRes = await api.get('/api/orders/my-orders');
      if (ordRes.data?.orders) {
        setMyOrders(ordRes.data.orders);
        showToast('Orders refreshed', 'info');
      }
    } catch (err) {
      showToast('Could not refresh orders', 'error');
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

  const updateAddress = async (id, updatedData) => {
    try {
      const res = await api.put(`/api/addresses/${id}`, updatedData);
      if (res.data.success) {
        setAddresses((prev) =>
          prev.map((a) => (a._id === id ? res.data.address : a))
        );
        showToast('Delivery address updated!');
        return { success: true, address: res.data.address };
      }
      return { success: false };
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
      return { success: false };
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await api.delete(`/api/addresses/${id}`);
      if (res.data.success) {
        setAddresses((prev) => {
          const next = prev.filter((a) => a._id !== id);
          if (selectedAddressId === id) {
            setSelectedAddressId(next.length > 0 ? next[0]._id : '');
          }
          return next;
        });
        showToast('Delivery address deleted');
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
    refreshOrders,
    placeOrder,
    cancelOrder,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    setPaymentMethod,
    addAddress,
    updateAddress,
    deleteAddress,
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
