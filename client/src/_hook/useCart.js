import { useCartRedux } from '../redux/useCartRedux';

/**
 * useCart hook backed by React Redux Toolkit
 */
export const useCart = () => {
  return useCartRedux();
};

export default useCart;
