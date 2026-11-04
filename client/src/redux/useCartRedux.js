import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchCartAsync,
  addToCartAsync,
  updateQuantityAsync,
  removeFromCartAsync,
  clearCartAsync,
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
import { useToast } from '../context/ToastContext';

/**
 * Custom hook to interact with Redux Cart state and actions.
 * Simplifies Redux usage across components with built-in toast messages.
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

  const loadCart = useCallback(() => {
    return dispatch(fetchCartAsync()).unwrap();
  }, [dispatch]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      try {
        const result = await dispatch(addToCartAsync({ productId, quantity })).unwrap();
        showToast('Item added to cart!', 'success');
        return { success: true, cart: result };
      } catch (err) {
        showToast(err || 'Failed to add item to cart', 'error');
        return { success: false, message: err };
      }
    },
    [dispatch, showToast]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      try {
        const result = await dispatch(updateQuantityAsync({ productId, quantity })).unwrap();
        return { success: true, cart: result };
      } catch (err) {
        showToast(err || 'Failed to update quantity', 'error');
        return { success: false, message: err };
      }
    },
    [dispatch, showToast]
  );

  const removeItem = useCallback(
    async (productId) => {
      try {
        const result = await dispatch(removeFromCartAsync(productId)).unwrap();
        showToast('Item removed from cart', 'info');
        return { success: true, cart: result };
      } catch (err) {
        showToast(err || 'Failed to remove item', 'error');
        return { success: false, message: err };
      }
    },
    [dispatch, showToast]
  );

  const clearAllCart = useCallback(async () => {
    try {
      await dispatch(clearCartAsync()).unwrap();
      showToast('Cart cleared', 'info');
      return { success: true };
    } catch (err) {
      showToast(err || 'Failed to clear cart', 'error');
      return { success: false, message: err };
    }
  }, [dispatch, showToast]);

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

  const removePromo = useCallback(() => {
    dispatch(removeCoupon());
    showToast('Coupon removed', 'info');
  }, [dispatch, showToast]);

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
    // Redux Dispatch Actions
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
