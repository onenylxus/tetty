// Import
import { useEffect, useRef } from 'react';

// Use interval hook
const useInterval = (callback: () => void, delta: number): void => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delta < 0) {
      return;
    }

    const intervalId = setInterval(() => callbackRef.current(), delta);
    return () => clearInterval(intervalId);
  }, [delta]);
};

// Export
export default useInterval;
