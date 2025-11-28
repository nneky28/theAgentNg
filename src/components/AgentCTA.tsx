// @ts-nocheck
'use client'
import { Box, Container, Heading, Text, Button, VStack, HStack, useToast } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { colors } from '../utils/color';
import { createClient } from '@/utils/supabase/client'; 
import { usePathname } from "next/navigation";


const AgentCTA = () => {
  const toast = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [hasRedirected, setHasRedirected] = useState(false);
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();


  useEffect(() => {
    // Don't redirect if already redirected or if on admin/dashboard pages
    const currentPath = window.location.pathname;
    if (
      hasRedirected || 
      currentPath.startsWith('/admin') || 
      currentPath.startsWith('/dashboard') ||
      currentPath.startsWith('/auth')
    ) {
      return;
    }

    const redirectUser = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) return;

          const { data: userData, error } = await supabase
            .from('users')
            .select('role, is_onboarded')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
            return;
          }

          console.log('AgentCTA - User data:', userData);

          // Set flag to prevent multiple redirects
          setHasRedirected(true);

          // Admin bypass - go straight to admin panel
          if (userData?.role === 'admin') {
            console.log('Admin detected, redirecting to admin panel');
            router.push('/admin/properties');
            return;
          }

          // Regular user - check onboarding
          if (!userData?.is_onboarded) {
            console.log('User not onboarded, redirecting to onboarding');
            router.push('/auth/onboard');
            return;
          }

          // Onboarded regular user
          console.log('Onboarded user, redirecting to dashboard');
          router.push('/dashboard/agent');
          
        } catch (error) {
          console.error('Redirect error:', error);
        }
      }
    };

    redirectUser();
  }, [status, session, hasRedirected, router, supabase]);




    useEffect(() => {
      const checkUserRole = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        
        if (user) {
          setIsLoggedIn(true);
          const { data } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();
          
          setIsAdmin(data?.role === "admin");
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      };
      
      checkUserRole();
    }, [pathname]);


const handleGoogleLogin = async () => {
  try {
    const supabase = createClient();
    
    // Get the current origin
    const redirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : 'http://localhost:3000/auth/callback';
    
    console.log('Redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      console.error("Supabase OAuth error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      console.log('OAuth initiated:', data);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    toast({
      title: "Authentication Error",
      description: "Failed to sign in with Google. Please try again.",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }
};


    const handleDashboardClick = () => {
      if (isAdmin) {
        router.push('/admin/properties');
      } else {
        router.push('/dashboard/agent');
      }
    };
  

  return (
    <Box py={16} bg={colors.primary} color={"white"} position="relative" id='agent-cta'>
      <Container maxW="container.md" textAlign="center">
        <VStack spacing={6}>
          <Heading as="h2" size="xl" color={colors.primaryLight}>
            Are you a Real Estate Agent?
          </Heading>
          <Text fontSize="lg" color="whiteAlpha.900">
            Join our Network today!
          </Text>
          <Text color="whiteAlpha.800">
            Signup for notifications whenever someone submits a request in your area.
            Get connected to potential clients and grow your business.
          </Text>
          
          <HStack spacing={4} mt={4}>
            {isLoggedIn ? (
              <Button 
                bg="white" 
                color="black"
                _hover={{ bg: "gray.100" }}
                size="lg"
                onClick={handleDashboardClick}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button 
                leftIcon={<FcGoogle />} 
                bg="white" 
                color="black"
                _hover={{ bg: "gray.100" }}
                size="lg"
                onClick={handleGoogleLogin}
              >
                Sign in with Google
              </Button>
            )}
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default AgentCTA;