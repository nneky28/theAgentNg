// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Button,
  Badge,
  useToast,
  Spinner,
  Text,
  Flex,
  IconButton,
  HStack,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { createClient } from "@/utils/supabase/client";
import { Property } from "@/types";
import { PropertyFilters } from "@/components/admin/PropertyFilters";
import { PropertyCard } from "@/components/admin/PropertyCard";
import { PropertyTable } from "@/components/admin/PropertyTable";
import { PropertyDetailsModal } from "@/components/admin/PropertyDetailsModal";
import ConfirmDialog from "@/components/ConfirmDialog";


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
          is_published: !isFeatured ? true : undefined, // If setting as featured, also publish
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

      <PropertyFilters
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        filter={filter}
        onFilterChange={(value) => setFilter(value as "all" | "featured" | "published" | "draft")}
      />

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
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={() => handleViewDetails(property)}
                onTogglePublish={() => handleTogglePublish(property.id, property.is_published || false)}
                onToggleFeatured={() => handleToggleFeatured(property.id, property.is_featured || false)}
                onDelete={() => handleDelete(property)}
              />
            );
          })}
        </VStack>
      ) : (
        // Desktop Table View
        <PropertyTable
          properties={currentProperties}
          onViewDetails={handleViewDetails}
          onTogglePublish={(id, isPublished) => handleTogglePublish(id, isPublished)}
          onToggleFeatured={(id, isFeatured) => handleToggleFeatured(id, isFeatured)}
          onDelete={handleDelete}
        />
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
      <PropertyDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
      />

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
