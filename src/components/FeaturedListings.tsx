"use client";
import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { Property } from "../types";
import Marquee from "react-fast-marquee";
import { colors } from "@/utils/color";
import PropertyDetailsModal from "./PropertyDetailsModal";
import { createClient } from "@/utils/supabase/client";
import { formatPrice } from "@/utils/Method";

const FeaturedListings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

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
  console.log("Featured Properties:", featuredProperties);

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

  const forRentProperties = featuredProperties.filter(
    (property) => property.category === "Properties To Let"
  );
  const forSaleProperties = featuredProperties.filter(
    (property) => property.category === "Properties For Sale"
  );



  return (
    <Box py={12} id="featured" bg="gray.50">
      <Container maxW="container.xl">
        <Heading as="h2" size="xl" mb={8} textAlign="center">
          Featured Listings
        </Heading>
   {/* For Rent - Bottom, moves right */}
        {forRentProperties.length > 0 && (
          <Box overflow="hidden" width="100%">
            <Marquee
              speed={40}
              gradient={false}
              pauseOnHover={true}
              direction="right"
              play={true}
              style={{ padding: "10px 0" }}
            >
              {forRentProperties.map((property, index) => (
                <Box
                  key={`for-rent-${property.id}-${index}`}
                  borderRadius="lg"
                  overflow="hidden"
                  bg="white"
                  boxShadow="md"
                  transition="transform 0.3s"
                  _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                  minW="300px"
                  mx="15px"
                  flexShrink={0}
                  cursor="pointer"
                  onClick={() => {
                    setSelectedProperty(property);
                    onOpen();
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
                    <Flex
                      justifyContent={"space-between"}
                      alignContent={"center"}>
                      <Text
                        fontWeight="bold"
                        fontSize="lg"
                        color={colors.primary}
                      >
                        {formatPrice(property.price)}
                      </Text>
                      <Badge
                        bg={
                          property.category === "Properties To Let"
                            ? "green.100"
                            : "orange.100"
                        }
                        justifyContent={"center"}
                        alignItems={"center"}
                        display={"flex"}
                      >
                        {property.category === "Properties To Let"
                          ? "To LET"
                          : "For Sale"}
                      </Badge>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </Marquee>
          </Box>
        )}
        {/* For Sale - Top, moves left */}
        {forSaleProperties.length > 0 && (
          <Box overflow="hidden" width="100%" mb={4}>
            <Marquee
              speed={40}
              gradient={false}
              pauseOnHover={true}
              direction="left"
              play={true}
              style={{ padding: "10px 0" }}
            >
              {forSaleProperties.map((property, index) => (
                <Box
                  key={`for-sale-${property.id}-${index}`}
                  borderRadius="lg"
                  overflow="hidden"
                  bg="white"
                  boxShadow="md"
                  transition="transform 0.3s"
                  _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                  minW="300px"
                  mx="15px"
                  flexShrink={0}
                  cursor="pointer"
                  onClick={() => {
                    setSelectedProperty(property);
                    onOpen();
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
                    <Flex
                      justifyContent={"space-between"}
                      alignContent={"center"}
                    >
                      <Text
                        fontWeight="bold"
                        fontSize="lg"
                        color={colors.primary}
                      >
                        {formatPrice(property.price)}
                      </Text>
                      <Flex justifyContent="space-between" alignItems="center">
                        <Badge
                          colorScheme={
                            property.category === "Properties To Let"
                              ? "green"
                              : "orange"
                          }
                          alignItems={"center"}
                        >
                          {property.category === "Properties To Let"
                            ? "To let"
                            : "For Sale"}
                        </Badge>
                      </Flex>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </Marquee>
          </Box>
        )}

     
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
