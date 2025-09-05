import { useEffect, useRef } from 'react';

/**
 * React hook that executes a callback function at a specified interval.
 *
 * @param callback - Callback function to be executed
 * @param delta - Interval in milliseconds
 */
export default function useInterval(callback: () => void, delta: number): void {
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
}
