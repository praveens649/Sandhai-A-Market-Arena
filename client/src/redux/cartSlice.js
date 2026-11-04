import { createSlice } from '@reduxjs/toolkit';
import { validateCoupon, calculateShipping } from '../_action/cartActions';

// Helper to recalculate coupon validity and discount amount on subtotal changes
const recalculateCoupon = (coupon, subtotal) => {
  if (!coupon || !coupon.isValid || !coupon.code) {
    return {
      code: '',
      isValid: false,
      discountAmount: 0,
      discountPercentage: 0,
      message: '',
    };
  }
  return validateCoupon(coupon.code, subtotal);
};

// ─── INITIAL REDUX STATE ───────────────────────────────────────────────
const initialState = {
  items: [],
  subtotal: 0,
  totalItems: 0,
  loading: false,
  error: null,
  coupon: {
    code: '',
    isValid: false,
    discountAmount: 0,
    discountPercentage: 0,
    message: '',
  },
};

// ─── PURE REDUX TOOLKIT SLICE (NO THUNKS) ──────────────────────────────
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Set full cart in Redux state (dispatched after API responses)
    setCart: (state, action) => {
      const payload = action.payload || {};
      state.items = payload.items || [];
      state.subtotal = payload.subtotal || 0;
      state.totalItems = payload.totalItems || 0;
      state.coupon = recalculateCoupon(state.coupon, state.subtotal);
      state.loading = false;
      state.error = null;
    },

    // 2. Set loading state
    setLoading: (state, action) => {
      state.loading = Boolean(action.payload);
    },

    // 3. Set error state
    setError: (state, action) => {
      state.error = action.payload || null;
      state.loading = false;
    },

    // 4. Apply discount coupon code (e.g. SAVE10)
    applyCoupon: (state, action) => {
      state.coupon = validateCoupon(action.payload, state.subtotal);
    },

    // 5. Remove discount coupon code
    removeCoupon: (state) => {
      state.coupon = {
        code: '',
        isValid: false,
        discountAmount: 0,
        discountPercentage: 0,
        message: '',
      };
    },

    // 6. Reset / clear cart on checkout or logout
    resetCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalItems = 0;
      state.loading = false;
      state.error = null;
      state.coupon = {
        code: '',
        isValid: false,
        discountAmount: 0,
        discountPercentage: 0,
        message: '',
      };
    },
  },
});

// ─── EXPORT PURE ACTIONS ───────────────────────────────────────────────
export const {
  setCart,
  setLoading,
  setError,
  applyCoupon,
  removeCoupon,
  resetCart,
} = cartSlice.actions;

// ─── REDUX SELECTORS ───────────────────────────────────────────────────
export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.totalItems;
export const selectSubtotal = (state) => state.cart.subtotal;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCoupon = (state) => state.cart.coupon;
export const selectDiscountAmount = (state) => state.cart.coupon.discountAmount || 0;

// Business rule: Free shipping when subtotal >= ₹500, otherwise flat ₹40
export const selectShippingFee = (state) => {
  const subtotal = state.cart.subtotal || 0;
  if (subtotal === 0 || state.cart.items.length === 0) return 0;
  return calculateShipping(subtotal);
};

// Grand total calculation: subtotal - discount + shippingFee
export const selectTotalAmount = (state) => {
  const subtotal = state.cart.subtotal || 0;
  if (subtotal === 0 || state.cart.items.length === 0) return 0;
  const discount = state.cart.coupon.discountAmount || 0;
  const shipping = calculateShipping(subtotal);
  return Math.max(0, subtotal - discount + shipping);
};

export default cartSlice.reducer;
