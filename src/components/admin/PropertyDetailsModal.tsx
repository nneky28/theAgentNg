import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  SimpleGrid,
  Image,
  Box,
  Heading,
  HStack,
  Badge,
  Text,
  Divider,
} from "@chakra-ui/react";
import { Property } from "@/types";
import { formatPrice } from "@/utils/Method";

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export const PropertyDetailsModal = ({
  isOpen,
  onClose,
  property,
}: PropertyDetailsModalProps) => {
  if (!property) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "4xl" }}>
      <ModalOverlay />
      <ModalContent m={{ base: 0, md: 4 }}>
        <ModalHeader>Property Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Images */}
            {property.images && property.images.length > 0 && (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {property.images.slice(0, 4).map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`Property ${idx + 1}`}
                    borderRadius="md"
                    objectFit="cover"
                    h="200px"
                    w="full"
                  />
                ))}
              </SimpleGrid>
            )}

            {/* Basic Info */}
            <Box>
              <Heading size="md" mb={4}>
                {property.title}
              </Heading>
              <HStack spacing={2} mb={4} flexWrap="wrap">
                <Badge
                  bg={
                    property.category === "Properties To Let"
                      ? "green.100"
                      : property.category === "Properties For Sale"
                      ? "orange.100"
                      : "blue.100"
                  }
                >
                  {property.category === "Properties To Let"
                    ? "To Let"
                    : property.category === "Properties For Sale"
                    ? "For Sale"
                    : "Short Let"}
                </Badge>
                <Badge
                  colorScheme={property.is_published ? "green" : "gray"}
                >
                  {property.is_published ? "Published" : "Draft"}
                </Badge>
                {property.is_featured && (
                  <Badge colorScheme="yellow">⭐ Featured</Badge>
                )}
              </HStack>

              <VStack align="stretch" spacing={3}>
                <HStack>
                  <Text fontWeight="bold">Price:</Text>
                  <Text color="purple.600" fontWeight="600">
                    {formatPrice(property.price, (property.currency as 'NGN' | 'USD') || "NGN")}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Location:</Text>
                  <Text>
                    {property.city && property.state
                      ? `${property.city}, ${property.state}`
                      : property.city || property.state || "N/A"}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Type:</Text>
                  <Text>{property.type || "N/A"}</Text>
                </HStack>
                {property.bedrooms && (
                  <HStack>
                    <Text fontWeight="bold">Bedrooms:</Text>
                    <Text>{property.bedrooms}</Text>
                  </HStack>
                )}
                {property.bathrooms && (
                  <HStack>
                    <Text fontWeight="bold">Bathrooms:</Text>
                    <Text>{property.bathrooms}</Text>
                  </HStack>
                )}
              </VStack>
            </Box>

            <Divider />

            {/* Description */}
            {property.description && (
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Description:
                </Text>
                <Text color="gray.700" whiteSpace="pre-wrap">
                  {property.description}
                </Text>
              </Box>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Features:
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                  {property.features.map((feature, idx) => (
                    <Text key={idx} fontSize="sm">
                      • {feature}
                    </Text>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Amenities:
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                  {property.amenities.map((amenity, idx) => (
                    <Text key={idx} fontSize="sm">
                      • {amenity}
                    </Text>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            <Divider />

            {/* Property Meta Information */}
            <Box bg="gray.50" p={4} borderRadius="md">
              <Text fontWeight="bold" mb={3}>
                Property Information
              </Text>
              <VStack align="stretch" spacing={2} fontSize="sm">
                {property.owner_id && (
                  <HStack>
                    <Text fontWeight="medium" color="gray.600" minW="120px">
                      Agent ID:
                    </Text>
                    <Text>{property.owner_id}</Text>
                  </HStack>
                )}
                {property.owner_email && (
                  <HStack>
                    <Text fontWeight="medium" color="gray.600" minW="120px">
                      Agent Email:
                    </Text>
                    <Text>{property.owner_email}</Text>
                  </HStack>
                )}
                {property.created_at && (
                  <HStack>
                    <Text fontWeight="medium" color="gray.600" minW="120px">
                      Submitted:
                    </Text>
                    <Text>{new Date(property.created_at).toLocaleString()}</Text>
                  </HStack>
                )}
                {property.published_at && (
                  <HStack>
                    <Text fontWeight="medium" color="gray.600" minW="120px">
                      Published:
                    </Text>
                    <Text>{new Date(property.published_at).toLocaleString()}</Text>
                  </HStack>
                )}
                {property.featured_at && (
                  <HStack>
                    <Text fontWeight="medium" color="gray.600" minW="120px">
                      Featured:
                    </Text>
                    <Text>{new Date(property.featured_at).toLocaleString()}</Text>
                  </HStack>
                )}
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
