import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { setOnboardingStatus, setUserData } from '@/app/feature/onboardingSlice';
import { supabase } from '../lib/supabaseClient';

// Cache for onboarding status to prevent repeated DB calls
const onboardingCache = new Map<string, { status: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useOnboardingStatus = (userEmail: string | undefined) => {
  const dispatch = useAppDispatch();
  const { isOnboarded, userData } = useAppSelector((state) => state.onboarding);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [supabaseOnboarded, setSupabaseOnboarded] = useState<boolean | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ensure we're on the client side before accessing localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkOnboardingStatus = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    if (!isClient || !userEmail) {
      dispatch(setOnboardingStatus(false));
      setLoading(false);
      return;
    }

    try {
      // Check cache first
      const cached = onboardingCache.get(userEmail);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setSupabaseOnboarded(cached.status);
        dispatch(setOnboardingStatus(cached.status));
        setLoading(false);
        return;
      }

      // Check localStorage
      const storedData = localStorage.getItem('userData');
      const isOnboardingComplete = localStorage.getItem('isOnboardingComplete') === 'true';

      if (storedData) {
        const userData = JSON.parse(storedData);
        if (userData.email === userEmail && isOnboardingComplete) {
          dispatch(setUserData(userData));
          dispatch(setOnboardingStatus(true));
          setSupabaseOnboarded(true);
          // Cache the result
          onboardingCache.set(userEmail, { status: true, timestamp: Date.now() });
          setLoading(false);
          return;
        }
      }

      // Check Supabase DB with abort signal
      const { data, error } = await supabase
        .from('users')
        .select('onboarding_completed, username, whatsapp_no, specialization, state, city')
        .eq('email', userEmail)
        .abortSignal(abortControllerRef.current.signal)
        .single();

      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      if (!error && data) {
        const isComplete = data.onboarding_completed || false;
        setSupabaseOnboarded(isComplete);
        dispatch(setOnboardingStatus(isComplete));
        
        // Cache the result
        onboardingCache.set(userEmail, { status: isComplete, timestamp: Date.now() });
        
        // Update localStorage with fresh data
        if (isComplete) {
          const userData = {
            email: userEmail,
            username: data.username,
            whatsappNo: data.whatsapp_no,
            specialization: data.specialization,
            state: data.state,
            city: data.city,
          };
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('isOnboardingComplete', 'true');
          dispatch(setUserData(userData));
        }
      } else {
        setSupabaseOnboarded(false);
        dispatch(setOnboardingStatus(false));
        // Cache negative result too
        onboardingCache.set(userEmail, { status: false, timestamp: Date.now() });
      }
      setLoading(false);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return; // Request was cancelled, don't update state
      }
      console.error('Error checking onboarding status:', error);
      dispatch(setOnboardingStatus(false));
      setLoading(false);
    }
  }, [userEmail, dispatch, isClient]);

  useEffect(() => {
    checkOnboardingStatus();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [checkOnboardingStatus]);

  return {
    isOnboarded: supabaseOnboarded !== null ? supabaseOnboarded : isOnboarded,
    loading,
    userData,
  };
};