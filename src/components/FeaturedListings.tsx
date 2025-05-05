'use client'
import { Box, Container, Heading, Text, Image, Badge, Flex } from '@chakra-ui/react';
import { Property } from '../types';
import Marquee from 'react-fast-marquee';
import { colors } from '@/utils/color';




const featuredProperties: Property[] = [
  {
    id: 1,
    title: "Modern 3 Bedroom Apartment",
    location: { state: "Lagos", city: "Lekki", area: "Lekki Phase 1", address: "123 Lekki Street" },
    price: "₦75,000,000",
    type: "3 Bedroom",
    condition: "For Rent",
    imageUrl: "https://images.nigeriapropertycentre.com/properties/images/thumbs/2849857/068151d7c46fb6-5-bedroom-fully-detached-smart-homr-with-pool-inverter-system-and-bq-detached-duplexes-for-sale-ajah-lagos.jpg",
    description: "A modern apartment with spacious rooms and a great view.",
    purpose: "Residential",
    features: { furnished: true, serviced: true },
    amenities: ["Gym", "Swimming Pool"],
    bedrooms: 3,
    bathrooms: 2,
    areaSize: "150 sqm",
    images: ["/images/featured/property1.jpg"],

  },
  {
    id: 2,
    title: "Luxury Villa with Pool",
    location: { state: "Lagos", city: "Ikoyi", area: "Banana Island", address: "456 Ikoyi Avenue" },
    price: "₦220,000,000",
    type: "5 Bedroom",
    condition: "For Rent",
    imageUrl: "https://th.bing.com/th/id/OIP.XgG-Qir9jaPGDARzPTTG9QHaE7?w=138&h=104&c=7&bgcl=89a921&r=0&o=6&dpr=2&pid=13.1",
    description: "A luxurious villa with a private pool and modern amenities.",
    purpose: "Residential",
    features: { furnished: true, serviced: true },
    amenities: ["Security", "Garage"],
    bedrooms: 5,
    bathrooms: 4,
    areaSize: "500 sqm",
    images: ["/images/featured/property2.jpg"],
  
    
  },
  {
    id: 3,
    title: "Commercial Space",
    location: { state: "Lagos", city: "Victoria Island", area: "Eko Atlantic", address: "789 VI Road" },
    price: "₦1,200,000/year",
    type: "Shop / Store",
    condition: "For Rent",
    imageUrl: "https://th.bing.com/th/id/OIP.ckJaibgc_sLogseEzV2zlwHaE9?w=140&h=104&c=7&bgcl=a28f47&r=0&o=6&dpr=2&pid=13.1",
    description: "A prime commercial space in a high-traffic area.",
    purpose: "Commercial",
    features: { furnished: true, serviced: true },
    amenities: ["Power Backup", "CCTV"],
    bedrooms: 0,
    bathrooms: 1,
    areaSize: "100 sqm",
    images: ["/images/featured/property3.jpg"],


  }
];

const featuredProperties2: Property[] = [
    {
      id: 1,
      title: "Modern 3 Bedroom Apartment",
      location: { state: "Lagos", city: "Lekki", area: "Lekki Phase 1", address: "123 Lekki Street" },
      price: "₦75,000,000",
      type: "3 Bedroom",
      condition: "For Sale",
      imageUrl: "https://images.nigeriapropertycentre.com/properties/images/thumbs/2849857/068151d7c46fb6-5-bedroom-fully-detached-smart-homr-with-pool-inverter-system-and-bq-detached-duplexes-for-sale-ajah-lagos.jpg",
      description: "A modern apartment with spacious rooms and a great view.",
      purpose: "Residential",
      features: { furnished: true, serviced: true },
      amenities: ["Gym", "Swimming Pool"],
      bedrooms: 3,
      bathrooms: 2,
      areaSize: "150 sqm",
      images: ["/images/featured/property1.jpg"],
  
    },
    {
      id: 2,
      title: "Luxury Villa with Pool",
      location: { state: "Lagos", city: "Ikoyi", area: "Banana Island", address: "456 Ikoyi Avenue" },
      price: "₦220,000,000",
      type: "5 Bedroom",
      condition: "For Sale",
      imageUrl: "https://th.bing.com/th/id/OIP.XgG-Qir9jaPGDARzPTTG9QHaE7?w=138&h=104&c=7&bgcl=89a921&r=0&o=6&dpr=2&pid=13.1",
      description: "A luxurious villa with a private pool and modern amenities.",
      purpose: "Residential",
      features: { furnished: true, serviced: true },
      amenities: ["Security", "Garage"],
      bedrooms: 5,
      bathrooms: 4,
      areaSize: "500 sqm",
      images: ["/images/featured/property2.jpg"],
    
      
    },
    {
      id: 3,
      title: "Commercial Space",
      location: { state: "Lagos", city: "Victoria Island", area: "Eko Atlantic", address: "789 VI Road" },
      price: "₦1,200,000/year",
      type: "Shop / Store",
      condition: "For Sale",
      imageUrl: "https://th.bing.com/th/id/OIP.ckJaibgc_sLogseEzV2zlwHaE9?w=140&h=104&c=7&bgcl=a28f47&r=0&o=6&dpr=2&pid=13.1",
      description: "A prime commercial space in a high-traffic area.",
      purpose: "Commercial",
      features: { furnished: true, serviced: true },
      amenities: ["Power Backup", "CCTV"],
      bedrooms: 0,
      bathrooms: 1,
      areaSize: "100 sqm",
      images: ["/images/featured/property3.jpg"],
  
  
    }
  ];


const FeaturedListings = () => {
  return (
    <Box py={12} id="featured">
      <Container maxW="container.xl">
        <Heading as="h2" size="xl" mb={8} textAlign="center">Featured Listings</Heading>
        
        <Box overflow="hidden" width="100%">
          <Marquee 
            speed={40} 
            gradient={false}
            pauseOnHover={true}
            style={{ padding: '10px 0' }}
           
          >
          
            {[...featuredProperties, ...featuredProperties].map((property, index) => (
              <Box
                key={`${property.id}-${index}`}
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                boxShadow="md"
                transition="transform 0.3s"
                _hover={{ transform: 'translateY(-5px)' }}
                minW="300px"
                mx="15px" 
                flexShrink={0} 
              >
                <Box height="220px" overflow="hidden">
                  <Image 
                    src={property.imageUrl} 
                    alt={property.title}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    transition="transform 0.3s"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                </Box>
                
                <Box p={5}>
                  <Flex justifyContent="space-between" alignItems="center" mb={2}>
                    <Badge colorScheme={property.condition === "For Rent" ? "green" : "orange"}>
                      {property.condition}
                    </Badge>
                    <Badge>{property.type}</Badge>
                  </Flex>
                  
                  <Heading as="h3" size="md" mb={2}>{property.title}</Heading>
                  <Text color="gray.600" mb={3}>
                    {`${property.location.city}, ${property.location.state}`}
                  </Text>
                  <Text fontWeight="bold" fontSize="lg" color={colors.primary}>{property.price}</Text>
                </Box>
              </Box>
            ))}
          </Marquee>
        </Box>

        <Box overflow="hidden" width="100%" mt={2}>
          <Marquee 
            speed={40} 
            gradient={false}
            pauseOnHover={true}
            style={{ padding: '10px 0' }}
           direction='right'
          >
          
            {[...featuredProperties2, ...featuredProperties2].map((property, index) => (
              <Box
                key={`${property.id}-${index}`}
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                boxShadow="md"
                transition="transform 0.3s"
                _hover={{ transform: 'translateY(-5px)' }}
                minW="300px"
                mx="15px" 
                flexShrink={0} 
              >
                <Box height="220px" overflow="hidden">
                  <Image 
                    src={property.imageUrl} 
                    alt={property.title}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    transition="transform 0.3s"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                </Box>
                
                <Box p={5}>
                  <Flex justifyContent="space-between" alignItems="center" mb={2}>
                    <Badge colorScheme={property.condition === "For Sale" ? "orange" : "green"}>
                      {property.condition}
                    </Badge>
                    <Badge >{property.type}</Badge>
                  </Flex>
                  
                  <Heading as="h3" size="md" mb={2}>{property.title}</Heading>
                  <Text color="gray.600" mb={3}>
                    {`${property.location.city}, ${property.location.state}`}
                  </Text>
                  <Text fontWeight="bold" fontSize="lg" color={colors.primary}>{property.price}</Text>
                </Box>
              </Box>
            ))}
          </Marquee>
        </Box>

      </Container>
    </Box>
  );
}

export default FeaturedListings;


