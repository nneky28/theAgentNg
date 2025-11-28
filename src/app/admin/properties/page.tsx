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
  Stack,
  useBreakpointValue,
  Icon,
  useDisclosure,
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
  useBreakPointValue,
} from "@chakra-ui/icons";
import { createClient } from "@/utils/supabase/client";
import ConfirmDialog from "@/components/ConfirmDialog";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

const AdminPropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "featured" | "published" | "draft"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchProperties();
  }, [filter]);

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

  const handleDelete = (property: Property) => {
    setPropertyToDelete(property);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async (id: string | undefined) => {
    if (!id) {
      toast({
        title: "Error deleting property",
        description: "Invalid property ID.",
        status: "error",
        duration: 3000,
      });
      setIsDeleting(false);
      setConfirmOpen(false);
      return;
    }

    setIsDeleting(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Property deleted",
        status: "success",
        duration: 3000,
      });
      fetchProperties();
    } catch (error: unknown) {
      toast({
        title: "Error deleting property",
        description: error instanceof Error ? error.message : "Failed to delete property",
        status: "error",
        duration: 3000,
      });
    }
    setIsDeleting(false);
    setConfirmOpen(false);
    setPropertyToDelete(null);
  };  

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("properties")
        .update({
          is_published: !isPublished,
          published_at: !isPublished ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: isPublished ? "Property unpublished" : "Property published",
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
      const { error } = await supabase
        .from("properties")
        .update({
          is_featured: !isFeatured,
          featured_at: !isFeatured ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: isFeatured
          ? "Removed from featured"
          : "Added to featured carousel",
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8} px={{ base: 4, md: 6 }}>
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        flexDir={{ base: "column", sm: "row" }}
        gap={4}
      >
        <Heading size={{ base: "md", md: "lg" }}>
          Admin - Manage Properties
        </Heading>
        <Badge
          colorScheme="purple"
          fontSize={{ base: "sm", md: "md" }}
          px={3}
          py={1}
        >
          {properties.length} Properties
        </Badge>
      </Flex>

      <Flex gap={4} mb={6} direction={{ base: "column", md: "row" }}>
        <Input
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          maxW={{ md: "400px" }}
          size={{ base: "md", md: "lg" }}
        />
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          maxW={{ md: "200px" }}
          size={{ base: "md", md: "lg" }}
        >
          <option value="all">All Properties</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="featured">Featured Only</option>
        </Select>
      </Flex>

      {filteredProperties.length === 0 ? (
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="gray.200"
          p={12}
        >
          <Text textAlign="center" color="gray.500" fontSize="lg">
            {searchTerm
              ? "No properties match your search"
              : "No properties found"}
          </Text>
        </Box>
      ) : isMobile ? (
        // Mobile Card View
        <VStack spacing={4} align="stretch">
          {currentProperties.map((property) => {
            if (!property || !property.id) return null;

            return (
              <Box
                key={property.id}
                bg="white"
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
                borderColor="gray.200"
                overflow="hidden"
                _hover={{ boxShadow: "md" }}
                transition="all 0.2s"
              >
                {/* Property Image */}
                {property.images && property.images.length > 0 && (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    h="180px"
                    w="full"
                    objectFit="cover"
                  />
                )}

                <Box p={4}>
                  <VStack align="stretch" spacing={3}>
                    {/* Title and Status */}
                    <Box>
                      <Text fontWeight="600" fontSize="md" noOfLines={2}>
                        {property.title}
                      </Text>
                      <Text fontSize={"sm"} mb={2}>
                        {property.city && property.state
                          ? `${property.city}, ${property.state}`
                          : property.city || property.state || "N/A"}
                      </Text>
                      <HStack spacing={2} flexWrap="wrap">
                        <Badge
                          bg={
                            property.category === "Properties To Let"
                              ? "green.100"
                              : property.category === "Properties For Sale"
                              ? "orange.100"
                              : "blue.100"
                          }
                          fontSize="xs"
                        >
                          {property.category === "Properties To Let"
                            ? "To Let"
                            : property.category === "Properties For Sale"
                            ? "For Sale"
                            : "Short Let"}
                        </Badge>
                        {property.is_featured && (
                          <Badge colorScheme="yellow" fontSize="xs">
                            ⭐ Featured
                          </Badge>
                        )}
                        {!property.is_featured && (
                          <Badge
                            colorScheme={
                              property.is_published ? "green" : "gray"
                            }
                            fontSize="xs"
                          >
                            {property.is_published ? "Published" : "Draft"}
                          </Badge>
                        )}
                      </HStack>
                    </Box>

                    <Divider />

                    {/* Property Details */}
                    <Stack spacing={2} fontSize="sm">
                      <HStack justify="space-between">
                     
                        <Text fontWeight="600" color="purple.600">
                          {formatPrice(property.price)}
                        </Text>
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
                            icon={
                              property.is_published ? (
                                <CloseIcon />
                              ) : (
                                <CheckIcon />
                              )
                            }
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
                            {property.is_featured
                              ? "Remove Featured"
                              : "Mark as Featured"}
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
                      </HStack>
                    </Stack>

                    <Divider />
                  </VStack>
                </Box>
              </Box>
            );
          })}
        </VStack>
      ) : (
        // Desktop Table View
        <Box
          overflowX="auto"
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Category</Th>
                <Th>Title</Th>
                <Th>Location</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentProperties.map((property) => {
                if (!property || !property.id) return null;

                return (
                  <Tr key={property.id} _hover={{ bg: "gray.50" }}>
                    <Td>
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
                    </Td>
                    <Td>
                      <Text noOfLines={1} fontSize="sm">
                        {property.title || "Untitled"}
                      </Text>
                    </Td>
                    <Td fontSize="sm">
                      {property?.city && property?.state
                        ? `${property.city}, ${property.state}`
                        : property?.city || property?.state || "N/A"}
                    </Td>
                    <Td fontWeight="semibold" fontSize="sm">
                      {formatPrice(property.price)}
                    </Td>
                    <Td>
                      {property.is_featured ? (
                        <Badge colorScheme="yellow" fontSize="xs">
                          ⭐ Featured
                        </Badge>
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
                    <Td color="gray.600" fontSize="sm">
                      {new Date(property.created_at).toLocaleDateString()}
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
                            icon={
                              property.is_published ? (
                                <CloseIcon />
                              ) : (
                                <CheckIcon />
                              )
                            }
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
                            {property.is_featured
                              ? "Remove Featured"
                              : "Mark as Featured"}
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
      )}

      {/* Results count */}
      <Text fontSize="sm" color="gray.600" mt={4} textAlign="right">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)}{" "}
        of {filteredProperties.length} properties
      </Text>

      {/* Pagination */}
      {totalPages > 1 && (
        <Flex
          justify="space-between"
          align="center"
          mt={6}
          direction={{ base: "column", sm: "row" }}
          gap={4}
        >
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
                  display={{
                    base: currentPage === pageNum ? "inline-flex" : "none",
                    sm: "inline-flex",
                  }}
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

      {/* View Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size={{ base: "full", md: "4xl" }}
      >
        <ModalOverlay />
        <ModalContent m={{ base: 0, md: 4 }}>
          <ModalHeader>Property Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedProperty && (
              <VStack spacing={6} align="stretch">
                {/* Images */}
                {selectedProperty.images &&
                  selectedProperty.images.length > 0 && (
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
                  <Heading size="md" mb={4}>
                    {selectedProperty.title}
                  </Heading>
                  <Text fontSize={"sm"}>
                    {selectedProperty.city && selectedProperty.state
                      ? `${selectedProperty.city}, ${selectedProperty.state}`
                      : selectedProperty.city || selectedProperty.state || ""}
                  </Text>
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
                    <Badge
                      colorScheme={
                        selectedProperty.is_published ? "green" : "gray"
                      }
                    >
                      {selectedProperty.is_published ? "Published" : "Draft"}
                    </Badge>
                  </HStack>
                </Box>

                <Divider />

                {/* Details Grid */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Location
                    </Text>
                    <Text fontWeight="600">
                      {selectedProperty.city && selectedProperty.state
                        ? `${selectedProperty.city}, ${selectedProperty.state}`
                        : selectedProperty.city ||
                          selectedProperty.state ||
                          ""}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Property Type
                    </Text>
                    <Text fontWeight="600">
                      {selectedProperty.type || "Not set"}
                    </Text>
                  </Box>

                  {selectedProperty.bedrooms && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Bedrooms
                      </Text>
                      <Text fontWeight="600">{selectedProperty.bedrooms}</Text>
                    </Box>
                  )}

                  {selectedProperty.bathrooms && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Bathrooms
                      </Text>
                      <Text fontWeight="600">{selectedProperty.bathrooms}</Text>
                    </Box>
                  )}

                  {selectedProperty.size && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Size
                      </Text>
                      <Text fontWeight="600">{selectedProperty.size}</Text>
                    </Box>
                  )}

                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Date Added
                    </Text>
                    <Text fontWeight="600">
                      {new Date(
                        selectedProperty.created_at
                      ).toLocaleDateString()}
                    </Text>
                  </Box>
                </SimpleGrid>

                {/* Description */}
                {selectedProperty.description && (
                  <>
                    <Divider />
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Description
                      </Text>
                      <Text>{selectedProperty.description}</Text>
                    </Box>
                  </>
                )}

                {/* Features */}
                {selectedProperty.features &&
                  selectedProperty.features.length > 0 && (
                    <>
                      <Divider />
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          Features
                        </Text>
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

    <ConfirmDialog
     isOpen={isConfirmOpen}
     onClose={() => setConfirmOpen(false)}
     onConfirm={() => handleConfirmDelete(propertyToDelete?.id)}
     title="Delete Property"
     description="Are you sure you want to delete this property? This action cannot be undone."
     confirmText="Delete"
     cancelText="Cancel"
     isLoading={isDeleting}
     />
    </Container>
  );
};

export default AdminPropertiesPage;
