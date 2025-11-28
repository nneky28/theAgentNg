// @ts-nocheck
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export const useUserValidation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    validateUser();
  }, []);

  const validateUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role, is_onboarded')
        .eq('id', user.id)
        .single();

      // Admin bypass
      if (userData?.role === 'admin') {
        setLoading(false);
        return;
      }

      // Check onboarding for non-admin
      if (!userData?.is_onboarded) {
        router.push('/auth/onboard');
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('User validation error:', error);
      setLoading(false);
    }
  };

  return { loading };
};