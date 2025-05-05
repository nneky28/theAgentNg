// "use client";

// import {
//   Box,
//   Button,
//   Container,
//   Flex,
//   Grid,
//   GridItem,
//   Heading,
//   HStack,
//   Icon,
//   Image,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   Select,
//   SimpleGrid,
//   Tag,
//   Text,
//   VStack,
//   useColorModeValue,
//   RangeSlider,
//   RangeSliderTrack,
//   RangeSliderFilledTrack,
//   RangeSliderThumb,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   Avatar,
//   AvatarBadge,
// } from "@chakra-ui/react";
// import { useState } from "react";
// import {
//   SearchIcon,
//   StarIcon,
//   RepeatIcon,
//   ViewIcon,
//   PhoneIcon,
//   EmailIcon,
// } from "@chakra-ui/icons";
// import {
//   FaBed,
//   FaBath,
//   FaRulerCombined,
//   FaMapMarkerAlt,
//   FaHeart,
//   FaPhone,
//   FaEnvelope,
//   FaWhatsapp,
//   FaCheck,
// } from "react-icons/fa";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { TbHomeSearch } from "react-icons/tb";

// const mockProperties = [
//   {
//     id: 1,
//     title: "Modern 3 Bedroom Apartment",
//     location: "Lekki Phase 1, Lagos",
//     price: 65000000, // Purchase price
//     type: "Apartment",
//     beds: 3,
//     baths: 2,
//     size: 120, // sqm
//     image:
//       "https://images.unsplash.com/photo-1663021935935-ce2534cc79e3?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
//     isFeatured: true,
//     isPremium: true,
//     agent: {
//       name: "Adebayo Johnson",
//       phone: "+234 812 345 6789",
//       email: "adebayo@realestate.ng",
//       photo: "https://randomuser.me/api/portraits/men/32.jpg",
//       isVerified: true,
//     },
//     description:
//       "Beautiful modern apartment in prime Lekki location with 24/7 security, swimming pool, and gym facilities. Fully furnished with quality finishes.",
//     features: [
//       "Swimming Pool",
//       "24/7 Security",
//       "Gym",
//       "Parking Space",
//       "Fully Furnished",
//     ],
//   },
//   {
//     id: 2,
//     title: "Spacious 4 Bedroom Duplex",
//     location: "Victoria Island, Lagos",
//     price: 120000000,
//     type: "Duplex",
//     beds: 4,
//     baths: 4,
//     size: 300,
//     image:
//       "https://images.unsplash.com/photo-1702014860610-06a4c3f83381?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
//     isFeatured: true,
//     isPremium: true,
//     agent: {
//       name: "Chioma Okonkwo",
//       phone: "+234 803 456 7890",
//       email: "chioma@realestate.ng",
//       photo: "https://randomuser.me/api/portraits/women/44.jpg",
//       isVerified: true,
//     },
//     description:
//       "Luxury duplex in the heart of Victoria Island with smart home features, private garden and staff quarters.",
//     features: [
//       "Smart Home",
//       "Private Garden",
//       "Staff Quarters",
//       "Security",
//       "Parking",
//     ],
//   },
//   {
//     id: 3,
//     title: "5 Bedroom Detached House",
//     location: "Ikoyi, Lagos",
//     price: 250000000,
//     type: "House",
//     beds: 5,
//     baths: 5,
//     size: 450,
//     image:
//       "https://images.unsplash.com/photo-1702014860012-e0139aae6f69?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
//     isFeatured: false,
//     isPremium: true,
//     agent: {
//       name: "Emeka Okafor",
//       phone: "+234 802 567 8901",
//       email: "emeka@realestate.ng",
//       photo: "https://randomuser.me/api/portraits/men/22.jpg",
//       isVerified: true,
//     },
//     description:
//       "Exclusive detached house in highbrow Ikoyi neighborhood with panoramic views and luxury finishes throughout.",
//     features: [
//       "Panoramic Views",
//       "Home Theater",
//       "Swimming Pool",
//       "Smart Home",
//       "Generator",
//     ],
//   },
//   {
//     id: 4,
//     title: "2 Bedroom Flat",
//     location: "Surulere, Lagos",
//     price: 35000000,
//     type: "Flat",
//     beds: 2,
//     baths: 2,
//     size: 90,
//     image:
//       "https://images.unsplash.com/photo-1724862873281-238213626373?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
//     isFeatured: false,
//     isPremium: false,
//     agent: {
//       name: "Folake Adeleke",
//       phone: "+234 815 678 9012",
//       email: "folake@realestate.ng",
//       photo: "https://randomuser.me/api/portraits/women/33.jpg",
//       isVerified: false,
//     },
//     description:
//       "Affordable 2 bedroom flat in central Surulere location, close to amenities and transport links.",
//     features: [
//       "24/7 Security",
//       "Parking",
//       "Water Supply",
//       "Close to Amenities",
//     ],
//   },
//   {
//     id: 5,
//     title: "3 Bedroom Terrace",
//     location: "GRA, Ibadan",
//     price: 45000000,
//     type: "Terrace",
//     beds: 3,
//     baths: 3,
//     size: 150,
//     image:
//       "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
//     isFeatured: true,
//     isPremium: false,
//     agent: {
//       name: "Yusuf Bello",
//       phone: "+234 807 789 0123",
//       email: "yusuf@realestate.ng",
//       photo: "https://randomuser.me/api/portraits/men/55.jpg",
//       isVerified: true,
//     },
//     description:
//       "Well-maintained terrace house in Government Reserved Area (GRA) Ibadan with ample outdoor space.",
//     features: [
//       "Ample Outdoor Space",
//       "Security",
//       "Quiet Neighborhood",
//       "Parking",
//     ],
//   },
//   {
//     id: 6,
//     title: "4 Bedroom Semi-Detached",
//     location: "Wuse 2, Abuja",
//     price: 85000000,
//     type: "House",
//     beds: 4,
//     baths: 4,
//     size: 280,
//     image:
//       "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
//     isFeatured: false,
//     isPremium: true,
//     agent: {
//       name: "Amina Mohammed",
//       phone: "+234 809 890 1234",
//       email: "amina@realestate.ng",
//       photo: "https://randomuser.me/api/portraits/women/66.jpg",
//       isVerified: true,
//     },
//     description:
//       "Elegant semi-detached house in prime Wuse 2 location with modern amenities and security.",
//     features: [
//       "Modern Amenities",
//       "Security",
//       "Generator",
//       "Parking",
//       "Garden",
//     ],
//   },
// ];

// interface Property {
//   id: number;
//   title: string;
//   location: string;
//   price: number;
//   type: string;
//   beds: number;
//   baths: number;
//   size: number;
//   image: string;
//   isFeatured: boolean;
//   isPremium: boolean;
//   agent: {
//     name: string;
//     phone: string;
//     email: string;
//     photo: string;
//     isVerified: boolean;
//   };
//   description: string;
//   features: string[];
// }

// const PropertyCard = ({ property }: { property: Property }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   return (
//     <>
//       <Box
//         bg="white"
//         borderRadius="lg"
//         overflow="hidden"
//         shadow="md"
//         transition="all 0.3s"
//         _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
//         position="relative"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {property.isPremium && (
//           <Tag
//             position="absolute"
//             top={3}
//             left={3}
//             bg="#724B9B"
//             color="white"
//             fontWeight="bold"
//             size="sm"
//             zIndex={1}
//           >
//             Premium
//           </Tag>
//         )}

//         <Box position="relative" h="240px">
//           <Image
//             src={property.image}
//             alt={property.title}
//             w="100%"
//             h="100%"
//             objectFit="cover"
//           />

//           <Flex
//             position="absolute"
//             top={0}
//             left={0}
//             right={0}
//             bottom={0}
//             bg="blackAlpha.600"
//             opacity={isHovered ? 1 : 0}
//             transition="opacity 0.3s"
//             justifyContent="center"
//             alignItems="center"
//             gap={4}
//           >
//             <Button
//               size="sm"
//               colorScheme="whiteAlpha"
//               leftIcon={<Icon as={ViewIcon} />}
//               borderRadius="full"
//               onClick={onOpen}
//             >
//               View details
//             </Button>
//           </Flex>
//         </Box>

//         <Box p={5}>
//           <HStack justifyContent="space-between" mb={2}>
//             <Text color="#724B9B" fontWeight="bold" fontSize="xl">
//               ₦{property.price.toLocaleString("en-NG")}
//             </Text>
//             {property.isFeatured && (
//               <HStack color="orange.400">
//                 <StarIcon />
//                 <Text fontSize="sm" fontWeight="medium">
//                   Featured
//                 </Text>
//               </HStack>
//             )}
//           </HStack>

//           <Heading as="h3" size="md" mb={2} noOfLines={1}>
//             {property.title}
//           </Heading>

//           <HStack mb={4} color="gray.600">
//             <Icon as={FaMapMarkerAlt} />
//             <Text fontSize="sm" noOfLines={1}>
//               {property.location}
//             </Text>
//           </HStack>

//           <Flex
//             justify="space-between"
//             borderTop="1px"
//             borderColor="gray.100"
//             pt={3}
//           >
//             <HStack>
//               <Icon as={FaBed} color="gray.600" />
//               <Text fontSize="sm">
//                 {property.beds} {property.beds > 1 ? "Beds" : "Bed"}
//               </Text>
//             </HStack>
//             <HStack>
//               <Icon as={FaBath} color="gray.600" />
//               <Text fontSize="sm">
//                 {property.baths} {property.baths > 1 ? "Baths" : "Bath"}
//               </Text>
//             </HStack>
//             <HStack>
//               <Icon as={FaRulerCombined} color="gray.600" />
//               <Text fontSize="sm">{property.size} m²</Text>
//             </HStack>
//           </Flex>
//         </Box>
//       </Box>

//       {/* Property Details Modal */}
//       <Modal isOpen={isOpen} onClose={onClose} size="xl">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>
//             <Heading size="lg">{property.title}</Heading>
//             <Text color="gray.600" fontSize="sm">
//               {property.location}
//             </Text>
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <SimpleGrid columns={3} spacing={2} mb={6}>
//               {[property.image, property.image, property.image].map(
//                 (img, i) => (
//                   <Box key={i} borderRadius="md" overflow="hidden" h="120px">
//                     <Image
//                       src={img}
//                       alt=""
//                       w="100%"
//                       h="100%"
//                       objectFit="cover"
//                     />
//                   </Box>
//                 )
//               )}
//             </SimpleGrid>

//             <Flex justify="space-between" mb={6}>
//               <Box>
//                 <Text fontSize="2xl" fontWeight="bold" color="#724B9B">
//                   ₦{property.price.toLocaleString("en-NG")}
//                 </Text>
//                 <Text color="gray.600">Purchase Price</Text>
//               </Box>

//               <Flex gap={4}>
//                 <Box textAlign="center">
//                   <Text fontWeight="bold">{property.beds}</Text>
//                   <Text color="gray.600">Bedrooms</Text>
//                 </Box>
//                 <Box textAlign="center">
//                   <Text fontWeight="bold">{property.baths}</Text>
//                   <Text color="gray.600">Bathrooms</Text>
//                 </Box>
//                 <Box textAlign="center">
//                   <Text fontWeight="bold">{property.size} m²</Text>
//                   <Text color="gray.600">Area</Text>
//                 </Box>
//               </Flex>
//             </Flex>

//             <Box mb={6}>
//               <Heading size="md" mb={3}>
//                 Description
//               </Heading>
//               <Text>{property.description}</Text>
//             </Box>

//             <Box mb={6}>
//               <Heading size="md" mb={3}>
//                 Features
//               </Heading>
//               <SimpleGrid columns={2} spacing={2}>
//                 {property.features.map((feature, i) => (
//                   <HStack key={i}>
//                     <Icon as={FaCheck} color="green.500" />
//                     <Text>{feature}</Text>
//                   </HStack>
//                 ))}
//               </SimpleGrid>
//             </Box>

//             <Box bg="gray.50" p={4} borderRadius="md">
//               <Heading size="md" mb={3}>
//                 Contact Agent
//               </Heading>
//               <Flex align="center" mb={4}>
//                 <Avatar
//                   src={property.agent.photo}
//                   name={property.agent.name}
//                   mr={3}
//                   size="lg"
//                 >
//                   {property.agent.isVerified && (
//                     <AvatarBadge boxSize="1.25em" bg="green.500" />
//                   )}
//                 </Avatar>
//                 <Box>
//                   <Text fontWeight="bold">{property.agent.name}</Text>
//                   <Text color="gray.600">Real Estate Agent</Text>
//                 </Box>
//               </Flex>

//               <SimpleGrid columns={2} spacing={4}>
//                 <Button leftIcon={<FaPhone />} colorScheme="purple">
//                   {property.agent.phone}
//                 </Button>
//                 <Button
//                   leftIcon={<FaWhatsapp />}
//                   colorScheme="whatsapp"
//                   variant="outline"
//                 >
//                   WhatsApp
//                 </Button>
//                 <Button
//                   leftIcon={<FaEnvelope />}
//                   colorScheme="gray"
//                   variant="outline"
//                 >
//                   Email
//                 </Button>
//                 <Button leftIcon={<ViewIcon />} colorScheme="blue">
//                   Schedule Viewing
//                 </Button>
//               </SimpleGrid>
//             </Box>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// const PropertiesForSalePage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [priceRange, setPriceRange] = useState([0, 500000000]);
//   const [propertyType, setPropertyType] = useState("");
//   const [bedrooms, setBedrooms] = useState("");
//   const [location, setLocation] = useState("");

//   const bgColor = useColorModeValue("gray.50", "gray.900");

//   const filteredProperties = mockProperties.filter((property) => {
//     const matchesSearch =
//       property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       property.location.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesPrice =
//       property.price >= priceRange[0] && property.price <= priceRange[1];
//     const matchesType = propertyType === "" || property.type === propertyType;
//     const matchesBeds = bedrooms === "" || property.beds === parseInt(bedrooms);
//     const matchesLocation =
//       location === "" || property.location.includes(location);

//     return (
//       matchesSearch &&
//       matchesPrice &&
//       matchesType &&
//       matchesBeds &&
//       matchesLocation
//     );
//   });

//   return (
//     <Box>
//       <Navbar />
//       <Box
//         pt={['40%',"15%"]}
//         pb="60px"
//         bgGradient="linear(to-r, purple.700, purple.500)"
//         color="white"
//         h={"60vh"}
//       >
//         <Container maxW="1200px" py={6} >
//           <VStack spacing={6} textAlign="center">
//             <HStack>
//               <Icon as={TbHomeSearch} boxSize={10} />
//               <Heading as="h1" size="2xl">
//                 Properties To Let
//               </Heading>
//             </HStack>
//             <Text fontSize="xl">
//               Find your dream home from our selection of premium properties
//               across Nigeria's best locations
//             </Text>

//             <Box w="100%" maxW="700px" mt={8} pb={8}>
//               <InputGroup size="lg">
//               <InputLeftElement pointerEvents="none">
//                   <SearchIcon color="gray.300" />
//                 </InputLeftElement>
//                 <Input
//                   bg="white"
//                   color="gray.800"
//                   placeholder="Search by property name..."
//                   borderRadius="lg"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </InputGroup>
//             </Box>
//           </VStack>
//         </Container>
//       </Box>

//       {/* Main Content */}
//       <Box py={10} bg={bgColor}>
//         <Container maxW="1200px">
//           <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={8}>
//             {/* Filters Sidebar */}
//             <GridItem>
//               <Box bg="white" p={6} borderRadius="lg" shadow="md">
//                 <Heading as="h3" size="md" mb={6}>
//                   Filter Properties
//                 </Heading>

//                 {/* Location */}
//                 <Box mb={6}>
//                   <Text fontWeight="medium" mb={2}>
//                     Location
//                   </Text>
//                   <Select
//                     placeholder="All Locations"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                   >
//                     <option value="Lekki">Lekki</option>
//                     <option value="Victoria Island">Victoria Island</option>
//                     <option value="Ikoyi">Ikoyi</option>
//                     <option value="Surulere">Surulere</option>
//                     <option value="Abuja">Abuja</option>
//                     <option value="Ibadan">Ibadan</option>
//                   </Select>
//                 </Box>

//                 {/* Property Type */}
//                 <Box mb={6}>
//                   <Text fontWeight="medium" mb={2}>
//                     Property Type
//                   </Text>
//                   <Select
//                     placeholder="All Types"
//                     value={propertyType}
//                     onChange={(e) => setPropertyType(e.target.value)}
//                   >
//                     <option value="Apartment">Apartment</option>
//                     <option value="Flat">Flat</option>
//                     <option value="House">House</option>
//                     <option value="Duplex">Duplex</option>
//                     <option value="Terrace">Terrace</option>
//                   </Select>
//                 </Box>

//                 {/* Price Range */}
//                 <Box mb={6}>
//                   <Text fontWeight="medium" mb={2}>
//                     Price Range
//                   </Text>
//                   <HStack justify="space-between" mb={2}>
//                     <Text fontSize="sm">
//                       ₦{priceRange[0].toLocaleString("en-NG")}
//                     </Text>
//                     <Text fontSize="sm">
//                       ₦{priceRange[1].toLocaleString("en-NG")}
//                     </Text>
//                   </HStack>
//                   <RangeSlider
//                     aria-label={["min", "max"]}
//                     colorScheme="purple"
//                     min={0}
//                     max={500000000}
//                     step={10000000}
//                     value={priceRange}
//                     onChange={(val) => setPriceRange(val)}
//                   >
//                     <RangeSliderTrack>
//                       <RangeSliderFilledTrack />
//                     </RangeSliderTrack>
//                     <RangeSliderThumb index={0} boxSize={6} />
//                     <RangeSliderThumb index={1} boxSize={6} />
//                   </RangeSlider>
//                 </Box>

//                 {/* Bedrooms */}
//                 <Box mb={6}>
//                   <Text fontWeight="medium" mb={2}>
//                     Bedrooms
//                   </Text>
//                   <Select
//                     placeholder="Any"
//                     value={bedrooms}
//                     onChange={(e) => setBedrooms(e.target.value)}
//                   >
//                     <option value="1">1 Bedroom</option>
//                     <option value="2">2 Bedrooms</option>
//                     <option value="3">3 Bedrooms</option>
//                     <option value="4">4 Bedrooms</option>
//                     <option value="5">5+ Bedrooms</option>
//                   </Select>
//                 </Box>

//                 {/* Reset Filters */}
//                 <Button
//                   leftIcon={<RepeatIcon />}
//                   variant="outline"
//                   colorScheme="purple"
//                   size="sm"
//                   width="full"
//                   onClick={() => {
//                     setSearchTerm("");
//                     setPriceRange([0, 500000000]);
//                     setPropertyType("");
//                     setBedrooms("");
//                     setLocation("");
//                   }}
//                 >
//                   Reset Filters
//                 </Button>
//               </Box>
//             </GridItem>

//             {/* Properties Grid */}
//             <GridItem>
//               <Box mb={6}>
//                 <Flex justify="space-between" align="center">
//                   <Text fontWeight="medium">
//                     {filteredProperties.length} Properties Found
//                   </Text>
//                   <Select w="200px" size="sm">
//                     <option value="newest">Newest First</option>
//                     <option value="price-asc">Price (Low to High)</option>
//                     <option value="price-desc">Price (High to Low)</option>
//                   </Select>
//                 </Flex>
//               </Box>

//               {filteredProperties.length > 0 ? (
//                 <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
//                   {filteredProperties.map((property) => (
//                     <PropertyCard key={property.id} property={property} />
//                   ))}
//                 </SimpleGrid>
//               ) : (
//                 <Box
//                   bg="white"
//                   p={10}
//                   borderRadius="lg"
//                   shadow="md"
//                   textAlign="center"
//                 >
//                   <Heading as="h3" size="md" mb={4}>
//                     No Properties Found
//                   </Heading>
//                   <Text color="gray.600">
//                     Try adjusting your search criteria or filters to see more
//                     results.
//                   </Text>
//                 </Box>
//               )}

//               {/* Pagination */}
//               {filteredProperties.length > 0 && (
//                 <HStack justify="center" mt={10} spacing={2}>
//                   <Button size="sm" colorScheme="purple">
//                     1
//                   </Button>
//                   <Button size="sm" variant="outline">
//                     2
//                   </Button>
//                   <Button size="sm" variant="outline">
//                     3
//                   </Button>
//                   <Button size="sm" variant="ghost">
//                     ...
//                   </Button>
//                   <Button size="sm" variant="outline">
//                     8
//                   </Button>
//                 </HStack>
//               )}
//             </GridItem>
//           </Grid>
//         </Container>
//       </Box>

//       <Footer />
//     </Box>
//   );
// };

// export default PropertiesForSalePage;


"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Tag,
  Text,
  VStack,
  useColorModeValue,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Avatar,
  AvatarBadge,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  SearchIcon,
  StarIcon,
  RepeatIcon,
  ViewIcon,
  PhoneIcon,
  EmailIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHeart,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaCheck,
} from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TbHomeSearch } from "react-icons/tb";
import { FiFilter } from "react-icons/fi";
import { Agent } from '../../types/index';

const mockProperties = [
  {
    id: 1,
    title: "Modern 3 Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: 65000000, // Purchase price
    type: "Apartment",
    beds: 3,
    baths: 2,
    size: 120, // sqm
    image:
      "https://images.unsplash.com/photo-1663021935935-ce2534cc79e3?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isFeatured: true,
    isPremium: true,
    agent: {
      name: "Adebayo Johnson",
      phone: "+234 812 345 6789",
      email: "adebayo@realestate.ng",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      isVerified: true,
    },
    description:
      "Beautiful modern apartment in prime Lekki location with 24/7 security, swimming pool, and gym facilities. Fully furnished with quality finishes.",
    features: [
      "Swimming Pool",
      "24/7 Security",
      "Gym",
      "Parking Space",
      "Fully Furnished",
    ],
  },
  {
    id: 2,
    title: "Spacious 4 Bedroom Duplex",
    location: "Victoria Island, Lagos",
    price: 120000000,
    type: "Duplex",
    beds: 4,
    baths: 4,
    size: 300,
    image:
      "https://images.unsplash.com/photo-1702014860610-06a4c3f83381?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isFeatured: true,
    isPremium: true,
    agent: {
      name: "Chioma Okonkwo",
      phone: "+234 803 456 7890",
      email: "chioma@realestate.ng",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      isVerified: true,
    },
    description:
      "Luxury duplex in the heart of Victoria Island with smart home features, private garden and staff quarters.",
    features: [
      "Smart Home",
      "Private Garden",
      "Staff Quarters",
      "Security",
      "Parking",
    ],
  },
  {
    id: 3,
    title: "5 Bedroom Detached House",
    location: "Ikoyi, Lagos",
    price: 250000000,
    type: "House",
    beds: 5,
    baths: 5,
    size: 450,
    image:
      "https://images.unsplash.com/photo-1702014860012-e0139aae6f69?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isFeatured: false,
    isPremium: true,
    agent: {
      name: "Emeka Okafor",
      phone: "+234 802 567 8901",
      email: "emeka@realestate.ng",
      photo: "https://randomuser.me/api/portraits/men/22.jpg",
      isVerified: true,
    },
    description:
      "Exclusive detached house in highbrow Ikoyi neighborhood with panoramic views and luxury finishes throughout.",
    features: [
      "Panoramic Views",
      "Home Theater",
      "Swimming Pool",
      "Smart Home",
      "Generator",
    ],
  },
  {
    id: 4,
    title: "2 Bedroom Flat",
    location: "Surulere, Lagos",
    price: 35000000,
    type: "Flat",
    beds: 2,
    baths: 2,
    size: 90,
    image:
      "https://images.unsplash.com/photo-1724862873281-238213626373?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isFeatured: false,
    isPremium: false,
    agent: {
      name: "Folake Adeleke",
      phone: "+234 815 678 9012",
      email: "folake@realestate.ng",
      photo: "https://randomuser.me/api/portraits/women/33.jpg",
      isVerified: false,
    },
    description:
      "Affordable 2 bedroom flat in central Surulere location, close to amenities and transport links.",
    features: [
      "24/7 Security",
      "Parking",
      "Water Supply",
      "Close to Amenities",
    ],
  },
  {
    id: 5,
    title: "3 Bedroom Terrace",
    location: "GRA, Ibadan",
    price: 45000000,
    type: "Terrace",
    beds: 3,
    baths: 3,
    size: 150,
    image:
      "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isFeatured: true,
    isPremium: false,
    agent: {
      name: "Yusuf Bello",
      phone: "+234 807 789 0123",
      email: "yusuf@realestate.ng",
      photo: "https://randomuser.me/api/portraits/men/55.jpg",
      isVerified: true,
    },
    description:
      "Well-maintained terrace house in Government Reserved Area (GRA) Ibadan with ample outdoor space.",
    features: [
      "Ample Outdoor Space",
      "Security",
      "Quiet Neighborhood",
      "Parking",
    ],
  },
  {
    id: 6,
    title: "4 Bedroom Semi-Detached",
    location: "Wuse 2, Abuja",
    price: 85000000,
    type: "House",
    beds: 4,
    baths: 4,
    size: 280,
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isFeatured: false,
    isPremium: true,
    agent: {
      name: "Amina Mohammed",
      phone: "+234 809 890 1234",
      email: "amina@realestate.ng",
      photo: "https://randomuser.me/api/portraits/women/66.jpg",
      isVerified: true,
    },
    description:
      "Elegant semi-detached house in prime Wuse 2 location with modern amenities and security.",
    features: [
      "Modern Amenities",
      "Security",
      "Generator",
      "Parking",
      "Garden",
    ],
  },
];

// Generate multiple property images for slideshow
interface PropertyImageGenerator {
    (property: Property): string[];
}

const generatePropertyImages: PropertyImageGenerator = (property) => {
    const imageUrls: string[] = [
        property.image,
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=500&q=80",
        "https://images.unsplash.com/photo-1600607687644-c7f34b5620af?w=500&q=80",
        "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=500&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80",
        "https://images.unsplash.com/photo-1600607688066-19933ffd9a368?w=500&q=80",
        "https://images.unsplash.com/photo-1600607688066-a2e18714d1b2?w=500&q=80",
    ];
    return imageUrls;
};

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
  isFeatured: boolean;
  isPremium: boolean;
  agent: {
    name: string;
    phone: string;
    email: string;
    photo: string;
    isVerified: boolean;
  };
  description: string;
  features: string[];
}

interface Filters {
    priceRange: [number, number];
    type: string;
    beds: string;
    location: string;
  }
  

const PropertyCard = ({ property }: { property: Property }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const propertyImages = generatePropertyImages(property);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === propertyImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? propertyImages.length - 1 : prevIndex - 1
    );
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
      >
        {property.isPremium && (
          <Tag
            position="absolute"
            top={3}
            left={3}
            bg="#724B9B"
            color="white"
            fontWeight="bold"
            size="sm"
            zIndex={1}
          >
            Premium
          </Tag>
        )}

        <Box position="relative" h="240px">
          <Image
            src={property.image}
            alt={property.title}
            w="100%"
            h="100%"
            objectFit="cover"
          />

          <Flex
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            opacity={isHovered ? 1 : 0}
            transition="opacity 0.3s"
            justifyContent="center"
            alignItems="center"
            gap={4}
          >
            <Button
              size="sm"
              colorScheme="whiteAlpha"
              leftIcon={<Icon as={ViewIcon} />}
              borderRadius="full"
              onClick={onOpen}
            >
              View details
            </Button>
          </Flex>
        </Box>

        <Box p={5}>
          <HStack justifyContent="space-between" mb={2}>
            <Text color="#724B9B" fontWeight="bold" fontSize="xl">
              ₦{property.price.toLocaleString("en-NG")}
            </Text>
            {property.isFeatured && (
              <HStack color="orange.400">
                <StarIcon />
                <Text fontSize="sm" fontWeight="medium">
                  Featured
                </Text>
              </HStack>
            )}
          </HStack>

          <Heading as="h3" size="md" mb={2} noOfLines={1}>
            {property.title}
          </Heading>

          <HStack mb={4} color="gray.600">
            <Icon as={FaMapMarkerAlt} />
            <Text fontSize="sm" noOfLines={1}>
              {property.location}
            </Text>
          </HStack>

          <Flex
            justify="space-between"
            borderTop="1px"
            borderColor="gray.100"
            pt={3}
          >
            <HStack>
              <Icon as={FaBed} color="gray.600" />
              <Text fontSize="sm">
                {property.beds} {property.beds > 1 ? "Beds" : "Bed"}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaBath} color="gray.600" />
              <Text fontSize="sm">
                {property.baths} {property.baths > 1 ? "Baths" : "Bath"}
              </Text>
            </HStack>
        
          </Flex>
        </Box>
      </Box>

      {/* Property Details Modal with Image Slideshow */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">{property.title}</Heading>
            <Text color="gray.600" fontSize="sm">
              {property.location}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Image Slideshow */}
            <Box position="relative" borderRadius="md" overflow="hidden" h="300px" mb={6}>
              <Image
                src={propertyImages[currentImageIndex]}
                alt=""
                w="100%"
                h="100%"
                objectFit="cover"
              />
              
              {/* Navigation Arrows */}
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
                  colorScheme="whiteAlpha"
                  onClick={prevImage}
                />
                <IconButton
                  aria-label="Next image"
                  icon={<ChevronRightIcon boxSize={8} />}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  onClick={nextImage}
                />
              </Flex>
              
              {/* Image Counter */}
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
            </Box>

            <Flex justify="space-between" mb={6}>
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="#724B9B">
                  ₦{property.price.toLocaleString("en-NG")}
                </Text>
                <Text color="gray.600">Rental Price</Text>
              </Box>

              <Flex gap={4}>
                <Box textAlign="center">
                  <Text fontWeight="bold">{property.beds}</Text>
                  <Text color="gray.600">Bedrooms</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontWeight="bold">{property.baths}</Text>
                  <Text color="gray.600">Bathrooms</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontWeight="bold">{property.size} m²</Text>
                  <Text color="gray.600">Area</Text>
                </Box>
              </Flex>
            </Flex>

            <Box mb={6}>
              <Heading size="md" mb={3}>
                Description
              </Heading>
              <Text>{property.description}</Text>
            </Box>

            <Box mb={6}>
              <Heading size="md" mb={3}>
                Features
              </Heading>
              <SimpleGrid columns={2} spacing={2}>
                {property.features.map((feature, i) => (
                  <HStack key={i}>
                    <Icon as={FaCheck} color="green.500" />
                    <Text>{feature}</Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>

            <Box bg="gray.50" p={4} borderRadius="md">
              <Heading size="md" mb={3}>
                Contact Agent
              </Heading>
              <Flex align="center" mb={4}>
                <Avatar
                  src={property.agent.photo}
                  name={property.agent.name}
                  mr={3}
                  size="lg"
                >
                  {property.agent.isVerified && (
                    <AvatarBadge boxSize="1.25em" bg="green.500" />
                  )}
                </Avatar>
                <Box>
                  <Text fontWeight="bold">{property.agent.name}</Text>
                  <Text color="gray.600">The Agent Ng</Text>
                </Box>
              </Flex>

              <Box>
                <Button leftIcon={<FaWhatsapp />} colorScheme="purple">
                  {property.agent.phone}
                </Button>
             
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const PropertiesForSalePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500000000]);
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState<Filters>({
    priceRange: [50000000, 500000000],
    type: "",
    beds: "",
    location: ""
  });
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const propertyTypes = ['Penthouse', 'Duplex', 'Terrace', 'Estate Home', 'Bungalow'];
  const bedroomOptions = ['Any', '2+', '3+', '4+', '5+'];
  const locationOptions = ['Lekki', 'Ikoyi', 'Victoria Island', 'Abuja', 'Port Harcourt'];

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice =
      property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesType = propertyType === "" || property.type === propertyType;
    const matchesBeds = bedrooms === "" || property.beds === parseInt(bedrooms);
    const matchesLocation =
      location === "" || property.location.includes(location);

    return (
      matchesSearch &&
      matchesPrice &&
      matchesType &&
      matchesBeds &&
      matchesLocation
    );
  });
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Box>
      <Navbar />
      <Box
        pb="60px"
        bgGradient="linear(to-r, purple.700, purple.500)" pt={['40%',"15%"]} color="white" h={'60vh'}
      >
        <Container maxW="1200px" py={6}  >
          <VStack spacing={6} textAlign="center">
            <HStack>
              <Icon as={TbHomeSearch} boxSize={10} />
              <Heading as="h1" size="2xl">
                Properties To Let
              </Heading>
            </HStack>
            <Text fontSize="xl">
              Find your dream home from our selection of premium properties
              across Nigeria's best locations
            </Text>

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


      
            {/* Filter Section - Now at the top like in blog page */}
            <Box py={8} bg="white" borderBottom="1px" borderColor="gray.200">
              <Container maxW="container.xl">
                <HStack mb={4}>
                  <Icon as={FiFilter} color="purple.600" />
                  <Heading size="md" color="purple.700">Refine Search</Heading>
                </HStack>
                
                <Flex direction={{ base: "column", md: "row" }} gap={6} flexWrap="wrap" alignItems={'center'}>
                  {/* Price Range */}
              
      
                  {/* Property Type */}
                  <Box flex="1" minW={{ base: "100%", md: "180px" }}>
                    <Text fontWeight="600" mb={2}>Property Type</Text>
                    <Select
                      placeholder="All Types"
                      value={filters.type}
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
                    >
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Select>
                  </Box>
      
                  {/* Bedrooms */}
                  <Box flex="1" minW={{ base: "100%", md: "150px" }}>
                    <Text fontWeight="600" mb={2}>Bedrooms</Text>
                    <Select
                      placeholder="Any"
                      value={filters.beds}
                      onChange={(e) => setFilters({...filters, beds: e.target.value})}
                    >
                      {['2', '3', '4', '5'].map((num) => (
                        <option key={num} value={num}>{num}+</option>
                      ))}
                    </Select>
                  </Box>
      
                  {/* Location */}
                  <Box flex="1" minW={{ base: "100%", md: "180px" }}>
                    <Text fontWeight="600" mb={2}>Location</Text>
                    <Select
                      placeholder="All Areas"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    >
                      {locationOptions.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </Select>
                  </Box>
                  <Box flex="1" minW={{ base: "100%", md: "220px" }}>
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
                  
                  {/* Reset Button */}
                  <Box alignSelf="flex-end" mb={{ base: 0, md: 2 }}>
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
                      Reset
                    </Button>
                  </Box>
                </Flex>
              </Container>
            </Box>

      {/* Main Content */}
      <Box py={10} bg={bgColor}>
        <Container maxW="1200px">
          <Box mb={6}>
            <Flex justify="space-between" align="center">
              <Text fontWeight="medium">
                {filteredProperties.length} Properties Found
              </Text>
              <Select w="200px" size="sm">
                <option value="newest">Newest First</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </Select>
            </Flex>
          </Box>

          {filteredProperties.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </SimpleGrid>
          ) : (
            <Box
              bg="white"
              p={10}
              borderRadius="lg"
              shadow="md"
              textAlign="center"
            >
              <Heading as="h3" size="md" mb={4}>
                No Properties Found
              </Heading>
              <Text color="gray.600">
                Try adjusting your search criteria or filters to see more
                results.
              </Text>
            </Box>
          )}

          {/* Pagination */}
          {filteredProperties.length > 0 && (
            <HStack justify="center" mt={10} spacing={2}>
              <Button size="sm" colorScheme="purple">
                1
              </Button>
              <Button size="sm" variant="outline">
                2
              </Button>
              <Button size="sm" variant="outline">
                3
              </Button>
              <Button size="sm" variant="ghost">
                ...
              </Button>
              <Button size="sm" variant="outline">
                8
              </Button>
            </HStack>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default PropertiesForSalePage;