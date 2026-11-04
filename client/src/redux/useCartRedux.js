import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  setCart,
  setLoading,
  setError,
  applyCoupon,
  removeCoupon,
  resetCart,
  selectCart,
  selectCartItems,
  selectCartCount,
  selectSubtotal,
  selectCartLoading,
  selectCartError,
  selectCoupon,
  selectDiscountAmount,
  selectShippingFee,
  selectTotalAmount,
} from './cartSlice';
import {
  fetchCart as apiFetchCart,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateQuantity,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from '../_action/cartActions';
import { useToast } from '../context/ToastContext';

/**
 * Custom hook to interact with Redux Cart state and actions without createAsyncThunk.
 * Performs direct API calls and dispatches pure Redux actions.
 */
export const useCartRedux = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const cart = useSelector(selectCart);
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectSubtotal);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const coupon = useSelector(selectCoupon);
  const discountAmount = useSelector(selectDiscountAmount);
  const shippingFee = useSelector(selectShippingFee);
  const totalAmount = useSelector(selectTotalAmount);

  // 1. Fetch Cart from API -> dispatch pure setCart action
  const loadCart = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await apiFetchCart();
      const cartData = data.cart || { items: [], subtotal: 0, totalItems: 0 };
      dispatch(setCart(cartData));
      return { success: true, cart: cartData };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch(setError(msg));
      return { success: false, message: msg };
    }
  }, [dispatch]);

  // 2. Add to Cart -> dispatch pure setCart action
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      dispatch(setLoading(true));
      try {
        const data = await apiAddToCart(productId, quantity);
        if (data.cart) {
          dispatch(setCart(data.cart));
          showToast('Item added to cart!', 'success');
          return { success: true, cart: data.cart };
        }
        dispatch(setLoading(false));
        return { success: false, message: data.message };
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        dispatch(setError(msg));
        showToast(msg || 'Failed to add item to cart', 'error');
        return { success: false, message: msg };
      }
    },
    [dispatch, showToast]
  );

  // 3. Update Item Quantity -> dispatch pure setCart action
  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity <= 0) {
        return removeItem(productId);
      }
      dispatch(setLoading(true));
      try {
        const data = await apiUpdateQuantity(productId, quantity);
        if (data.cart) {
          dispatch(setCart(data.cart));
          return { success: true, cart: data.cart };
        }
        dispatch(setLoading(false));
        return { success: false };
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        dispatch(setError(msg));
        showToast(msg || 'Failed to update quantity', 'error');
        return { success: false, message: msg };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, showToast]
  );

  // 4. Remove Item from Cart -> dispatch pure setCart action
  const removeItem = useCallback(
    async (productId) => {
      dispatch(setLoading(true));
      try {
        const data = await apiRemoveFromCart(productId);
        if (data.cart) {
          dispatch(setCart(data.cart));
          showToast('Item removed from cart', 'info');
          return { success: true, cart: data.cart };
        }
        dispatch(setLoading(false));
        return { success: false };
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        dispatch(setError(msg));
        showToast(msg || 'Failed to remove item', 'error');
        return { success: false, message: msg };
      }
    },
    [dispatch, showToast]
  );

  // 5. Clear entire Cart -> dispatch pure resetCart action
  const clearAllCart = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      await apiClearCart();
      dispatch(resetCart());
      showToast('Cart cleared', 'info');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch(setError(msg));
      showToast(msg || 'Failed to clear cart', 'error');
      return { success: false, message: msg };
    }
  }, [dispatch, showToast]);

  // 6. Apply Promo Code
  const applyPromo = useCallback(
    (code) => {
      dispatch(applyCoupon(code));
      const trimmed = (code || '').trim().toUpperCase();
      if (trimmed === 'SAVE10') {
        showToast('Coupon SAVE10 applied! 10% discount added.', 'success');
        return { isValid: true, message: 'SAVE10 applied: 10% off' };
      } else {
        showToast('Invalid coupon code. Try SAVE10.', 'error');
        return { isValid: false, message: 'Invalid coupon code' };
      }
    },
    [dispatch, showToast]
  );

  // 7. Remove Promo Code
  const removePromo = useCallback(() => {
    dispatch(removeCoupon());
    showToast('Coupon removed', 'info');
  }, [dispatch, showToast]);

  // 8. Reset Redux Cart
  const reset = useCallback(() => {
    dispatch(resetCart());
  }, [dispatch]);

  return {
    // Redux State
    cart,
    items,
    count,
    subtotal,
    loading,
    error,
    coupon,
    discountAmount,
    shippingFee,
    totalAmount,
    // Operations
    loadCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearAllCart,
    applyPromo,
    removePromo,
    reset,
    dispatch,
  };
};

export default useCartRedux;
