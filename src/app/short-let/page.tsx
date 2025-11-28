"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SearchForm from "@/components/SearchForm";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Heading,
  HStack,
  Icon,
  InputGroup,
  InputLeftElement,
  VStack,
  Text,
  Input,
  Flex,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TbHomeSearch } from "react-icons/tb";



const ShortLetPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const supabase = createClient();
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("category", "Short Let Apartment")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        throw error;
      }

      console.log("✅ Rent properties loaded:", data?.length);
      setProperties(data || []);
    } catch (error) {
      console.error("❌ Error in fetchProperties:", error);
    } finally {
      setLoading(false);
    }
  };


  // Filter properties by search term
  const filteredProperties = properties.filter((property) => {
    if (typeof property.location === "string") {
      return property.location.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (
      property.location &&
      typeof property.location === "object"
    ) {
      const { city, state, country } = property.location;
      const locationString = [city, state, country].filter(Boolean).join(" ").toLowerCase();
      return locationString.includes(searchTerm.toLowerCase());
    }
    return false;
  });

  if (loading) {
    return (
      <Box bg="gray.50" minH="100vh">
        <Navbar />
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" color="purple.500" thickness="4px" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />
      <Box
        position="relative"
        overflow="hidden"
        backgroundImage="url('/images/Short2.jpeg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        bgColor="#00425F"
        h="60vh"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: "black",
          opacity: 0.5,
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
              <Heading as="h1" size={["xl", "2xl"]}>
                Short Let Apartments
              </Heading>
            </HStack>
            <Text fontSize="xl">Take a break, relax and rejuvenate.</Text>

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Box>
          </VStack>
        </Container>
      </Box>
      
      <Box
        bg="white"
        p={10}
        borderRadius="lg"
        shadow="md"
        textAlign="center"
        py={12}
      >
        {filteredProperties.length === 0 ? (
          <>
            <Heading as="h3" size="md" mb={4}>
              No Short Let Apartment Found
            </Heading>
            <Text color="gray.600">
              When available, we will be adding more short let apartments to our
              platform.
            </Text>
          </>
        ) : (
          <Container maxW="container.xl" py={8}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </SimpleGrid>
          </Container>
        )}
      </Box>

      <SearchForm />
      <Footer />
    </Box>
  );
};

export default ShortLetPage;
