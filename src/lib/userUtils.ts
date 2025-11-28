import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'agent' | 'buyer' | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at?: string;
}

export const checkUserExists = async (email: string): Promise<{
  exists: boolean;
  profile: UserProfile | null;
  error: unknown;
}> => {
  try {
    console.log('Querying Supabase for user:', email);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    console.log('Supabase response - Data:', data, 'Error:', error);

    if (error) {
      console.error('Supabase error:', error);
      return { exists: false, profile: null, error };
    }

    if (!data) {
      console.log('No user found for email:', email);
      return { exists: false, profile: null, error: null };
    }

    console.log('User found:', data);
    return { exists: true, profile: data, error: null };
  } catch (error) {
    console.error('Error checking user existence:', error);
    return { exists: false, profile: null, error };
  }
};

export const createUserProfile = async (userData: {
  email: string;
  name: string;
  role?: 'agent' | 'buyer';
}): Promise<{ data: UserProfile | null; error: unknown }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        name: userData.name,
        role: userData.role || null,
        onboarding_completed: false,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { data: null, error };
  }
};

export const updateUserOnboarding = async (
  email: string,
  updates: { role: 'agent' | 'buyer'; onboarding_completed: boolean }
): Promise<{ data: UserProfile | null; error: unknown }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating user onboarding:', error);
    return { data: null, error };
  }
};

// This hook is ONLY for dashboard - validates user is fully onboarded
export const useUserValidation = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      if (status === 'loading') return;

      // If not authenticated on dashboard, redirect to home
      if (status === 'unauthenticated') {
        router.push('/');
        return;
      }

      // Validate user is fully onboarded
      if (status === 'authenticated' && session?.user?.email) {
        setIsValidating(true);
        
        try {
          const { exists, profile, error } = await checkUserExists(session.user.email);

          if (error) {
            console.error('Error checking user:', error);
            toast({
              title: 'Error',
              description: 'Failed to verify user profile',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            router.push('/');
            return;
          }

          // Redirect to onboarding if not complete
          if (!exists || !profile || !profile.onboarding_completed || !profile.role) {
            console.log('User not fully onboarded, redirecting...');
            router.push('/auth/onboard');
            return;
          }

          console.log('User validated successfully');
          setUserProfile(profile);
          setIsValidating(false);
        } catch (err) {
          console.error('Validation error:', err);
          router.push('/');
        }
      }
    };

    validateUser();
  }, [session, status, router, toast]);

  return {
    userProfile,
    isValidating,
    isAuthenticated: status === 'authenticated',
  };
};