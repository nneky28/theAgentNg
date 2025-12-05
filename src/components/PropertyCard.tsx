// @ts-nocheck
"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import { FaBath, FaBed, FaMapMarkerAlt } from "react-icons/fa";
import PropertyDetailsModal from "./PropertyDetailsModal";
import { Property } from "../types";
import { colors } from "@/utils/color";

const PropertyCard = ({ property }: { property: Property }) => {
  const [, setIsHovered] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const formatPrice = (price: string | number) => {
    if (!price) return "N/A";

    const numericPrice =
      typeof price === "string"
        ? price.replace(/[₦,NGN\s]/g, "")
        : price.toString();

    const priceNum = parseFloat(numericPrice);

    if (isNaN(priceNum)) return price;

    return `₦${priceNum.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <>
      <Box
        bg="white"
        borderRadius="lg"
        overflow="hidden"
        shadow="md"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
        position="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onOpen}
        cursor="pointer"
      >
      
        <Box position="relative" h="240px">
          <Image
            src={getFirstImage(property)}
            alt={property.title}
            w="100%"
            h="100%"
            objectFit="cover"
            fallbackSrc=""
          />
        { property.is_featured && 
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme="yellow"
            fontSize="xs"
            fontWeight="bold"
          >
            ⭐
          </Badge>}
        </Box>

        <Box p={5}>
      
          <Heading as="h3" size="md" mb={2} noOfLines={1} textAlign={"left"}>
            {property.title}
          </Heading>
          <HStack color="gray.600" mb={1}>
            <Icon as={FaMapMarkerAlt} />
            <Text fontSize="sm" noOfLines={1}>
              {property?.city && property?.state
                ? `${property.city}, ${property.state}`
                : property?.city || property?.state || ""}
            </Text>
          </HStack>
         <Text color="#724B9B" fontWeight="bold" fontSize="xl" textAlign={'left'}>
              {formatPrice(property.price)}
            </Text>
          <Flex
            justify="space-between"
            borderTop="1px"
            borderColor="gray.100"
            pt={3}
            mt={1}
          >
            <HStack>
              <Icon as={FaBed} color="gray.600" />
              <Text fontSize="sm">
                {property.beds || property.bedrooms || 0}{" "}
                {(property.beds || property.bedrooms || 0) > 1 ? "Beds" : "Bed"}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaBath} color="gray.600" />
              <Text fontSize="sm">
                {property.baths || property.bathrooms || 0}{" "}
                {(property.baths || property.bathrooms || 0) > 1
                  ? "Baths"
                  : "Bath"}
              </Text>
            </HStack>
          </Flex>
          <Button
            bg={colors.primary}
            colorScheme="purple"
            mt={4}
            w="full"
            onClick={onOpen}
          >
            View Details
          </Button>
        </Box>
      </Box>

      <PropertyDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        property={property}
      />
    </>
  );
};

export default PropertyCard;
