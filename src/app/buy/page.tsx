// @ts-nocheck
"use client";
import { useMemo, useState, useEffect } from "react";
import { 
  Box, Container, Flex, Heading, HStack, Icon, Input, InputGroup, InputLeftElement, 
  SimpleGrid, Text, VStack, Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { GiHouseKeys } from "react-icons/gi";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import Pagination from "@/components/Pagination";
import Navbar from "@/components/Navbar";
import SortSelect from "@/components/SortSelect";
import Footer from "@/components/Footer";
import SearchForm from '@/components/SearchForm';
import { Property } from "@/types";
import { createClient } from "@/utils/supabase/client";

interface Filters {
  priceRange: [number, number];
  type: string;
  beds: string;
  state: string;
  city: string;
  searchTerm: string;
  location: string;
}

const BuyPropertyPage = () => {
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
  const [sortOption, setSortOption] = useState<string>("featured");

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
        .eq("category", "Properties For Sale")
        .eq("is_published", true)
        // .eq('is_featured', true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        throw error;
      }

      console.log("✅ Buy properties loaded:", data?.length);
      setProperties(data || []);
    } catch (error) {
      console.error("❌ Error in fetchProperties:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("All Properties:", properties);

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 500000000], 
      type: "",
      beds: "",
      state: "",
      city: "",
      searchTerm: "",
      location: "",
    });
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

  const filteredProperties = useMemo(() => {
    const filtered = properties.filter((property) => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const propertyTitleLower = property.title?.toLowerCase() || '';
      const propertyCityLower = property.city?.toLowerCase() || '';
      const propertyStateLower = property.state?.toLowerCase() || '';
      const propertyTypeLower = property.type?.toLowerCase() || '';
      const filterTypeLower = filters.type.toLowerCase();
      const filterStateLower = filters.state.toLowerCase();
      const filterCityLower = filters.city.toLowerCase();
      const propertyPrice = parsePrice(property.price);

      const matchesSearch = 
        !filters.searchTerm ||
        propertyTitleLower.includes(searchTermLower) ||
        propertyCityLower.includes(searchTermLower) ||
        propertyStateLower.includes(searchTermLower);
      
      const matchesPrice = 
        propertyPrice >= filters.priceRange[0] && 
        propertyPrice <= filters.priceRange[1];
      
      const matchesType = 
        !filters.type || 
        propertyTypeLower === filterTypeLower;
      
      const matchesBeds = 
        !filters.beds || 
        property.beds === parseInt(filters.beds.toString());
      
      const matchesState = 
        !filters.state || 
        propertyStateLower === filterStateLower;
      
      const matchesCity = 
        !filters.city || 
        propertyCityLower === filterCityLower;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesType &&
        matchesBeds &&
        matchesState &&
        matchesCity
      );
    });

    switch(sortOption) {
      case "price-low":
        return [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      case "price-high":
        return [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      case "newest":
        return [...filtered].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "featured":
      default:
        return [...filtered].sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }
  }, [filters, sortOption, properties]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
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
    <Box bg="gray.50">
      <Navbar/>
      <Box
        backgroundImage="url('/images/Sale1.jpg')"
        position="relative"
        overflow="hidden"
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
          opacity: 0.6,
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
          <VStack spacing={6} textAlign="center" color={'white'}>
            <HStack spacing={0}>
              <Icon as={GiHouseKeys} boxSize={10} />
              <Heading as="h1" size={['xl',"2xl"]}>Properties For Sale</Heading>
            </HStack>
            <Text fontSize="xl">Premium properties, verified titles.</Text>

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
                  value={filters.searchTerm}
                  onChange={(e) => 
                    setFilters(prev => ({ ...prev, searchTerm: e.target.value }))
                  }
                />
              </InputGroup>
            </Box>
          </VStack>
        </Container>
      </Box>

      <PropertyFilter
        filters={filters}
        setFilters={setFilters}
        propertyTypes={propertyTypes}
        onReset={resetFilters} 
      />

      <Container maxW="container.xl" py={10}>
        <Box>
          <Flex justify="space-between" mb={6}>
            <Text fontSize="lg" fontWeight="600">
              {filteredProperties.length} Properties Found
            </Text>
            <SortSelect value={sortOption} onChange={handleSortChange} />
          </Flex>

          {filteredProperties.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </SimpleGrid>
          ) : (
            <Box bg="white" p={10} borderRadius="xl" textAlign="center">
              <Heading size="md" mb={3}>
                No Properties Match Your Search
              </Heading>
              <Text color="gray.600">
                Try adjusting your filters or search term
              </Text>
            </Box>
          )}
        </Box>
      </Container>

      {filteredProperties.length > 0 && (
        <Pagination/>
      )}
      <SearchForm/>
      <Footer/>
    </Box>
  );
};

export default BuyPropertyPage;