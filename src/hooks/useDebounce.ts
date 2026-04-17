import { useEffect, useState } from 'react';

/**
 * Hook para diferir un valor y reducir consultas reactivas excesivas.
 */
export const useDebounce = <T,>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay, value]);

  return debouncedValue;
};
