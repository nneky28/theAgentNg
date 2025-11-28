"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SearchForm from "@/components/SearchForm";
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
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { TbHomeSearch } from "react-icons/tb";


interface Filters {
  priceRange: [number, number];
  type: string;
  beds: string;
  state: string;
  city: string;
  searchTerm: string;
  location: string;
}
const ShortLetPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 500000000],
    type: "",
    beds: "",
    state: "",
    city: "",
    searchTerm: "",
    location: "",
  });
  const [sortOption, setSortOption] = useState<string>("");

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
  const propertyTypes = useMemo(
    () => Array.from(new Set(properties.map((p) => p.type))),
    [properties]
  );

  const parsePrice = (price: string | number) => {
    if (typeof price === 'number') return price;
    const numericPrice = price.replace(/[₦,NGN\s]/g, '');
    return parseFloat(numericPrice) || 0;
  };
    
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
        <Heading as="h3" size="md" mb={4}>
          No Short Let Apartment Found
        </Heading>
        <Text color="gray.600">
          When available, we will be adding more short let apartments to our
          platform.
        </Text>
      </Box>

      <SearchForm />
      <Footer />
    </Box>
  );
};

export default ShortLetPage;
