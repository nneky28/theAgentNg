// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Heading,
  Text,
  Box,
  Flex,
  Image,
  SimpleGrid,
  HStack,
  Button,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaCheck, FaPlay } from "react-icons/fa";
import { Property } from "../types";
import { Icon } from "@chakra-ui/react";

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null; // Allow null
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  isOpen,
  onClose,
  property,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property]);

  if (!property) return null;

  // Format description text


  // Generate images - handle both property types
  const propertyImages =
    property.images ||
    (property.imageUrl
      ? [property.imageUrl]
      : property.image
        ? [property.image]
        : []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === propertyImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? propertyImages.length - 1 : prevIndex - 1,
    );
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
  const handleClick = () => {
    const propertyUrl = `${window.location.origin}/property/${property.id}`;
    // Format phone number: remove non-digits, replace leading 0 with 234
    const phoneNumber = property?.owner_phone?.replace(/\D/g, '').replace(/^0/, '234') || '';
    const message = `Hi, I'm interested in this property: ${property.title}%0A%0AProperty Link: ${propertyUrl}`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton py={2} />
        </ModalHeader>
        <ModalBody pb={6}>
          {/* Image Slideshow */}
          {propertyImages.length > 0 && (
            <Box
              position="relative"
              borderRadius="md"
              overflow="hidden"
              h="300px"
              mb={6}
            >
              <Image
                src={propertyImages[currentImageIndex]}
                alt={property.title}
                w="100%"
                h="100%"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/600x300?text=No+Image"
              />

              {/* Navigation Arrows */}
              {propertyImages.length > 1 && (
                <Flex
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  justify="space-between"
                  align="center"
                  px={4}
                >
                  <IconButton
                    aria-label="Previous image"
                    icon={<ChevronLeftIcon boxSize={8} />}
                    variant="ghost"
                    colorScheme="purple"
                    bg="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.900" }}
                    onClick={prevImage}
                  />
                  <IconButton
                    aria-label="Next image"
                    icon={<ChevronRightIcon boxSize={8} />}
                    variant="ghost"
                    colorScheme="purple"
                    bg="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.900" }}
                    onClick={nextImage}
                  />
                </Flex>
              )}

              {/* Image Counter */}
              {propertyImages.length > 1 && (
                <Text
                  position="absolute"
                  bottom="2"
                  right="2"
                  bg="blackAlpha.700"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="sm"
                >
                  {currentImageIndex + 1} / {propertyImages.length}
                </Text>
              )}
            </Box>
          )}

          {/* Thumbnail Navigation */}
          {propertyImages.length > 1 && (
            <Flex my={3} overflowX="auto" pb={2} gap={2}>
              {propertyImages.map((img: string, index: number) => (
                <Box
                  key={index}
                  minW="60px"
                  width="60px"
                  height="40px"
                  borderRadius="md"
                  overflow="hidden"
                  opacity={index === currentImageIndex ? 1 : 0.6}
                  border={index === currentImageIndex ? "2px solid" : "none"}
                  borderColor="purple.500"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ opacity: 1 }}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                </Box>
              ))}
            </Flex>
          )}
          <Box>
            <Heading size="lg">{property.title}</Heading>
            <Text color="gray.600" fontSize="sm">
              {property?.city && property?.state
                ? `${property.city}, ${property.state}`
                : property?.city || property?.state || "Location not set"}
            </Text>
          </Box>

          <Flex
            justify="space-between"
            mb={6}
            direction={["column", "row"]}
            gap={4}
          >
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color="#724B9B">
                {formatPrice(property.price, property.currency || "NGN")}
              </Text>
            </Box>

            <Flex gap={4}>
              <Box textAlign="center">
                <Text fontWeight="bold">
                  {property.beds || property.bedrooms || 0}
                </Text>
                <Text color="gray.600" fontSize="sm">
                  Bedrooms
                </Text>
              </Box>
              <Box textAlign="center">
                <Text fontWeight="bold">
                  {property.baths || property.bathrooms || 0}
                </Text>
                <Text color="gray.600" fontSize="sm">
                  Bathrooms
                </Text>
              </Box>
              <Box textAlign="center">
                <Text fontWeight="bold">{property.toilets || 0}</Text>
                <Text color="gray.600" fontSize="sm">
                  Toilets
                </Text>
              </Box>
              <Box textAlign="center">
                <Text fontWeight="bold">{property.sqft || 0}</Text>
                <Text color="gray.600" fontSize="sm">
                  Sqm
                </Text>
              </Box>
            </Flex>
          </Flex>

          <Box mb={6}>
            <Heading size="md" mb={3}>
              Description
            </Heading>
            <Box color="gray.700" lineHeight="tall">
              {property.description}
            </Box>
          </Box>

          {property.features &&
            Array.isArray(property.features) &&
            property.features.length > 0 && (
              <Box mb={6}>
                <Heading size="md" mb={3}>
                  Features
                </Heading>
                <SimpleGrid columns={2} spacing={3}>
                  {property.features.map((feature, i) => (
                    <HStack key={i}>
                      <Box as={FaCheck} color="green.500" />
                      <Text fontSize="sm">{feature}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Box>
            )}

          {property.video_link && (
            <Box mb={6}>
              <Button
                as="a"
                href={property.video_link}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<Icon as={FaPlay} />}
                colorScheme="purple"
                w="full"
              >
                Watch Property Video
              </Button>
            </Box>
          )}

          {property.amenities &&
            Array.isArray(property.amenities) &&
            property.amenities.length > 0 && (
              <Box mb={6}>
                <Heading size="md" mb={3}>
                  Amenities
                </Heading>
                <SimpleGrid columns={2} spacing={3}>
                  {property.amenities.map((amenity, i) => (
                    <HStack key={i}>
                      <Box as={FaCheck} color="green.500" />
                      <Text fontSize="sm">{amenity}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Box>
            )}

          <Box bg="gray.50" p={4} borderRadius="md">
            <Heading size="md" mb={3}>
              Contact Agent
            </Heading>
            <Text mb={3} fontSize="sm" color="gray.600">
              Interested in this property? Get in touch with the agent.
            </Text>
            <Button
              colorScheme="green"
              size="lg"
              width="full"
              onClick={handleClick}
            >
              Chat on WhatsApp
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PropertyDetailsModal;
