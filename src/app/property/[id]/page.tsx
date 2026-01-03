// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  SimpleGrid,
  Badge,
  HStack,
  VStack,
  Button,
  Spinner,
  Center,
  Icon,
} from "@chakra-ui/react";
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaToilet } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice } from "@/utils/Method";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id]);

  const fetchProperty = async (id: string) => {
    const supabase = createClient();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navbar />
        <Center h="60vh">
          <Spinner size="xl" color="purple.500" thickness="4px" />
        </Center>
      </Box>
    );
  }

  if (!property) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navbar />
        <Container maxW="container.xl" py={10}>
          <Center h="40vh">
            <VStack spacing={4}>
              <Heading size="lg">Property Not Found</Heading>
              <Button colorScheme="purple" onClick={() => router.back()}>
                Go Back
              </Button>
            </VStack>
          </Center>
        </Container>
        <Footer />
      </Box>
    );
  }

  const images = property.images || [];
  const currentImage = images[selectedImage] || "/images/placeholder.jpg";

  return (
    <Box minH="100vh" bg="gray.50">
      
      <Container maxW="container.xl" py={10}>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          mb={6}
          onClick={() => router.back()}
        >
          Back
        </Button>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Image Gallery */}
          <Box>
            <Box position="relative" mb={4}>
              <Image
                src={currentImage}
                alt={property.title}
                w="100%"
                h="400px"
                objectFit="cover"
                borderRadius="xl"
                fallback={
                  <Box
                    w="100%"
                    h="400px"
                    bg="gray.200"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="gray.500">No Image Available</Text>
                  </Box>
                }
              />
      
            </Box>

            {images.length > 1 && (
              <SimpleGrid columns={4} spacing={2}>
                {images.slice(0, 4).map((img: string, idx: number) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`Property ${idx + 1}`}
                    h="80px"
                    w="100%"
                    objectFit="cover"
                    borderRadius="md"
                    cursor="pointer"
                    border={selectedImage === idx ? "3px solid" : "none"}
                    borderColor="purple.500"
                    onClick={() => setSelectedImage(idx)}
                    _hover={{ opacity: 0.8 }}
                  />
                ))}
              </SimpleGrid>
            )}
          </Box>

          {/* Property Details */}
          <VStack align="stretch" spacing={6}>
            <Box>
              <HStack mb={2}>
                <Badge colorScheme="purple" fontSize="sm">
                  {property.category || "For Sale"}
                </Badge>
                {property.is_featured && (
                  <Badge colorScheme="orange" fontSize="sm">
                    Featured
                  </Badge>
                )}
              </HStack>
              <Heading size="xl" mb={2}>
                {property.title}
              </Heading>
              <HStack color="gray.600" mb={4}>
                <Icon as={FaMapMarkerAlt} />
                <Text>
                  {property.city}, {property.state}
                </Text>
              </HStack>
              <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                {formatPrice(property.price, (property.currency as 'NGN' | 'USD') || 'NGN')}
              </Text>
            </Box>

            <SimpleGrid columns={4} spacing={4}>
              <Box textAlign="center" p={3} bg="white" borderRadius="lg">
                <Icon as={FaBed} boxSize={6} color="purple.500" mb={2} />
                <Text fontWeight="bold">{property.bedrooms || 0}</Text>
                <Text fontSize="sm" color="gray.600">
                  Bedrooms
                </Text>
              </Box>
              <Box textAlign="center" p={3} bg="white" borderRadius="lg">
                <Icon as={FaBath} boxSize={6} color="purple.500" mb={2} />
                <Text fontWeight="bold">{property.bathrooms || 0}</Text>
                <Text fontSize="sm" color="gray.600">
                  Bathrooms
                </Text>
              </Box>
              {property.toilets && (
                <Box textAlign="center" p={3} bg="white" borderRadius="lg">
                  <Icon as={FaToilet} boxSize={6} color="purple.500" mb={2} />
                  <Text fontWeight="bold">{property.toilets}</Text>
                  <Text fontSize="sm" color="gray.600">
                    Toilets
                  </Text>
                </Box>
              )}
              <Box textAlign="center" p={3} bg="white" borderRadius="lg">
                <Icon as={FaRuler} boxSize={6} color="purple.500" mb={2} />
                <Text fontWeight="bold">{property.sqft || 0}</Text>
                <Text fontSize="sm" color="gray.600">
                  Sqm
                </Text>
              </Box>
            </SimpleGrid>

            <Box bg="white" p={6} borderRadius="xl">
              <Heading size="md" mb={4}>
                Description
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                {property.description || "No description available."}
              </Text>
            </Box>

            {property.features && property.features.length > 0 && (
              <Box bg="white" p={6} borderRadius="xl">
                <Heading size="md" mb={4}>
                  Features & Amenities
                </Heading>
                <SimpleGrid columns={2} spacing={3}>
                  {property.features.map((feature: string, idx: number) => (
                    <HStack key={idx}>
                      <Box w={2} h={2} bg="purple.500" borderRadius="full" />
                      <Text fontSize="sm">{feature}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Box>
            )}

       
          </VStack>
        </SimpleGrid>
      </Container>

    </Box>
  );
}
