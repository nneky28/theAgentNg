// app/auth/error/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center
} from '@chakra-ui/react';
import Link from 'next/link';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Server Configuration Error',
          description: 'There is a problem with the server configuration. Please contact support.'
        };
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          description: 'You do not have permission to sign in with this account.'
        };
      case 'Verification':
        return {
          title: 'Verification Failed',
          description: 'The verification token has expired or has already been used.'
        };
      case 'OAuthSignin':
        return {
          title: 'OAuth Sign-in Error',
          description: 'There was an error with the OAuth provider during sign-in.'
        };
      case 'OAuthCallback':
        return {
          title: 'OAuth Callback Error',
          description: 'There was an error processing the OAuth callback.'
        };
      case 'OAuthCreateAccount':
        return {
          title: 'Account Creation Error',
          description: 'Could not create an account with the OAuth provider.'
        };
      case 'EmailCreateAccount':
        return {
          title: 'Email Account Error',
          description: 'Could not create an account with the provided email.'
        };
      case 'Callback':
        return {
          title: 'Callback Error',
          description: 'There was an error in the OAuth callback handler.'
        };
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Not Linked',
          description: 'This account is already associated with another sign-in method.'
        };
      case 'EmailSignin':
        return {
          title: 'Email Sign-in Error',
          description: 'There was an error sending the verification email.'
        };
      case 'CredentialsSignin':
        return {
          title: 'Invalid Credentials',
          description: 'The credentials you provided are incorrect.'
        };
      case 'SessionRequired':
        return {
          title: 'Session Required',
          description: 'You must be signed in to access this page.'
        };
      default:
        return {
          title: 'Authentication Error',
          description: 'An unexpected error occurred during authentication.'
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={4} color="red.500">
            Authentication Failed
          </Heading>
        </Box>

        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>{errorInfo.title}</AlertTitle>
            <AlertDescription>{errorInfo.description}</AlertDescription>
          </Box>
        </Alert>

        {error && (
          <Box bg="gray.50" p={4} borderRadius="md">
            <Text fontSize="sm" color="gray.600" fontFamily="mono">
              Error Code: {error}
            </Text>
          </Box>
        )}

        <VStack spacing={4}>
          <Button
            as={Link}
            href="/auth/signin"
            colorScheme="blue"
            size="lg"
            width="full"
          >
            Try Sign In Again
          </Button>
          
          <Button
            as={Link}
            href="/"
            variant="ghost"
            size="lg"
          >
            Return to Home
          </Button>
        </VStack>

        <Box textAlign="center" pt={4}>
          <Text fontSize="sm" color="gray.500">
            If this problem persists, please contact support.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <Center minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Loading error details...</Text>
        </VStack>
      </Center>
    }>
      <ErrorContent />
    </Suspense>
  );
}