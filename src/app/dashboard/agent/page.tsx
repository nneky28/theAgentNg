// @ts-nocheck
'use client'

import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Button,
  Flex,
  useColorModeValue,
  useDisclosure,
  SimpleGrid,
  useToast,
  Spinner,
  Center,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FiPlus, FiBell, FiHome, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { PropertyCard } from '@/components/dashboard/PropertyCard';
import { PropertyModal } from '@/components/dashboard/PropertyModal';
import { Pagination } from '@/components/dashboard/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { PropertyFormData } from '@/types/dashboard.types';
import { colors } from '@/utils/color';

const AgentDashboard = () => {
  const router = useRouter();
  const { isOpen: isPropertyOpen, onOpen: onPropertyOpen, onClose: onPropertyClose } = useDisclosure();
  const toast = useToast();
  
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  

  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = colors.primary;

  const propertyPagination = usePagination(properties, 4);

  // Auth check
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/');
        return;
      }

      // Get user profile
      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('username, email, is_onboarded, role')
        .eq('id', user.id)
        .single();

      if (dbError || !userData) {
        router.push('/');
        return;
      }

      // Check if admin trying to access agent dashboard
      if (userData.role === 'admin') {
        router.push('/admin/properties');
        return;
      }

      // Check if onboarded
      if (!userData.is_onboarded) {
        router.push('/auth/onboard');
        return;
      }

      setUserEmail(userData.email);
      setUserName(userData.username || userData.email);
      setIsCheckingAuth(false);
      
      // Fetch properties
      fetchProperties(userData.email);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/');
    }
  };

  const fetchProperties = async (email: string) => {
    const supabase = createClient();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_email', email)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error loading properties',
        description: 'Could not load your properties',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySubmit = useCallback(async (data: PropertyFormData) => {
    if (!userEmail) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a property",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const supabase = createClient();

    const property = {
      title: data.title,
      address: data.address,
      price: data.price,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      size: data.sqft?.toString(),
      type: data.propertyType,
      description: data.description,
      features: data.features,
      state: data.state,
      city: data.city,
      owner_email: userEmail,
      images: [],
      location: { city: data.city, state: data.state },
      condition: 'For Rent',
      is_featured: false,
      is_archived: false,
    };

    try {
      const { error } = await supabase
        .from('properties')
        .insert([property]);
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: "Property has been added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      await fetchProperties(userEmail);
      onPropertyClose();
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Error",
        description: "Failed to add property",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [userEmail, toast, onPropertyClose]);

  const handleEditProperty = async (property: any) => {
    const supabase = createClient();
    setLoading(true);

    try {
      console.log('Updating property with currency:', property.currency);
      const { error } = await supabase
        .from('properties')
        .update({
          state: property.state,
          city: property.city,
          price: property.price,
          currency: property.currency || 'NGN',
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          toilets: property.toilets,
          sqft: property.sqft,
          images: property.images,
          video_link: property.video_link,
          title: property.title,
          description: property.description,
        })
        .eq('id', property.id);

      if (error) throw error;

      toast({
        title: "Updated!",
        description: "Property has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      await fetchProperties(userEmail);
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewProperty = (property: any) => {
    // Navigate to property detail page or show detail modal
    router.push(`/property/${property.id}`);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    const supabase = createClient();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: "Deleted!",
        description: "Property has been deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      await fetchProperties(userEmail);
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color={accentColor} thickness="4px" />
          <Text>Loading dashboard...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box minH="100vh" >

      <Box bg={accentColor} color="white" py={8} borderRadius="16px">
        <DashboardHeader 
          userName={userName}
          userImage={undefined}
        />
        
        <Container maxW="container.xl">
          <StatsGrid />
        </Container>
      </Box>

      <Container maxW="container.2xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Text 
            fontSize="md" 
            lineHeight="1.8" 
            color="gray.700"
            textAlign="center"
            maxW="800px"
            mx="auto"
          >
            The Agent Ng is a real estate platform designed to connect Property Seekers 
            directly with Real Estate Agents in their location of interest.
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mt={6}>
              <Box 
              p={8} 
              bg="white"
              borderRadius="2xl"
              border="1px"
              borderColor="purple.100"
              shadow="md"
              transition="all 0.3s"
              _hover={{ 
                transform: 'translateY(-4px)', 
                shadow: 'xl',
                borderColor: accentColor 
              }}
            >
              <Flex align="center" mb={4}>
                <Icon 
                  as={FiHome} 
                  boxSize={7} 
                  color={accentColor}
                  mr={3}
                />
                <Heading as="h3" size="md" color={accentColor}>
                  Share Your Properties
                </Heading>
              </Flex>
              <Text 
                fontSize="sm" 
                color="gray.700" 
                lineHeight="1.8"
              >
                Showcase your properties on our platform by clicking &quot;Add Property&quot; 
                and submitting the required details. Reach thousands of potential clients 
                actively searching for properties.
              </Text>
            </Box>
            <Box 
              p={8} 
              bg="white"
              borderRadius="2xl"
              border="1px"
              borderColor="purple.100"
              shadow="md"
              transition="all 0.3s"
              _hover={{ 
                transform: 'translateY(-4px)', 
                shadow: 'xl',
                borderColor: accentColor 
              }}
            >
              <Flex align="center" mb={4}>
                <Icon 
                  as={FiBell} 
                  boxSize={7} 
                  color={accentColor}
                  mr={3}
                />
                <Heading as="h3" size="md" color={accentColor}>
                  Get Notifications
                </Heading>
              </Flex>
              <Text 
                fontSize="sm" 
                color="gray.700" 
                lineHeight="1.8"
              >
                Be notified instantly when a user submits a Search Request for a property 
                in your location, along with their contact information. You can then reach 
                out and close the deal.
              </Text>
            </Box>
            
        
          </SimpleGrid>
          
          <Box textAlign="center" mt={4}>
            <Text 
              fontSize="sm" 
              color="gray.600"
              fontStyle="italic"
            >
              💡 Need help getting started? Check out our{' '}
              <Text 
                as="span" 
                color={accentColor}
                fontWeight="semibold"
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
              >
                FAQs page
              </Text>
              {' '}for more information.
            </Text>
          </Box>
        </VStack>
      </Container>

      <Container maxW="container.2xl" py={8} id='properties'>
        <Card bg={cardBg} shadow="lg" borderRadius="xl">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="md" color={accentColor}>My Properties ({properties.length})</Heading>
              <Button 
                leftIcon={<FiPlus />} 
                bg={accentColor} 
                color="white" 
                size="sm"
                _hover={{ bg: 'purple.600' }}
                onClick={onPropertyOpen}
              >
                Add New
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Center py={10}>
                <Spinner size="lg" color={accentColor} />
              </Center>
            ) : properties.length === 0 ? (
              <Center py={10}>
                <Box textAlign="center">
                  <Text fontSize="lg" color="gray.500" mb={4}>
                    No properties yet
                  </Text>
                  <Button
                    leftIcon={<FiPlus />}
                    bg={accentColor}
                    color="white"
                    onClick={onPropertyOpen}
                    _hover={{ bg: 'purple.600' }}
                  >
                    Add Your First Property
                  </Button>
                </Box>
              </Center>
            ) : (
              <>
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                  {propertyPagination.paginatedData.map((property) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property}
                      onEdit={handleEditProperty}
                      onView={handleViewProperty}
                      onDelete={handleDeleteProperty}
                      actions={
                        <Flex gap={2}>
                          <Button
                            size="sm"
                            variant="ghost"
                            colorScheme="purple"
                            leftIcon={<FiEdit />}
                            onClick={() => handleEditProperty(property)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            leftIcon={<FiTrash2 />}
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            Delete
                          </Button>
                        </Flex>
                      }
                    />
                  ))}
                </SimpleGrid>
                
                {properties.length > propertyPagination.itemsPerPage && (
                  <Pagination
                    currentPage={propertyPagination.currentPage}
                    totalPages={propertyPagination.totalPages}
                    onPageChange={propertyPagination.goToPage}
                  />
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Container>

      <PropertyModal
        isOpen={isPropertyOpen}
        onClose={onPropertyClose}
        onSubmit={handlePropertySubmit}
      />
    </Box>
  );
};

export default AgentDashboard;