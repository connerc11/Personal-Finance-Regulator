import { useEffect, useRef, useCallback } from 'react';

interface UseIdleTimerProps {
  timeout: number; // timeout in milliseconds
  onIdle: () => void;
  events?: string[]; // events to track for activity
  element?: Element | Document; // element to attach listeners to
}

const DEFAULT_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
  'wheel'
];

export const useIdleTimer = ({
  timeout,
  onIdle,
  events = DEFAULT_EVENTS,
  element = document
}: UseIdleTimerProps) => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const lastActivity = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    
    lastActivity.current = Date.now();
    
    timeoutId.current = setTimeout(() => {
      onIdle();
    }, timeout);
  }, [onIdle, timeout]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Start the timer initially
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      element.addEventListener(event, handleActivity);
    });

    // Cleanup function
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      
      events.forEach(event => {
        element.removeEventListener(event, handleActivity);
      });
    };
  }, [events, element, handleActivity, resetTimer]);

  const getRemainingTime = useCallback((): number => {
    return Math.max(0, timeout - (Date.now() - lastActivity.current));
  }, [timeout]);

  const getLastActivityTime = useCallback((): number => {
    return lastActivity.current;
  }, []);

  const isIdle = useCallback((): boolean => {
    return getRemainingTime() === 0;
  }, [getRemainingTime]);

  return {
    getRemainingTime,
    getLastActivityTime,
    isIdle,
    resetTimer
  };
};

export default useIdleTimer;
