'use client'

import { useState } from "react";
import {
  Box, Button, Container, Flex, Grid, Heading, HStack, Icon,
  Image, Input, InputGroup, InputLeftElement, Select, SimpleGrid, Tag,
  Text, VStack, useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, Avatar, AvatarBadge, Badge,
  Divider, Stack, RangeSlider, RangeSliderTrack,
  RangeSliderFilledTrack, RangeSliderThumb, Stat, StatLabel, StatNumber
} from "@chakra-ui/react";
import { SearchIcon, RepeatIcon } from "@chakra-ui/icons";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaPhone, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { GiHouseKeys } from "react-icons/gi";
import { BsHouseCheck, BsLightningCharge } from "react-icons/bs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


interface Agent {
  name: string;
  company: string;
  phone: string;
  verified: boolean;
}

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  beds: number;
  baths: number;
  size: number;
  image: string;
  status: string;
  features: string[];
  agent: Agent;
  paymentPlan: string;
}

interface Filters {
  priceRange: [number, number];
  type: string;
  beds: string;
  location: string;
}


const properties: Property[] = [
  {
    id: 1,
    title: "Luxury Lekki Penthouse",
    location: "Lekki Phase 1, Lagos",
    price: 185000000,
    type: "Penthouse",
    beds: 4,
    baths: 5,
    size: 420,
    image:  "https://media.istockphoto.com/id/1421422160/photo/interior-of-living-room.webp?a=1&b=1&s=612x612&w=0&k=20&c=z0nRq3IMBRow4NotaBjxVVc8cLReRe69Yty0QPOPjqI=",
    status: "New Listing",
    features: ["Smart Home", "Infinity Pool", "24/7 Power", "Sea View"],
    agent: {
      name: "Tunde Adeleke",
      company: "Elite Properties NG",
      phone: "+2347081234567",
      verified: true
    },
    paymentPlan: "30% down, 24 months installment"
  },
  {
    id: 2,
    title: "Ikoyi Gated Estate",
    location: "Bourdillon Rd, Ikoyi",
    price: 320000000,
    type: "Estate Home",
    beds: 5,
    baths: 6,
    size: 800,
    image: "https://images.unsplash.com/photo-1715424778955-141efa67a50a?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    status: "Premium",
    features: ["Gym", "Tennis Court", "3-Car Garage", "Smart Security"],
    agent: {
      name: "Chioma Eze",
      company: "Prime Homes Ltd",
      phone: "+2348059876543",
      verified: true
    },
    paymentPlan: "Bank financing available"
  },
 
];

const BuyPropertyPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    priceRange: [50000000, 500000000],
    type: "",
    beds: "",
    location: ""
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const categories = ['Price', 'Property Type', 'Bedrooms', 'Location'];

  const filteredProperties = properties.filter((property: Property) => {
    return (
      (property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (property.price >= filters.priceRange[0] &&
      property.price <= filters.priceRange[1]) &&
      (filters.type === "" || property.type === filters.type) &&
      (filters.beds === "" || property.beds >= parseInt(filters.beds)) &&
      (filters.location === "" || property.location.includes(filters.location))
    );
  });

  const openPropertyModal = (property: Property) => {
    setSelectedProperty(property);
    onOpen();
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Box bg="gray.50">
    <Navbar/>
      <Box bgGradient="linear(to-r, purple.700, purple.500)"  pt={['40%',"15%"]} color="white" h={'60vh'}>
        <Container maxW="container.xl" py={6} >
          <VStack spacing={6} textAlign="center">
            <HStack>
              <Icon as={GiHouseKeys} boxSize={10} />
              <Heading as="h1" size="2xl">Properties For Sale</Heading>
            </HStack>
            <Text fontSize="xl">Premium properties with verified titles</Text>
            
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


      <Container maxW="container.xl" py={10}>
        <Grid templateColumns={{ base: "1fr", lg: "280px 1fr" }} gap={8}>
     
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <Heading size="md" mb={6} color="purple.700">Refine Search</Heading>
            
            <Stack spacing={6}>
              <Box>
                <Text fontWeight="600" mb={2}>Price Range (₦)</Text>
                <RangeSlider
                  min={0}
                  max={500000000}
                  step={10000000}
                  value={filters.priceRange}
                  onChange={(val: [number, number]) => setFilters({...filters, priceRange: val})}
                  colorScheme="purple"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <Flex justify="space-between" mt={2}>
                  <Text fontSize="sm">{formatPrice(filters.priceRange[0])}</Text>
                  <Text fontSize="sm">{formatPrice(filters.priceRange[1])}</Text>
                </Flex>
              </Box>

              <Box>
                <Text fontWeight="600" mb={2}>Property Type</Text>
                <Select
                  placeholder="All Types"
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="Penthouse">Penthouse</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Terrace">Terrace</option>
                  <option value="Estate Home">Estate Home</option>
                  <option value="Bungalow">Bungalow</option>
                </Select>
              </Box>

              <Box>
                <Text fontWeight="600" mb={2}>Bedrooms</Text>
                <Select
                  placeholder="Any"
                  value={filters.beds}
                  onChange={(e) => setFilters({...filters, beds: e.target.value})}
                >
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </Select>
              </Box>

              <Box>
                <Text fontWeight="600" mb={2}>Location</Text>
                <Select
                  placeholder="All Areas"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                >
                  <option value="Lekki">Lekki</option>
                  <option value="Ikoyi">Ikoyi</option>
                  <option value="Victoria Island">Victoria Island</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                </Select>
              </Box>

              <Button
                leftIcon={<RepeatIcon />}
                variant="outline"
                colorScheme="purple"
                onClick={() => setFilters({
                  priceRange: [50000000, 500000000],
                  type: "",
                  beds: "",
                  location: ""
                })}
              >
                Reset Filters
              </Button>
            </Stack>
          </Box>

          {/* Property Listings */}
          <Box>
            <Flex justify="space-between" mb={6}>
              <Text fontSize="lg" fontWeight="600">
                {filteredProperties.length} Properties Found
              </Text>
              <Select width="200px" defaultValue="featured">
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Listings</option>
              </Select>
            </Flex>

            {filteredProperties.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredProperties.map((property: Property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onClick={() => openPropertyModal(property)}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Box bg="white" p={10} borderRadius="xl" textAlign="center">
                <Heading size="md" mb={3}>No Properties Match Your Search</Heading>
                <Text color="gray.600">Try adjusting your filters or search term</Text>
              </Box>
            )}
          </Box>
        </Grid>
      </Container>

      {/* Property Modal */}
      {selectedProperty && (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Heading size="lg">{selectedProperty.title}</Heading>
              <Text color="purple.600">{selectedProperty.location}</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Image 
                src={selectedProperty.image} 
                alt={selectedProperty.title}
                borderRadius="md"
                mb={4}
              />

              <Flex justify="space-between" mb={6}>
                <Box>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.700">
                    {formatPrice(selectedProperty.price)}
                  </Text>
                  <Badge colorScheme="green">{selectedProperty.status}</Badge>
                </Box>

                <HStack spacing={4}>
                  <Stat>
                    <StatLabel>Bedrooms</StatLabel>
                    <StatNumber>{selectedProperty.beds}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Bathrooms</StatLabel>
                    <StatNumber>{selectedProperty.baths}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Size (sqm)</StatLabel>
                    <StatNumber>{selectedProperty.size}</StatNumber>
                  </Stat>
                </HStack>
              </Flex>

              <Box mb={6}>
                <Heading size="md" mb={3}>Property Features</Heading>
                <SimpleGrid columns={2} spacing={2}>
                  {selectedProperty.features.map((feature, i) => (
                    <HStack key={i}>
                      <Icon as={BsLightningCharge} color="purple.500" />
                      <Text>{feature}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Box>

              <Box bg="purple.50" p={4} borderRadius="md" mb={6}>
                <Heading size="md" mb={3}>Payment Plan</Heading>
                <Text>{selectedProperty.paymentPlan}</Text>
              </Box>

              <Box>
                <Heading size="md" mb={3}>Contact Agent</Heading>
                <Flex align="center" mb={4}>
                  <Avatar size="lg" mr={3}>
                    {selectedProperty.agent.verified && (
                      <AvatarBadge boxSize="1.25em" bg="green.500" />
                    )}
                  </Avatar>
                  <Box>
                    <Text fontWeight="bold">{selectedProperty.agent.name}</Text>
                    <Text>{selectedProperty.agent.company}</Text>
                  </Box>
                </Flex>

                <SimpleGrid columns={2} spacing={4}>
                  <Button leftIcon={<FaPhone />} colorScheme="purple">
                    Call Agent
                  </Button>
                  <Button leftIcon={<FaWhatsapp />} colorScheme="whatsapp">
                    WhatsApp
                  </Button>
                  <Button leftIcon={<FaEnvelope />} variant="outline">
                    Email
                  </Button>
                  <Button leftIcon={<BsHouseCheck />} colorScheme="green">
                    Schedule Viewing
                  </Button>
                </SimpleGrid>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      <Footer/>
    </Box>
  );
};

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

const PropertyCard = ({ property, onClick }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const formatPrice = (price: number): string => {
    if (price >= 100000000) {
      return `₦${(price / 1000000).toFixed(0)}M`;
    }
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Box
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
    >
      <Box position="relative">
        <Image
          src={property.image}
          alt={property.title}
          h="200px"
          w="100%"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top={3}
          left={3}
          colorScheme={
            property.status === "Premium" ? "purple" : 
            property.status === "New Listing" ? "green" : "orange"
          }
        >
          {property.status}
        </Badge>
        <Button
          position="absolute"
          top={3}
          right={3}
          size="sm"
          colorScheme={isFavorite ? "pink" : "whiteAlpha"}
          onClick={() => setIsFavorite(!isFavorite)}
          leftIcon={<FaHeart />}
        >
          {isFavorite ? "Saved" : "Save"}
        </Button>
      </Box>

      <Box p={5}>
        <Text fontSize="xl" fontWeight="bold" color="purple.700" mb={1}>
          {formatPrice(property.price)}
        </Text>
        <Heading as="h3" size="md" mb={2} noOfLines={1}>
          {property.title}
        </Heading>
        <HStack color="gray.600" mb={3}>
          <Icon as={FaMapMarkerAlt} />
          <Text fontSize="sm">{property.location}</Text>
        </HStack>

        <Divider my={3} />

        <Flex justify="space-between">
          <HStack>
            <Icon as={FaBed} color="gray.600" />
            <Text>{property.beds} Beds</Text>
          </HStack>
          <HStack>
            <Icon as={FaBath} color="gray.600" />
            <Text>{property.baths} Baths</Text>
          </HStack>
          <HStack>
            <Icon as={FaRulerCombined} color="gray.600" />
            <Text>{property.size} sqm</Text>
          </HStack>
        </Flex>

        <Button
          colorScheme="purple"
          mt={4}
          w="full"
          onClick={onClick}
        >
          View Details
        </Button>
      </Box>
    </Box>
  );
};

export default BuyPropertyPage;