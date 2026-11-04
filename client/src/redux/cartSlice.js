import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCart as apiFetchCart,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateQuantity,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  validateCoupon,
  calculateShipping,
} from '../_action/cartActions';

// ─── ASYNC THUNKS (REDUX THUNK FOR API CALLS) ───────────────────────────

// Fetch cart from backend
export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetchCart();
      return data.cart || { items: [], subtotal: 0, totalItems: 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add item to cart
export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const data = await apiAddToCart(productId, quantity);
      return data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update item quantity
export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await apiUpdateQuantity(productId, quantity);
      return data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Remove item from cart
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await apiRemoveFromCart(productId);
      return data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Clear entire cart
export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await apiClearCart();
      return { items: [], subtotal: 0, totalItems: 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

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

// ─── HELPER TO RECALCULATE COUPON ON CART CHANGE ───────────────────────
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

// ─── SLICE DEFINITION (REDUCERS & IMMUTABLE STATE UPDATES) ─────────────
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Synchronous action to apply coupon
    applyCoupon: (state, action) => {
      const result = validateCoupon(action.payload, state.subtotal);
      state.coupon = result;
    },
    // Synchronous action to remove coupon
    removeCoupon: (state) => {
      state.coupon = {
        code: '',
        isValid: false,
        discountAmount: 0,
        discountPercentage: 0,
        message: '',
      };
    },
    // Reset/logout cart state
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
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.totalItems = action.payload.totalItems || 0;
        state.coupon = recalculateCoupon(state.coupon, state.subtotal);
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cart';
      })

      // Add to Cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.items || [];
          state.subtotal = action.payload.subtotal || 0;
          state.totalItems = action.payload.totalItems || 0;
          state.coupon = recalculateCoupon(state.coupon, state.subtotal);
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add item';
      })

      // Update Quantity
      .addCase(updateQuantityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.items || [];
          state.subtotal = action.payload.subtotal || 0;
          state.totalItems = action.payload.totalItems || 0;
          state.coupon = recalculateCoupon(state.coupon, state.subtotal);
        }
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update quantity';
      })

      // Remove from Cart
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.items || [];
          state.subtotal = action.payload.subtotal || 0;
          state.totalItems = action.payload.totalItems || 0;
          state.coupon = recalculateCoupon(state.coupon, state.subtotal);
        }
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to remove item';
      })

      // Clear Cart
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.subtotal = 0;
        state.totalItems = 0;
        state.coupon = {
          code: '',
          isValid: false,
          discountAmount: 0,
          discountPercentage: 0,
          message: '',
        };
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to clear cart';
      });
  },
});

// ─── EXPORT ACTIONS ────────────────────────────────────────────────────
export const { applyCoupon, removeCoupon, resetCart } = cartSlice.actions;

// ─── MEMOIZED / DERIVED SELECTORS ──────────────────────────────────────
export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.totalItems;
export const selectSubtotal = (state) => state.cart.subtotal;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCoupon = (state) => state.cart.coupon;
export const selectDiscountAmount = (state) => state.cart.coupon.discountAmount || 0;

export const selectShippingFee = (state) => {
  const subtotal = state.cart.subtotal || 0;
  if (subtotal === 0 || state.cart.items.length === 0) return 0;
  return calculateShipping(subtotal);
};

export const selectTotalAmount = (state) => {
  const subtotal = state.cart.subtotal || 0;
  if (subtotal === 0 || state.cart.items.length === 0) return 0;
  const discount = state.cart.coupon.discountAmount || 0;
  const shipping = calculateShipping(subtotal);
  return Math.max(0, subtotal - discount + shipping);
};

export default cartSlice.reducer;
