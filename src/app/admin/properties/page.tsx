// // @ts-nocheck
// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Container,
//   Heading,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Button,
//   Badge,
//   useToast,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   Spinner,
//   Text,
//   Flex,
//   Input,
//   Select,
//   IconButton,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   VStack,
//   HStack,
//   Divider,
//   SimpleGrid,
//   Image,
// } from "@chakra-ui/react";
// import {
//   DeleteIcon,
//   ViewIcon,
//   StarIcon,
//   ChevronDownIcon,
//   CheckIcon,
//   CloseIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from "@chakra-ui/icons";
// import { Property } from "@/types";
// import { createClient } from "@/utils/supabase/client";
// import { formatPrice } from "@/utils/Method";

// const AdminPropertiesPage = () => {
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<"all" | "featured" | "published" | "draft">("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 20;
  
//   const toast = useToast();

//   useEffect(() => {
//     fetchProperties();
//   }, [filter]);

//   const fetchProperties = async () => {
//     const supabase = createClient();
//     setLoading(true);
//     try {
//       let query = supabase.from("properties").select("*");

//       if (filter === "featured") {
//         query = query.eq("is_featured", true);
//       } else if (filter === "published") {
//         query = query.eq("is_published", true);
//       } else if (filter === "draft") {
//         query = query.eq("is_published", false);
//       }

//       const { data, error } = await query.order("created_at", {
//         ascending: false,
//       });

//       if (error) throw error;
//       setProperties(data || []);
//       setCurrentPage(1); // Reset to first page when filter changes
//     } catch (error: any) {
//       toast({
//         title: "Error fetching properties",
//         description: error.message,
//         status: "error",
//         duration: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDetails = (property: Property) => {
//     setSelectedProperty(property);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this property?")) return;

//     const supabase = createClient();
//     try {
//       const { error } = await supabase.from("properties").delete().eq("id", id);

//       if (error) throw error;

//       toast({
//         title: "Property deleted",
//         status: "success",
//         duration: 3000,
//       });
//       fetchProperties();
//     } catch (error: any) {
//       toast({
//         title: "Error deleting property",
//         description: error.message,
//         status: "error",
//         duration: 3000,
//       });
//     }
//   };

//   const handleTogglePublish = async (id: string, isPublished: boolean) => {
//     const supabase = createClient();
//     try {
//       const { error } = await supabase
//         .from("properties")
//         .update({ 
//           is_published: !isPublished,
//           published_at: !isPublished ? new Date().toISOString() : null,
//         })
//         .eq("id", id);

//       if (error) throw error;

//       toast({
//         title: isPublished ? "Property unpublished" : "Property published",
//         status: "success",
//         duration: 3000,
//       });
//       fetchProperties();
//     } catch (error: any) {
//       toast({
//         title: "Error updating property",
//         description: error.message,
//         status: "error",
//         duration: 3000,
//       });
//     }
//   };

//   const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
//     const supabase = createClient();
//     try {
//       const { error } = await supabase
//         .from("properties")
//         .update({
//           is_featured: !isFeatured,
//           featured_at: !isFeatured ? new Date().toISOString() : null,
//         })
//         .eq("id", id);

//       if (error) throw error;

//       toast({
//         title: isFeatured
//           ? "Removed from featured"
//           : "Added to featured carousel",
//         status: "success",
//         duration: 3000,
//       });
//       fetchProperties();
//     } catch (error: any) {
//       toast({
//         title: "Error updating property",
//         description: error.message,
//         status: "error",
//         duration: 3000,
//       });
//     }
//   };

//   // Filter properties by search term
//   const filteredProperties = properties.filter((property) =>
//     property.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentProperties = filteredProperties.slice(startIndex, endIndex);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   if (loading) {
//     return (
//       <Flex justify="center" align="center" minH="60vh">
//         <Spinner size="xl" color="purple.500" />
//       </Flex>
//     );
//   }

//   return (
//     <Container maxW="container.xl" py={8}>
//       <Heading mb={6}>Admin - Manage Properties</Heading>

//       <Flex gap={4} mb={6} direction={{ base: "column", md: "row" }}>
//         <Input
//           placeholder="Search properties..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1); // Reset to first page on search
//           }}
//           maxW={{ md: "400px" }}
//         />
//         <Select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value as any)}
//           maxW={{ md: "200px" }}
//         >
//           <option value="all">All Properties</option>
//           <option value="published">Published</option>
//           <option value="draft">Drafts</option>
//           <option value="featured">Featured Only</option>
//         </Select>
//       </Flex>

  

//       {filteredProperties.length === 0 ? (
//         <Text textAlign="center" py={8} color="gray.500">
//           No properties found
//         </Text>
//       ) : (
//         <>
//           <Box 
//             overflowX="auto"
//             bg="white"
//             borderRadius="xl"
//             boxShadow="sm"
//             borderWidth="1px"
//             borderColor="gray.200"
//             p={6}
//           >
//             <Table variant="simple">
//               <Thead>
//                 <Tr>
//                   <Th>Date</Th>
//                   <Th>Title</Th>
//                   <Th>Location</Th>
//                   <Th>Price</Th>
//                   <Th>Category</Th>
//                   <Th>Status</Th>
//                   <Th>Actions</Th>
//                 </Tr>
//               </Thead>
//               <Tbody>
//                 {currentProperties.map((property) => {
//                   if (!property || !property.id) return null;

//                   return (
//                     <Tr key={property.id}>
//                       <Td color="gray.600" fontSize="sm">
//                         {new Date(property.created_at).toLocaleDateString()}
//                       </Td>
//                       <Td>
//                         <Text noOfLines={1} fontSize="sm">{property.title || 'Untitled'}</Text>
//                       </Td>
//                       <Td fontSize="sm">
//                         {property?.city && property?.state 
//                           ? `${property.city}, ${property.state}`
//                           : property?.city || property?.state || 'N/A'}
//                       </Td>
//                       <Td fontWeight="semibold" fontSize="sm">
//                         {formatPrice(property.price)}
//                       </Td>
//                       <Td>
//                         <Text fontSize="sm" color="gray.600">
//                           {property.category || 'N/A'}
//                         </Text>
//                       </Td>
//                       <Td>
//                         {property.is_featured ? (
//                           <Badge colorScheme="yellow" fontSize="xs">⭐ Featured</Badge>
//                         ) : property.is_published ? (
//                           <Badge colorScheme="green" fontSize="xs">
//                             <CheckIcon boxSize={2} mr={1} /> Published
//                           </Badge>
//                         ) : (
//                           <Badge colorScheme="gray" fontSize="xs">
//                             <CloseIcon boxSize={2} mr={1} /> Draft
//                           </Badge>
//                         )}
//                       </Td>
//                       <Td>
//                         <Menu>
//                           <MenuButton
//                             as={IconButton}
//                             icon={<ChevronDownIcon />}
//                             size="sm"
//                             colorScheme="purple"
//                             aria-label="Actions"
//                           />
//                           <MenuList>
//                             <MenuItem 
//                               icon={<ViewIcon />}
//                               onClick={() => handleViewDetails(property)}
//                             >
//                               View Details
//                             </MenuItem>
//                             <MenuItem
//                               icon={property.is_published ? <CloseIcon /> : <CheckIcon />}
//                               onClick={() =>
//                                 handleTogglePublish(
//                                   property.id,
//                                   property.is_published || false
//                                 )
//                               }
//                             >
//                               {property.is_published ? "Unpublish" : "Publish"}
//                             </MenuItem>
//                             <MenuItem
//                               icon={<StarIcon />}
//                               onClick={() =>
//                                 handleToggleFeatured(
//                                   property.id,
//                                   property.is_featured || false
//                                 )
//                               }
//                             >
//                               {property.is_featured ? "Remove Featured" : "Mark as Featured"}
//                             </MenuItem>
//                             <MenuItem
//                               icon={<DeleteIcon />}
//                               color="red.500"
//                               onClick={() => handleDelete(property.id)}
//                             >
//                               Delete
//                             </MenuItem>
//                           </MenuList>
//                         </Menu>
//                       </Td>
//                     </Tr>
//                   );
//                 })}
//               </Tbody>
//             </Table>
//           </Box>
//     {/* Results count */}
//       <Text fontSize="sm" color="gray.600" mt={4} textAlign={'right'}>
//         Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
//       </Text>
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <Flex justify="space-between" align="center" mt={6}>
//               <Text fontSize="sm" color="gray.600">
//                 Page {currentPage} of {totalPages}
//               </Text>
              
//               <HStack spacing={2}>
//                 <IconButton
//                   icon={<ChevronLeftIcon />}
//                   aria-label="Previous page"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   isDisabled={currentPage === 1}
//                 />
                
//                 {/* Page numbers */}
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let pageNum;
//                   if (totalPages <= 5) {
//                     pageNum = i + 1;
//                   } else if (currentPage <= 3) {
//                     pageNum = i + 1;
//                   } else if (currentPage >= totalPages - 2) {
//                     pageNum = totalPages - 4 + i;
//                   } else {
//                     pageNum = currentPage - 2 + i;
//                   }
                  
//                   return (
//                     <Button
//                       key={pageNum}
//                       size="sm"
//                       onClick={() => handlePageChange(pageNum)}
//                       colorScheme={currentPage === pageNum ? "purple" : "gray"}
//                       variant={currentPage === pageNum ? "solid" : "ghost"}
//                     >
//                       {pageNum}
//                     </Button>
//                   );
//                 })}
                
//                 <IconButton
//                   icon={<ChevronRightIcon />}
//                   aria-label="Next page"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   isDisabled={currentPage === totalPages}
//                 />
//               </HStack>
//             </Flex>
//           )}
//         </>
//       )}

//       {/* View Details Modal */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="4xl">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Property Details</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             {selectedProperty && (
//               <VStack spacing={6} align="stretch">
//                 {/* Images */}
//                 {selectedProperty.images && selectedProperty.images.length > 0 && (
//                   <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
//                     {selectedProperty.images.slice(0, 4).map((img, idx) => (
//                       <Image
//                         key={idx}
//                         src={img}
//                         alt={`Property ${idx + 1}`}
//                         borderRadius="md"
//                         objectFit="cover"
//                         h="200px"
//                         w="full"
//                       />
//                     ))}
//                   </SimpleGrid>
//                 )}

//                 {/* Basic Info */}
//                 <Box>
//                   <Heading size="md" mb={4}>{selectedProperty.title}</Heading>
//                   <HStack spacing={4} mb={4} flexWrap="wrap">
//                     <Badge colorScheme="purple" fontSize="lg" px={3} py={1}>
//                       {formatPrice(selectedProperty.price)}
//                     </Badge>
//                     <Badge colorScheme="blue">
//                       {selectedProperty.category}
//                     </Badge>
//                     {selectedProperty.is_featured && (
//                       <Badge colorScheme="yellow">⭐ Featured</Badge>
//                     )}
//                     <Badge colorScheme={selectedProperty.is_published ? "green" : "gray"}>
//                       {selectedProperty.is_published ? "Published" : "Draft"}
//                     </Badge>
//                   </HStack>
//                 </Box>

//                 <Divider />

//                 {/* Details Grid */}
//                 <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
//                   <Box>
//                     <Text fontSize="sm" color="gray.600" mb={1}>Location</Text>
//                     <Text fontWeight="600">
//                       {selectedProperty.city && selectedProperty.state
//                         ? `${selectedProperty.city}, ${selectedProperty.state}`
//                         : selectedProperty.city || selectedProperty.state || "Not set"}
//                     </Text>
//                   </Box>

//                   <Box>
//                     <Text fontSize="sm" color="gray.600" mb={1}>Property Type</Text>
//                     <Text fontWeight="600">{selectedProperty.type || "Not set"}</Text>
//                   </Box>

//                   {selectedProperty.bedrooms && (
//                     <Box>
//                       <Text fontSize="sm" color="gray.600" mb={1}>Bedrooms</Text>
//                       <Text fontWeight="600">{selectedProperty.bedrooms}</Text>
//                     </Box>
//                   )}

//                   {selectedProperty.bathrooms && (
//                     <Box>
//                       <Text fontSize="sm" color="gray.600" mb={1}>Bathrooms</Text>
//                       <Text fontWeight="600">{selectedProperty.bathrooms}</Text>
//                     </Box>
//                   )}

//                   {selectedProperty.size && (
//                     <Box>
//                       <Text fontSize="sm" color="gray.600" mb={1}>Size</Text>
//                       <Text fontWeight="600">{selectedProperty.size}</Text>
//                     </Box>
//                   )}

//                   <Box>
//                     <Text fontSize="sm" color="gray.600" mb={1}>Date Added</Text>
//                     <Text fontWeight="600">
//                       {new Date(selectedProperty.created_at).toLocaleDateString()}
//                     </Text>
//                   </Box>
//                 </SimpleGrid>

//                 {/* Description */}
//                 {selectedProperty.description && (
//                   <>
//                     <Divider />
//                     <Box>
//                       <Text fontSize="sm" color="gray.600" mb={2}>Description</Text>
//                       <Text>{selectedProperty.description}</Text>
//                     </Box>
//                   </>
//                 )}

//                 {/* Features */}
//                 {selectedProperty.features && selectedProperty.features.length > 0 && (
//                   <>
//                     <Divider />
//                     <Box>
//                       <Text fontSize="sm" color="gray.600" mb={2}>Features</Text>
//                       <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
//                         {selectedProperty.features.map((feature, idx) => (
//                           <Text key={idx}>• {feature}</Text>
//                         ))}
//                       </SimpleGrid>
//                     </Box>
//                   </>
//                 )}
//               </VStack>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Container>
//   );
// };

// export default AdminPropertiesPage;



// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Text,
  Flex,
  Input,
  Select,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Divider,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  ViewIcon,
  StarIcon,
  ChevronDownIcon,
  CheckIcon,
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Property } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { formatPrice } from "@/utils/Method";

const AdminPropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "featured" | "published" | "draft">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const toast = useToast();

  useEffect(() => {
    fetchProperties();
    setupRealtimeSubscription();
  }, [filter]);

  const setupRealtimeSubscription = () => {
    const supabase = createClient();
    
    const channel = supabase
      .channel('properties_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
        },
        (payload) => {
          console.log('Property change detected:', payload);
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchProperties = async () => {
    const supabase = createClient();
    setLoading(true);
    try {
      let query = supabase.from("properties").select("*");

      if (filter === "featured") {
        query = query.eq("is_featured", true);
      } else if (filter === "published") {
        query = query.eq("is_published", true);
      } else if (filter === "draft") {
        query = query.eq("is_published", false);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setProperties(data || []);
      setCurrentPage(1); // Reset to first page when filter changes
    } catch (error: any) {
      toast({
        title: "Error fetching properties",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    const supabase = createClient();
    try {
      // Get property details before deleting
      const { data: property } = await supabase
        .from("properties")
        .select("title, owner_id, owner_email")
        .eq("id", id)
        .single();

      // Delete the property
      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) throw error;

      // Send notification to agent
      if (property && property.owner_id) {
        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            agent_id: property.owner_id,
            title: "Property Deleted 🗑️",
            message: `Your property "${property.title}" has been removed from the platform by the admin.`,
            type: "property_deleted",
            request_data: {
              property_id: id,
              property_title: property.title,
              action: "deleted",
              timestamp: new Date().toISOString(),
            },
            is_read: false,
            created_at: new Date().toISOString(),
          });

        if (notifError) {
          console.error("Error sending notification:", notifError);
        }
      }

      toast({
        title: "Property deleted",
        description: "Agent has been notified",
        status: "success",
        duration: 3000,
      });
      fetchProperties();
    } catch (error: any) {
      toast({
        title: "Error deleting property",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    const supabase = createClient();
    try {
      // Get property details before updating
      const { data: property } = await supabase
        .from("properties")
        .select("title, owner_id, owner_email")
        .eq("id", id)
        .single();

      // Update property status
      const { error } = await supabase
        .from("properties")
        .update({ 
          is_published: !isPublished,
          published_at: !isPublished ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;

      // Send notification to agent
      if (property && property.owner_id) {
        const notificationTitle = !isPublished 
          ? "Property Published ✅" 
          : "Property Unpublished";
        
        const notificationMessage = !isPublished
          ? `Your property "${property.title}" has been published and is now live on the platform!`
          : `Your property "${property.title}" has been unpublished and is no longer visible to the public.`;

        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            agent_id: property.owner_id,
            title: notificationTitle,
            message: notificationMessage,
            type: "property_status",
            request_data: {
              property_id: id,
              property_title: property.title,
              action: !isPublished ? "published" : "unpublished",
              timestamp: new Date().toISOString(),
            },
            is_read: false,
            created_at: new Date().toISOString(),
          });

        if (notifError) {
          console.error("Error sending notification:", notifError);
        }
      }

      toast({
        title: isPublished ? "Property unpublished" : "Property published",
        description: "Agent has been notified",
        status: "success",
        duration: 3000,
      });
      fetchProperties();
    } catch (error: any) {
      toast({
        title: "Error updating property",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    const supabase = createClient();
    try {
      // Get property details before updating
      const { data: property } = await supabase
        .from("properties")
        .select("title, owner_id, owner_email")
        .eq("id", id)
        .single();

      // Update featured status
      const { error } = await supabase
        .from("properties")
        .update({
          is_featured: !isFeatured,
          featured_at: !isFeatured ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;

      // Send notification to agent
      if (property && property.owner_id) {
        const notificationTitle = !isFeatured 
          ? "Property Featured ⭐" 
          : "Property Removed from Featured";
        
        const notificationMessage = !isFeatured
          ? `Congratulations! Your property "${property.title}" has been featured on the homepage carousel. This will give it more visibility!`
          : `Your property "${property.title}" has been removed from the featured carousel.`;

        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            agent_id: property.owner_id,
            title: notificationTitle,
            message: notificationMessage,
            type: "property_featured",
            request_data: {
              property_id: id,
              property_title: property.title,
              action: !isFeatured ? "featured" : "unfeatured",
              timestamp: new Date().toISOString(),
            },
            is_read: false,
            created_at: new Date().toISOString(),
          });

        if (notifError) {
          console.error("Error sending notification:", notifError);
        }
      }

      toast({
        title: isFeatured
          ? "Removed from featured"
          : "Added to featured carousel",
        description: "Agent has been notified",
        status: "success",
        duration: 3000,
      });
      fetchProperties();
    } catch (error: any) {
      toast({
        title: "Error updating property",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  // Filter properties by search term
  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Admin - Manage Properties</Heading>

      <Flex gap={4} mb={6} direction={{ base: "column", md: "row" }}>
        <Input
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          maxW={{ md: "400px" }}
        />
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          maxW={{ md: "200px" }}
        >
          <option value="all">All Properties</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="featured">Featured Only</option>
        </Select>
      </Flex>

      {/* Results count */}
      <Text fontSize="sm" color="gray.600" mb={4}>
        Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
      </Text>

      {filteredProperties.length === 0 ? (
        <Text textAlign="center" py={8} color="gray.500">
          No properties found
        </Text>
      ) : (
        <>
          <Box 
            overflowX="auto"
            bg="white"
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.200"
            p={6}
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Title</Th>
                  <Th>Location</Th>
                  <Th>Price</Th>
                  <Th>Category</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentProperties.map((property) => {
                  if (!property || !property.id) return null;

                  return (
                    <Tr key={property.id}>
                      <Td color="gray.600" fontSize="sm">
                        {new Date(property.created_at).toLocaleDateString()}
                      </Td>
                      <Td>
                        <Text noOfLines={1} fontSize="sm">{property.title || 'Untitled'}</Text>
                      </Td>
                      <Td fontSize="sm">
                        {property?.city && property?.state 
                          ? `${property.city}, ${property.state}`
                          : property?.city || property?.state || 'N/A'}
                      </Td>
                      <Td fontWeight="semibold" fontSize="sm">
                        {formatPrice(property.price)}
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {property.category || 'N/A'}
                        </Text>
                      </Td>
                      <Td>
                        {property.is_featured ? (
                          <Badge colorScheme="yellow" fontSize="xs">⭐ Featured</Badge>
                        ) : property.is_published ? (
                          <Badge colorScheme="green" fontSize="xs">
                            <CheckIcon boxSize={2} mr={1} /> Published
                          </Badge>
                        ) : (
                          <Badge colorScheme="gray" fontSize="xs">
                            <CloseIcon boxSize={2} mr={1} /> Draft
                          </Badge>
                        )}
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<ChevronDownIcon />}
                            size="sm"
                            colorScheme="purple"
                            aria-label="Actions"
                          />
                          <MenuList>
                            <MenuItem 
                              icon={<ViewIcon />}
                              onClick={() => handleViewDetails(property)}
                            >
                              View Details
                            </MenuItem>
                            <MenuItem
                              icon={property.is_published ? <CloseIcon /> : <CheckIcon />}
                              onClick={() =>
                                handleTogglePublish(
                                  property.id,
                                  property.is_published || false
                                )
                              }
                            >
                              {property.is_published ? "Unpublish" : "Publish"}
                            </MenuItem>
                            <MenuItem
                              icon={<StarIcon />}
                              onClick={() =>
                                handleToggleFeatured(
                                  property.id,
                                  property.is_featured || false
                                )
                              }
                            >
                              {property.is_featured ? "Remove Featured" : "Mark as Featured"}
                            </MenuItem>
                            <MenuItem
                              icon={<DeleteIcon />}
                              color="red.500"
                              onClick={() => handleDelete(property.id)}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Flex justify="space-between" align="center" mt={6}>
              <Text fontSize="sm" color="gray.600">
                Page {currentPage} of {totalPages}
              </Text>
              
              <HStack spacing={2}>
                <IconButton
                  icon={<ChevronLeftIcon />}
                  aria-label="Previous page"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1}
                />
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      colorScheme={currentPage === pageNum ? "purple" : "gray"}
                      variant={currentPage === pageNum ? "solid" : "ghost"}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <IconButton
                  icon={<ChevronRightIcon />}
                  aria-label="Next page"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages}
                />
              </HStack>
            </Flex>
          )}
        </>
      )}

      {/* View Details Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Property Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedProperty && (
              <VStack spacing={6} align="stretch">
                {/* Images */}
                {selectedProperty.images && selectedProperty.images.length > 0 && (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {selectedProperty.images.slice(0, 4).map((img, idx) => (
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
                  <Heading size="md" mb={4}>{selectedProperty.title}</Heading>
                  <HStack spacing={4} mb={4} flexWrap="wrap">
                    <Badge colorScheme="purple" fontSize="lg" px={3} py={1}>
                      {formatPrice(selectedProperty.price)}
                    </Badge>
                    <Badge colorScheme="blue">
                      {selectedProperty.category}
                    </Badge>
                    {selectedProperty.is_featured && (
                      <Badge colorScheme="yellow">⭐ Featured</Badge>
                    )}
                    <Badge colorScheme={selectedProperty.is_published ? "green" : "gray"}>
                      {selectedProperty.is_published ? "Published" : "Draft"}
                    </Badge>
                  </HStack>
                </Box>

                <Divider />

                {/* Details Grid */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>Location</Text>
                    <Text fontWeight="600">
                      {selectedProperty.city && selectedProperty.state
                        ? `${selectedProperty.city}, ${selectedProperty.state}`
                        : selectedProperty.city || selectedProperty.state || "Not set"}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>Property Type</Text>
                    <Text fontWeight="600">{selectedProperty.type || "Not set"}</Text>
                  </Box>

                  {selectedProperty.bedrooms && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>Bedrooms</Text>
                      <Text fontWeight="600">{selectedProperty.bedrooms}</Text>
                    </Box>
                  )}

                  {selectedProperty.bathrooms && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>Bathrooms</Text>
                      <Text fontWeight="600">{selectedProperty.bathrooms}</Text>
                    </Box>
                  )}

                  {selectedProperty.size && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>Size</Text>
                      <Text fontWeight="600">{selectedProperty.size}</Text>
                    </Box>
                  )}

                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>Date Added</Text>
                    <Text fontWeight="600">
                      {new Date(selectedProperty.created_at).toLocaleDateString()}
                    </Text>
                  </Box>
                </SimpleGrid>

                {/* Description */}
                {selectedProperty.description && (
                  <>
                    <Divider />
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={2}>Description</Text>
                      <Text>{selectedProperty.description}</Text>
                    </Box>
                  </>
                )}

                {/* Features */}
                {selectedProperty.features && selectedProperty.features.length > 0 && (
                  <>
                    <Divider />
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={2}>Features</Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                        {selectedProperty.features.map((feature, idx) => (
                          <Text key={idx}>• {feature}</Text>
                        ))}
                      </SimpleGrid>
                    </Box>
                  </>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminPropertiesPage;