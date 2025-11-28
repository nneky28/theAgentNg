'use client'

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import SearchForm from '@/components/SearchForm';
import { SearchIcon } from '@chakra-ui/icons';
import { Box, Container, Heading, HStack, Icon, InputGroup, VStack, Text, InputLeftElement, Input } from '@chakra-ui/react';
import React from 'react'
import { TbHomeSearch } from 'react-icons/tb';

function EventCenterPage() {
  return (
    <Box>
      <Navbar />
      <Box
        position="relative"
        overflow="hidden"
        backgroundImage="url('/images/hall1.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        bgColor='#00425F'
        h='60vh'
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'black',
          opacity: 0.7,
          zIndex: 0,
        }}
      >
        <Container 
         maxW="container.xl"
          py={16}
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          h="full"
          position="relative"
          zIndex={1}
        >
          <VStack spacing={6} textAlign="center" color="white">
            <HStack>
              <Icon as={TbHomeSearch} boxSize={10} />
              <Heading as="h1" size={['xl', "2xl"]}>
                Event Centers
              </Heading>
            </HStack>
            <Text fontSize="xl">Find the dream location for your event.</Text>

            <Box w="100%" maxW="800px">
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  bg="white"
                  color="gray.800"
                  placeholder="Search by location (e.g. Lekki, Ikoyi, Abuja)..."
                  borderRadius="lg"
                />
              </InputGroup>
            </Box>
          </VStack>
        </Container>
      </Box>


        <Box bg="white" p={10} borderRadius="lg" shadow="md" textAlign="center" py={12}>
              <Heading as="h3" size="md" mb={4}>
                No Event Center Found
              </Heading>
              <Text color="gray.600">
                When available, we will be adding more event centers to our platform.
              </Text>
            </Box>

      <SearchForm />
      <Footer />
    </Box>
  )
}

export default EventCenterPage;