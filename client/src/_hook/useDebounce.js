import { useState, useEffect } from 'react';

/**
 * Custom hook that delays updating the returned value until
 * after the specified delay has elapsed since the last change.
 * 
 * @param {any} value - The input value to debounce (e.g., search text)
 * @param {number} delay - The debounce delay in milliseconds (default: 300ms)
 * @returns {any} The debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
