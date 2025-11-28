// import {
//   Box,
//   Button,
//   Flex,
//   HStack,
//   Icon,
//   RangeSlider,
//   RangeSliderFilledTrack,
//   RangeSliderThumb,
//   RangeSliderTrack,
//   Select,
//   Text,
//   Heading,
//   Container,
//   FormControl,
// } from "@chakra-ui/react";
// import { FiFilter } from "react-icons/fi";
// import { nigerianStates, getCities } from "@/utils/nigerian-states";
// import { useEffect, useState, Dispatch, SetStateAction } from "react";
// import { RepeatIcon } from "@chakra-ui/icons";


// interface Filters {
//   priceRange: [number, number];
//   type: string;
//   beds: string;
//   state: string;
//   city: string;
//   searchTerm: string;
//   location: string;
// }

// interface PropertyFilterProps {
//   filters: Filters;
//   setFilters: Dispatch<SetStateAction<Filters>>;
//   propertyTypes: string[];
//   showCity?: boolean;
//   onReset?: () => void; 
// }



// const PropertyFilter = ({
//   filters,
//   setFilters,
//   showCity = true,
//   onReset,
// }: PropertyFilterProps) => {
//   const [cities, setCities] = useState<string[]>([]);

//   useEffect(() => {
//     if (filters.state) {
//       setCities(getCities(filters.state));
//     } else {
//       setCities([]);
//     }
//   }, [filters.state]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
// const { name, value } = e.target;
// setFilters({ ...filters, [name]: value });
//   };


//   const handleReset = () => {
//     if (onReset) {
//       onReset(); // Use external reset if provided
//     } else {
//       setFilters({
//         priceRange: [0, 500000000], 
//         type: "",
//         beds: "",
//         state: "",
//         city: "",
//         searchTerm: "",
//         location: "",
//       });
//     }
//   };

//   return (
//     <Box py={8} bg="white" borderBottom="1px" borderColor="gray.200">
//       <Container maxW="container.xl">
//         <HStack mb={4}>
//           <Icon as={FiFilter} color="purple.600" />
//           <Heading size="md" color="purple.700">
//             Refine Search
//           </Heading>
//         </HStack>
//         <Flex
//           direction={{ base: "column", md: "row" }}
//           gap={6}
//           flexWrap="wrap"
//           alignItems={"center"}
//         >
         
//           <Box flex="1" minW={{ base: "100%", md: "180px" }}>
//             <Text fontWeight="600" mb={2}>
//               Property Type
//             </Text>
//              <FormControl isRequired>
//                 {/* <FormLabel mt={4}>Type of Property</FormLabel> */}
//                 <Select
//                   name="propertyType"
//                   // value={formData.propertyType}
//                   onChange={handleChange}
//                   placeholder="Select property type"
//                   _focus={{ border: "none", boxShadow: "md" }}
//                   bg='white'
//                 >
//                   <option value="1 Bedroom">Self Contain</option>
//                   <option value="1 Bedroom">1 Bedroom</option>
//                   <option value="2 Bedroom">2 Bedroom</option>
//                   <option value="3 Bedroom">3 Bedroom</option>
//                   <option value="4 Bedroom">4 Bedroom</option>
//                   <option value="5 Bedroom">5 Bedroom</option>
//                   <option value="6 Bedroom">6 Bedroom</option>
//                   <option value="Full Building">Full Building</option>
//                   <option value="Warehouse">Warehouse</option>
//                   <option value="Shop / Store">Shop / Store</option>
//                   <option value="Event Hall / Space">Event Hall / Space</option>
//                   <option value="Land">Land</option>
//                 </Select>
//               </FormControl> 
//           </Box>
//           {/* State */}
//           <Box flex="1" minW={{ base: "100%", md: "180px" }}>
//             <Text fontWeight="600" mb={2}>
//               State
//             </Text>
//             <Select
//               name="state"
//               value={filters.state}
//               onChange={handleChange}
//               placeholder="Select state"
//               _focus={{ border: "none", boxShadow: "md" }}
//             >
//               {nigerianStates.map((state) => (
//                 <option key={state.name} value={state.name}>
//                   {state.name}
//                 </option>
//               ))}
//             </Select>
//           </Box>
//           {/* City */}
//           {showCity && (
//             <Box flex="1" minW={{ base: "100%", md: "150px" }}>
//               <Text fontWeight="600" mb={2}>
//                 City
//               </Text>
//               <Select
//                 name="city"
//                 placeholder="Select City"
//                 disabled={!filters.state}
//                 value={filters.city}
//                 onChange={handleChange}
//               >
//                 {cities.map((city) => (
//                   <option key={city} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </Select>
//             </Box>
//           )}
//           {/* Price Range */}
//           <Box flex="1" minW={{ base: "100%", md: "220px" }}>
//             <Text fontWeight="600" mb={2}>
//               Price Range (₦)
//             </Text>
//             <RangeSlider
//               min={0}
//               max={500000000}
//               step={10000000}
//               value={filters.priceRange}
//               onChange={(val: [number, number]) =>
//                 setFilters({ ...filters, priceRange: val })
//               }
//               colorScheme="purple"
//             >
//               <RangeSliderTrack>
//                 <RangeSliderFilledTrack />
//               </RangeSliderTrack>
//               <RangeSliderThumb index={0} />
//               <RangeSliderThumb index={1} />
//             </RangeSlider>
//             <Flex justify="space-between" mt={2}>
//               <Text fontSize="sm">
//                 ₦{filters.priceRange[0].toLocaleString()}
//               </Text>
//               <Text fontSize="sm">
//                 ₦{filters.priceRange[1].toLocaleString()}
//               </Text>
//             </Flex>
//           </Box>
//           {/* Reset Button */}
//           <Box alignSelf="flex-end" mb={{ base: 0, md: 2 }}>
//             <Button
//               leftIcon={<RepeatIcon />}
//               variant="outline"
//               colorScheme="purple"
//               onClick={handleReset}
//             >
//               Reset
//             </Button>
//           </Box>
//         </Flex>
//       </Container>
//     </Box>
//   );
// };

// export default PropertyFilter;



import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Text,
  Heading,
  Container,
  FormControl,
  VStack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import { nigerianStates, getCities } from "@/utils/nigerian-states";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { RepeatIcon, CloseIcon } from "@chakra-ui/icons";

interface Filters {
  priceRange: [number, number];
  type: string;
  beds: string;
  state: string;
  city: string;
  searchTerm: string;
  location: string;
}

interface PropertyFilterProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  propertyTypes: string[];
  showCity?: boolean;
  onReset?: () => void;
}

const PropertyFilter = ({
  filters,
  setFilters,
  showCity = true,
  onReset,
}: PropertyFilterProps) => {
  const [cities, setCities] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (filters.state) {
      setCities(getCities(filters.state));
    } else {
      setCities([]);
    }
  }, [filters.state]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      setFilters({
        priceRange: [0, 500000000],
        type: "",
        beds: "",
        state: "",
        city: "",
        searchTerm: "",
        location: "",
      });
    }
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type) count++;
    if (filters.state) count++;
    if (filters.city) count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500000000) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Desktop filters
  const DesktopFilters = () => (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={6}
      flexWrap="wrap"
      alignItems={"center"}
    >
      {/* Property Type */}
      <Box flex="1" minW={{ base: "100%", md: "180px" }}>
        <Text fontWeight="600" mb={2} fontSize="sm" color="gray.700">
          Property Type
        </Text>
        <FormControl>
          <Select
            name="propertyType"
            onChange={handleChange}
            placeholder="Select type"
            _focus={{ border: "none", boxShadow: "md" }}
            bg="white"
            size="md"
          >
            <option value="Self Contain">Self Contain</option>
            <option value="1 Bedroom">1 Bedroom</option>
            <option value="2 Bedroom">2 Bedroom</option>
            <option value="3 Bedroom">3 Bedroom</option>
            <option value="4 Bedroom">4 Bedroom</option>
            <option value="5 Bedroom">5 Bedroom</option>
            <option value="6 Bedroom">6 Bedroom</option>
            <option value="Full Building">Full Building</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Shop / Store">Shop / Store</option>
            <option value="Event Hall / Space">Event Hall / Space</option>
            <option value="Land">Land</option>
          </Select>
        </FormControl>
      </Box>

      {/* State */}
      <Box flex="1" minW={{ base: "100%", md: "180px" }}>
        <Text fontWeight="600" mb={2} fontSize="sm" color="gray.700">
          State
        </Text>
        <Select
          name="state"
          value={filters.state}
          onChange={handleChange}
          placeholder="Select state"
          _focus={{ border: "none", boxShadow: "md" }}
          size="md"
        >
          {nigerianStates.map((state) => (
            <option key={state.name} value={state.name}>
              {state.name}
            </option>
          ))}
        </Select>
      </Box>

      {/* City */}
      {showCity && (
        <Box flex="1" minW={{ base: "100%", md: "150px" }}>
          <Text fontWeight="600" mb={2} fontSize="sm" color="gray.700">
            City
          </Text>
          <Select
            name="city"
            placeholder="Select City"
            disabled={!filters.state}
            value={filters.city}
            onChange={handleChange}
            size="md"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </Box>
      )}

      {/* Price Range */}
      <Box flex="1" minW={{ base: "100%", md: "220px" }}>
        <Text fontWeight="600" mb={2} fontSize="sm" color="gray.700">
          Price Range (₦)
        </Text>
        <RangeSlider
          min={0}
          max={500000000}
          step={10000000}
          value={filters.priceRange}
          onChange={(val: [number, number]) =>
            setFilters({ ...filters, priceRange: val })
          }
          colorScheme="purple"
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Flex justify="space-between" mt={2}>
          <Text fontSize="xs" color="gray.600">
            ₦{filters.priceRange[0].toLocaleString()}
          </Text>
          <Text fontSize="xs" color="gray.600">
            ₦{filters.priceRange[1].toLocaleString()}
          </Text>
        </Flex>
      </Box>

      {/* Reset Button */}
      <Box alignSelf="flex-end" mb={{ base: 0, md: 2 }}>
        <Button
          leftIcon={<RepeatIcon />}
          variant="outline"
          colorScheme="purple"
          onClick={handleReset}
          size="md"
        >
          Reset
        </Button>
      </Box>
    </Flex>
  );

  // Mobile Filter Drawer Content
  const FilterDrawerContent = () => (
    <VStack spacing={6} align="stretch">
      {/* Property Type */}
      <Box>
        <Text fontWeight="600" mb={3} fontSize="md" color="gray.700">
          Property Type
        </Text>
        <Select
          name="propertyType"
          onChange={handleChange}
          placeholder="Select type"
          size="lg"
          borderRadius="lg"
        >
          <option value="Self Contain">Self Contain</option>
          <option value="1 Bedroom">1 Bedroom</option>
          <option value="2 Bedroom">2 Bedroom</option>
          <option value="3 Bedroom">3 Bedroom</option>
          <option value="4 Bedroom">4 Bedroom</option>
          <option value="5 Bedroom">5 Bedroom</option>
          <option value="6 Bedroom">6 Bedroom</option>
          <option value="Full Building">Full Building</option>
          <option value="Warehouse">Warehouse</option>
          <option value="Shop / Store">Shop / Store</option>
          <option value="Event Hall / Space">Event Hall / Space</option>
          <option value="Land">Land</option>
        </Select>
      </Box>

      {/* State */}
      <Box>
        <Text fontWeight="600" mb={3} fontSize="md" color="gray.700">
          State
        </Text>
        <Select
          name="state"
          value={filters.state}
          onChange={handleChange}
          placeholder="Select state"
          size="lg"
          borderRadius="lg"
        >
          {nigerianStates.map((state) => (
            <option key={state.name} value={state.name}>
              {state.name}
            </option>
          ))}
        </Select>
      </Box>

      {/* City */}
      {showCity && (
        <Box>
          <Text fontWeight="600" mb={3} fontSize="md" color="gray.700">
            City
          </Text>
          <Select
            name="city"
            placeholder="Select city"
            disabled={!filters.state}
            value={filters.city}
            onChange={handleChange}
            size="lg"
            borderRadius="lg"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </Box>
      )}

      {/* Price Range */}
      <Box>
        <Text fontWeight="600" mb={3} fontSize="md" color="gray.700">
          Price Range
        </Text>
        <Box px={2} py={4}>
          <RangeSlider
            min={0}
            max={500000000}
            step={10000000}
            value={filters.priceRange}
            onChange={(val: [number, number]) =>
              setFilters({ ...filters, priceRange: val })
            }
            colorScheme="purple"
          >
            <RangeSliderTrack h="6px">
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} boxSize={6} />
            <RangeSliderThumb index={1} boxSize={6} />
          </RangeSlider>
        </Box>
        <Flex justify="space-between" mt={3}>
          <Box>
            <Text fontSize="xs" color="gray.500">
              Min
            </Text>
            <Text fontSize="md" fontWeight="600" color="gray.700">
              ₦{filters.priceRange[0].toLocaleString()}
            </Text>
          </Box>
          <Box textAlign="right">
            <Text fontSize="xs" color="gray.500">
              Max
            </Text>
            <Text fontSize="md" fontWeight="600" color="gray.700">
              ₦{filters.priceRange[1].toLocaleString()}
            </Text>
          </Box>
        </Flex>
      </Box>
    </VStack>
  );

  return (
    <>
      {/* Desktop View */}
      <Box
        py={8}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        display={{ base: "none", md: "block" }}
      >
        <Container maxW="container.xl">
          <HStack mb={4}>
            <Icon as={FiFilter} color="purple.600" />
            <Heading size="md" color="purple.700">
              Refine Search
            </Heading>
          </HStack>
          <DesktopFilters />
        </Container>
      </Box>

      {/* Mobile View - Filter Button */}
      <Box
        py={4}
        px={4}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        display={{ base: "block", md: "none" }}
        position="sticky"
        top="0"
        zIndex="10"
      >
        <HStack justify="space-between">
          <HStack>
            <Icon as={FiFilter} color="purple.600" boxSize={5} />
            <Heading size="sm" color="purple.700">
              Filters
            </Heading>
            {activeFiltersCount > 0 && (
              <Badge colorScheme="purple" borderRadius="full" px={2}>
                {activeFiltersCount}
              </Badge>
            )}
          </HStack>
          <HStack spacing={2}>
            {activeFiltersCount > 0 && (
              <IconButton
                aria-label="Clear filters"
                icon={<CloseIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={handleReset}
              />
            )}
            <Button
              leftIcon={<FiFilter />}
              colorScheme="purple"
              onClick={onOpen}
              size="md"
              borderRadius="lg"
            >
              {activeFiltersCount > 0 ? "Edit" : "Filter"}
            </Button>
          </HStack>
        </HStack>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <HStack mt={3} spacing={2} flexWrap="wrap">
            {filters.type && (
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                {filters.type}
              </Badge>
            )}
            {filters.state && (
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                {filters.state}
              </Badge>
            )}
            {filters.city && (
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                {filters.city}
              </Badge>
            )}
            {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500000000) && (
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                ₦{filters.priceRange[0].toLocaleString()} - ₦
                {filters.priceRange[1].toLocaleString()}
              </Badge>
            )}
          </HStack>
        )}
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent borderTopRadius="2xl">
          <DrawerCloseButton size="lg" />
          <DrawerHeader borderBottomWidth="1px">
            <HStack>
              <Icon as={FiFilter} color="purple.600" boxSize={6} />
              <Text>Filter Properties</Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody py={6}>
            <FilterDrawerContent />
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px" gap={3}>
            <Button
              variant="outline"
              colorScheme="purple"
              onClick={handleReset}
              flex={1}
              size="lg"
            >
              Reset
            </Button>
            <Button
              colorScheme="purple"
              onClick={onClose}
              flex={1}
              size="lg"
            >
              Apply Filters
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PropertyFilter;