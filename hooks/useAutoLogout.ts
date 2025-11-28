import { useEffect, useRef, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useToast } from '@chakra-ui/react';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const WARNING_TIMEOUT = 4 * 60 * 1000; // 4 minutes - show warning 1 min before logout

export const useAutoLogout = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useToast();
  const toastIdRef = useRef<string | number | undefined>(undefined);

  const handleLogout = useCallback(async () => {
    // Clear any existing toasts
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
    
    toast({
      title: 'Session Expired',
      description: 'You have been logged out due to inactivity.',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });

    await signOut({ callbackUrl: '/' });
  }, [toast]);

  const showWarning = useCallback(() => {
    toastIdRef.current = toast({
      title: 'Inactivity Warning',
      description: 'You will be logged out in 1 minute due to inactivity.',
      status: 'warning',
      duration: 60000, // Show for 1 minute
      isClosable: true,
    });
  }, [toast]);

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    
    // Clear warning toast if exists
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
      toastIdRef.current = undefined;
    }

    // Set warning timer (4 minutes)
    warningTimeoutRef.current = setTimeout(() => {
      showWarning();
    }, WARNING_TIMEOUT);

    // Set logout timer (5 minutes)
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  }, [handleLogout, showWarning, toast]);

  useEffect(() => {
    // Events that indicate user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Attach event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Start the timer
    resetTimer();

    // Cleanup function
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
    };
  }, [resetTimer, toast]);

  return { resetTimer };
};