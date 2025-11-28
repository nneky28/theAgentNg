'use client'

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  HStack,
} from '@chakra-ui/react';

interface DashboardHeaderProps {
  userName?: string;
  userImage?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,

}) => {


  return (
    <Box >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={6}>
          <HStack align="start" spacing={3}>
         
            <Box>
              <Heading size="lg">Welcome, {userName || 'Agent'}!</Heading>
              <Text opacity={0.9}>Here&apos;s what&apos;s happening in your profile</Text>
            </Box>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};