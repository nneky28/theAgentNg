'use client'
import { Box, Container, Heading, Text, Button, VStack, HStack, useToast } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { colors } from '../utils/color';

const AgentCTA = () => {
  const toast = useToast();

  const handleGoogleLogin = () => {
    toast({
      title: "Google Sign-in",
      description: "This would redirect to Google authentication in a production app",
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
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
      
      
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default AgentCTA;