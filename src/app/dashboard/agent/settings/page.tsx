// @ts-nocheck
'use client'
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Checkbox,
  CheckboxGroup,
  Stack,
  Text,
  Wrap,
  WrapItem,
  Badge,
  Icon,
  Select,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { nigerianStates } from '@/utils/nigerian-states';
import { FiX } from 'react-icons/fi';
import { color } from 'framer-motion';
import { colors } from '@/utils/color';

const SettingsPage = () => {
  const toast = useToast();
  const accentColor = colors.primary;

  const [formData, setFormData] = useState({
    username: '',
    whatsapp_no: '',
    state: '',
    cities: [] as string[],
  });

  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setIsFetching(false);
        return;
      }

      setUserId(user.id);

      try {
        const { data, error } = await supabase
          .from('users')
          .select('username, whatsapp_no, state, cities')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        type UserData = {
          username?: string;
          whatsapp_no?: string;
          state?: string;
          cities?: string[];
        };

        const userData = data as UserData;

        setFormData({
          username: userData.username || '',
          whatsapp_no: userData.whatsapp_no || '',
          state: userData.state || '',
          cities: userData.cities || [],
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error loading settings',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, [toast]);

  useEffect(() => {
    if (formData.state) {
      const state = nigerianStates.find((s) => s.name === formData.state);
      setCities(state?.cities || []);
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (values: string[]) => {
    if (values.length <= 3) {
      setFormData(prev => ({ ...prev, cities: values }));
    } else {
      toast({
        title: 'Maximum 3 cities allowed',
        status: 'warning',
        duration: 3000,
      });
    }
  };

  const removeCity = (cityToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      cities: prev.cities.filter(city => city !== cityToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('users')
        .update({
          username: formData.username,
          whatsapp_no: formData.whatsapp_no,
          state: formData.state,
          cities: formData.cities,
        })
        .eq('id', userId);

      if (error) throw error;



      toast({
        title: 'Settings updated successfully',
        status: 'success',
        duration: 3000,
      });

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Error updating settings',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Box minH="100vh" bg="gray.50" pt="80px">
        <Container maxW="container.md" py={10}>
          <Text textAlign="center">Loading...</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" pt="80px">
      <Container maxW="container.md" py={10}>
        <Card shadow="lg" borderRadius="xl">
          <CardHeader bg={accentColor} color="white" borderTopRadius="xl">
            <Heading size="md">Account Settings</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                <FormControl isRequired>
                  <FormLabel>Username / Business Name</FormLabel>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    size="lg"
                    borderRadius="xl"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <Input
                    name="whatsapp_no"
                    value={formData.whatsapp_no}
                    onChange={handleChange}
                    size="lg"
                    borderRadius="xl"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>State</FormLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  size="lg"
                  borderRadius="xl"
                >
                  <option value="">Select state</option>
                  {nigerianStates.map((state) => (
                    <option key={state.name} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Cities (Select up to 3)</FormLabel>

                {formData.cities.length > 0 && (
                  <Wrap spacing={2} mb={3}>
                    {formData.cities.map((city) => (
                      <WrapItem key={city}>
                        <Badge
                          colorScheme="purple"
                          fontSize="sm"
                          px={3}
                          py={1}
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          gap={2}
                        >
                          {city}
                          <Icon
                            as={FiX}
                            cursor="pointer"
                            onClick={() => removeCity(city)}
                            _hover={{ color: 'red.500' }}
                          />
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}

                <CheckboxGroup value={formData.cities} onChange={handleCityChange}>
                  <Stack
                    spacing={3}
                    maxH="300px"
                    overflowY="auto"
                    p={4}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    bg={!formData.state ? 'gray.50' : 'white'}
                  >
                    {!formData.state ? (
                      <Text color="gray.500" textAlign="center" py={4}>
                        Please select a state first
                      </Text>
                    ) : cities.length === 0 ? (
                      <Text color="gray.500" textAlign="center" py={4}>
                        No cities available
                      </Text>
                    ) : (
                      cities.map((city) => (
                        <Checkbox
                          key={city}
                          value={city}
                          colorScheme="purple"
                          isDisabled={
                            !formData.cities.includes(city) && formData.cities.length >= 3
                          }
                        >
                          {city}
                        </Checkbox>
                      ))
                    )}
                  </Stack>
                </CheckboxGroup>

                <Text fontSize="xs" color="gray.500" mt={2}>
                  {formData.cities.length}/3 cities selected
                </Text>
              </FormControl>

              <Button
                w="full"
                bg={accentColor}
                color="white"
                size="lg"
                borderRadius="xl"
                onClick={handleSubmit}
                isLoading={isLoading}
                _hover={{ bg: 'purple.600' }}
              >
                Save Changes
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default SettingsPage;