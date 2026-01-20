"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Badge,
  Flex,
  useDisclosure,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Grid,
  Select,
  HStack,
  Button,
  VStack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Collapse,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Property } from "../types";
import { colors } from "@/utils/color";
import PropertyDetailsModal from "./PropertyDetailsModal";
import { createClient } from "@/utils/supabase/client";
import { formatPrice } from "@/utils/Method";

const FeaturedListings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Carousel state
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [pauseAutoPlay, setPauseAutoPlay] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("all");
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Responsive items per page
  const itemsPerPage = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 4 }) || 4;

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    const supabase = createClient();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .eq("is_archived", false)
        .order("featured_at", { ascending: false });

      if (error) {
        console.error("Error fetching featured properties:", error);
        throw error;
      }
      setFeaturedProperties(data || []);
    } catch (error) {
      console.error("❌ Error in fetchFeaturedProperties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [priceRange, selectedState, selectedPropertyType, selectedBedrooms, sortBy]);

  const getFirstImage = (property: Property) => {
    if (Array.isArray(property.images) && property.images.length > 0) {
      return property.images[0];
    }
    if (property.image) {
      return property.image;
    }
    if (property.imageUrl) {
      return property.imageUrl;
    }
    return "";
  };

  // Filter and sort logic
  const filterAndSortProperties = (properties: Property[]) => {
    let filtered = [...properties];

    // Price filter
    filtered = filtered.filter(
      (p) => (p.price as number) >= priceRange[0] && (p.price as number) <= priceRange[1]
    );

    // State filter
    if (selectedState !== "all") {
      filtered = filtered.filter((p) => p.state === selectedState);
    }

    // Property type filter
    if (selectedPropertyType !== "all") {
      filtered = filtered.filter((p) => p.type === selectedPropertyType);
    }

    // Bedrooms filter
    if (selectedBedrooms !== "all") {
      const bedroomCount = parseInt(selectedBedrooms);
      filtered = filtered.filter((p) => p.bedrooms === bedroomCount);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price as number) - (b.price as number));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price as number) - (a.price as number));
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.featured_at || b.created_at || 0).getTime() -
            new Date(a.featured_at || a.created_at || 0).getTime()
        );
        break;
      default:
        break;
    }

    return filtered;
  };

  const forRentProperties = useMemo(
    () =>
      filterAndSortProperties(
        featuredProperties.filter(
          (property) => property.category === "Properties To Let"
        )
      ),
    [featuredProperties, priceRange, selectedState, selectedPropertyType, selectedBedrooms, sortBy]
  );

  const forSaleProperties = useMemo(
    () =>
      filterAndSortProperties(
        featuredProperties.filter(
          (property) => property.category === "Properties For Sale"
        )
      ),
    [featuredProperties, priceRange, selectedState, selectedPropertyType, selectedBedrooms, sortBy]
  );

  const shortletProperties = useMemo(
    () =>
      filterAndSortProperties(
        featuredProperties.filter(
          (property) => property.category === "Short Let Apartment"
        )
      ),
    [featuredProperties, priceRange, selectedState, selectedPropertyType, selectedBedrooms, sortBy]
  );

  // Get unique values for filters
  const uniqueStates = useMemo(
    () => Array.from(new Set(featuredProperties.map((p) => p.state))).sort(),
    [featuredProperties]
  );

  const uniquePropertyTypes = useMemo(
    () => Array.from(new Set(featuredProperties.map((p) => p.type))).sort(),
    [featuredProperties]
  );

  const maxPrice = useMemo(
    () =>
      featuredProperties.length > 0
        ? Math.max(...featuredProperties.map((p) => p.price as number))
        : 100000000,
    [featuredProperties]
  );

  // Auto-play carousel
  useEffect(() => {
    if (pauseAutoPlay) return;

    const interval = setInterval(() => {
      setDirection("right");
      setCurrentPage((prev) => {
        // Calculate total pages based on active tab
        let currentTabLength = 0;
        if (activeTab === 0) currentTabLength = forRentProperties.length;
        else if (activeTab === 1) currentTabLength = forSaleProperties.length;
        else if (activeTab === 2) currentTabLength = shortletProperties.length;
        
        const totalPages = Math.ceil(currentTabLength / itemsPerPage);
        if (totalPages <= 1) return 0; // Don't advance if only one page
        return (prev + 1) % totalPages;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [pauseAutoPlay, activeTab, forRentProperties.length, forSaleProperties.length, shortletProperties.length, itemsPerPage]);

  // Carousel navigation functions
  const renderCarousel = (properties: Property[]) => {
    const totalPages = Math.ceil(properties.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const visibleProperties = properties.slice(startIndex, startIndex + itemsPerPage);

    const goToNext = () => {
      setDirection("right");
      setPauseAutoPlay(true);
      setCurrentPage((prev) => (prev + 1) % totalPages);
      setTimeout(() => setPauseAutoPlay(false), 10000); // Resume after 10 seconds
    };

    const goToPrev = () => {
      setDirection("left");
      setPauseAutoPlay(true);
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
      setTimeout(() => setPauseAutoPlay(false), 10000); // Resume after 10 seconds
    };

    if (properties.length === 0) {
      return (
        <Box py={8} textAlign="center">
          <Text color="gray.500" fontSize="lg">
            No properties match your filters
          </Text>
        </Box>
      );
    }

    return (
      <Box 
        position="relative"
        onMouseEnter={() => setPauseAutoPlay(true)}
        onMouseLeave={() => setPauseAutoPlay(false)}
      >
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          }}
          gap={6}
          mb={6}
          
          sx={{
            "& > *": {
              animation: `slideIn${direction === "right" ? "Right" : "Left"} 0.5s ease-out`,
            },
            "@keyframes slideInRight": {
              from: {
                opacity: 0,
                transform: "translateX(50px)",
              },
              to: {
                opacity: 1,
                transform: "translateX(0)",
              },
            },
            "@keyframes slideInLeft": {
              from: {
                opacity: 0,
                transform: "translateX(-50px)",
              },
              to: {
                opacity: 1,
                transform: "translateX(0)",
              },
            },
          }}
        >
          {visibleProperties.map((property, index) => (
            <Box
              key={property.id}
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              boxShadow="md"
              transition="all 0.3s"
              mt={6}
              _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
              cursor="pointer"
              onClick={() => {
                setSelectedProperty(property);
                onOpen();
              }}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <Box height="220px" overflow="hidden" position="relative">
                <Image
                  src={getFirstImage(property)}
                  alt={property.title}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  transition="transform 0.3s"
                  _hover={{ transform: "scale(1.05)" }}
                  fallbackSrc="https://via.placeholder.com/300x220?text=No+Image"
                />
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  colorScheme="yellow"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  ⭐
                </Badge>
              </Box>

              <Box p={5}>
                <Heading as="h3" size="md" mb={2} noOfLines={1}>
                  {property.title}
                </Heading>
                <Text color="gray.600" mb={3} noOfLines={1}>
                  {`${property?.city}, ${property?.state}`}
                </Text>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold" fontSize="lg" color={colors.primary}>
                    {formatPrice(
                      property.price,
                      (property.currency as "NGN" | "USD") || "NGN"
                    )}
                  </Text>
                  <Badge
                    colorScheme={
                      property.category === "Properties To Let"
                        ? "green"
                        : property.category === "Short Let Apartment"
                        ? "purple"
                        : "orange"
                    }
                  >
                    {property.category === "Properties To Let"
                      ? "To Let"
                      : property.category === "Short Let Apartment"
                      ? "Short Let"
                      : "For Sale"}
                  </Badge>
                </Flex>
              </Box>
            </Box>
          ))}
        </Grid>

        {/* Navigation Controls */}
        {totalPages > 1 && (
          <Flex justifyContent="center" alignItems="center" gap={4}>
            <IconButton
              aria-label="Previous page"
              icon={<ChevronLeftIcon />}
              onClick={goToPrev}
              isDisabled={properties.length <= itemsPerPage}
              colorScheme="purple"
              variant="outline"
              size="lg"
            />

            {/* Pagination dots */}
            <HStack spacing={2}>
              {Array.from({ length: totalPages }).map((_, index) => (
                <Box
                  key={index}
                  width={index === currentPage ? "24px" : "8px"}
                  height="8px"
                  borderRadius="full"
                  bg={index === currentPage ? colors.primary : "gray.300"}
                  cursor="pointer"
                  onClick={() => {
                    setDirection(index > currentPage ? "right" : "left");
                    setPauseAutoPlay(true);
                    setCurrentPage(index);
                    setTimeout(() => setPauseAutoPlay(false), 10000); // Resume after 10 seconds
                  }}
                  transition="all 0.3s"
                  _hover={{ bg: index === currentPage ? colors.primary : "gray.400" }}
                />
              ))}
            </HStack>

            <IconButton
              aria-label="Next page"
              icon={<ChevronRightIcon />}
              onClick={goToNext}
              isDisabled={properties.length <= itemsPerPage}
              colorScheme="purple"
              variant="outline"
              size="lg"
            />
          </Flex>
        )}

        {/* Results count */}
        <Text textAlign="center" mt={6} color="gray.600" fontSize="sm">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, properties.length)} of{" "}
          {properties.length} properties
        </Text>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box py={12} id="featured">
        <Container maxW="container.xl">
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="xl" color="purple.500" thickness="4px" />
          </Flex>
        </Container>
      </Box>
    );
  }

  if (featuredProperties.length === 0) {
    return null;
  }

  return (
    <Box py={12} id="featured" bg="gray.50">
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          {/* Header with Filter Toggle */}
          <Flex
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={4}
          >
            <Heading as="h2" size="xl">
              Featured Listings
            </Heading>
            <HStack spacing={3}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                maxW="200px"
                bg="white"
                size="sm"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </Select>
              <Button
                size="sm"
                colorScheme="purple"
                px={8}
                variant={showFilters ? "solid" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </HStack>
          </Flex>

          {/* Filter Panel */}
          <Collapse in={showFilters} animateOpacity>
            <Box
              p={6}
              bg="white"
              borderRadius="lg"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
                gap={4}
              >
                {/* State Filter */}
                <Box>
                  <Text fontWeight="medium" mb={2} fontSize="sm">
                    Location
                  </Text>
                  <Select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    size="sm"
                  >
                    <option value="all">All States</option>
                    {uniqueStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Select>
                </Box>

                {/* Property Type Filter */}
                <Box>
                  <Text fontWeight="medium" mb={2} fontSize="sm">
                    Property Type
                  </Text>
                  <Select
                    value={selectedPropertyType}
                    onChange={(e) => setSelectedPropertyType(e.target.value)}
                    size="sm"
                  >
                    <option value="all">All Types</option>
                    {uniquePropertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </Box>

                {/* Bedrooms Filter */}
                <Box>
                  <Text fontWeight="medium" mb={2} fontSize="sm">
                    Bedrooms
                  </Text>
                  <Select
                    value={selectedBedrooms}
                    onChange={(e) => setSelectedBedrooms(e.target.value)}
                    size="sm"
                  >
                    <option value="all">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </Select>
                </Box>

                {/* Price Range Filter */}
                <Box>
                  <Text fontWeight="medium" mb={2} fontSize="sm">
                    Price Range
                  </Text>
                  <Text fontSize="xs" color="gray.600" mb={2}>
                    ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                  </Text>
                  <RangeSlider
                    value={priceRange}
                    onChange={(val) => setPriceRange(val as [number, number])}
                    min={0}
                    max={maxPrice}
                    step={1000000}
                  >
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack bg={colors.primary} />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                </Box>
              </Grid>

              {/* Reset Filters Button */}
              <Flex justifyContent="flex-end" mt={4}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setPriceRange([0, maxPrice]);
                    setSelectedState("all");
                    setSelectedPropertyType("all");
                    setSelectedBedrooms("all");
                    setSortBy("newest");
                  }}
                >
                  Reset Filters
                </Button>
              </Flex>
            </Box>
          </Collapse>

          {/* Tabs for Rent vs Sale */}
          <Tabs
            colorScheme="purple"
            onChange={(index) => {
              setActiveTab(index);
              setCurrentPage(0);
            }}
            variant="soft-rounded"
          >
            <TabList>
              <Tab>
                To Let{" "}
                <Badge ml={2} colorScheme="green">
                  {forRentProperties.length}
                </Badge>
              </Tab>
              <Tab>
                For Sale{" "}
                <Badge ml={2} colorScheme="orange">
                  {forSaleProperties.length}
                </Badge>
              </Tab>
              <Tab>
                Shortlet{" "}
                <Badge ml={2} colorScheme="purple">
                  {shortletProperties.length}
                </Badge>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>{renderCarousel(forRentProperties)}</TabPanel>
              <TabPanel px={0}>{renderCarousel(forSaleProperties)}</TabPanel>
              <TabPanel px={0}>{renderCarousel(shortletProperties)}</TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      {selectedProperty && (
        <PropertyDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          property={selectedProperty}
        />
      )}
    </Box>
  );
};

export default FeaturedListings;
