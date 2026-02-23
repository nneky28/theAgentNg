"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
} from "@chakra-ui/react";
import { SearchFormData } from "../types";
import { getCities, nigerianStates } from "@/utils/nigerian-states";
import { colors } from "@/utils/color";
import CustomSelectField from "./CustomSelect";
import { PROPERTY_TYPES } from "@/constants/propertyOptions";
import { useSearchForm } from "@/hooks/useSearchForm";

const SearchForm = React.memo(() => {
  const [formData, setFormData] = useState<SearchFormData>({
    state: "",
    city: "",
    area: "",
    property_type: "",
    purpose: "",
    min_budget: "",
    max_budget: "",
    name: "",
    whatsapp: "",
    email: "",
    category: "",
    capacity: "",
  });
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (formData.state) {
      setCities(getCities(formData.state));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { handleSubmit, isLoading } = useSearchForm({
    onSuccessMessage: 'Your request has been submitted successfully!',
    onErrorMessage: 'Something went wrong. Please try again.',
    onSuccess: () => {
      setFormData({
        state: "",
        city: "",
        area: "",
        property_type: "",
        purpose: "",
        min_budget: "",
        max_budget: "",
        name: "",
        whatsapp: "",
        email: "",
        category: "",
        capacity: "",
      });
      setCities([]);
    }
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    Object.entries(formData).forEach(([key, value]) => {
      // Check if hidden input already exists
      let input = form.querySelector(`input[name="${key}"][type="hidden"]`) as HTMLInputElement;
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        form.appendChild(input);
      }
      input.value = String(value || '');
    });
    handleSubmit(e);
  };
  


  return (
    <Box bg={colors.primary} py={12} id="search">
      <Container maxW="1300px">
        <VStack spacing={6} mb={8} textAlign="center" color='white'>
          <Heading as="h2" size="xl">
            Find the Perfect Place
          </Heading>
          <Text>
            Tell us what you&apos;re looking for and we&apos;ll connect you with the right
            agents.
          </Text>
        </VStack>

        <Box
          as="form"
          onSubmit={onSubmit}
          bg="purple.50"   
          p={8}
          borderRadius="lg"
          boxShadow="md"
        >
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={[1,1,8]}
            mb={8}
            justifyContent={"space-between"}
            flexDirection={{ base: "column", md: "row" }}
            w={"100%"}
          >
            <Box>
              <FormControl isRequired>
                <FormLabel mt={4} htmlFor="category" fontWeight={'bold'}>I AM LOOKING FOR...</FormLabel>
                <CustomSelectField
                  value={formData.category}
                  handleChange={(value: string | number) => {
                    setFormData(prev => ({ ...prev, category: String(value) }));
                  }}
                  data={[
                    { value: "Properties To Let", label: "Properties To Let" },
                    { value: "Properties For Sale", label: "Properties For Sale" },
                    { value: "Short Let Apartment", label: "Short Let Apartment" },
                    { value: "Event Hall", label: "Event Center" },
                  ]}
                  itemValueKey="value"
                  itemLabelKey="label"
                  placeholder="Select Category"
                  width="100%"
                />
              </FormControl>

              {formData.category !== "Event Hall" && (
                <FormControl isRequired>
                  <FormLabel mt={4}>Type of Property</FormLabel>
                  <CustomSelectField
                    value={formData.property_type}
                    handleChange={(value: string | number) => {
                      setFormData(prev => ({ ...prev, property_type: String(value) }));
                    }}
                    data={PROPERTY_TYPES}
                    itemValueKey="value"
                    itemLabelKey="label"
                    placeholder="Type of Property"
                    width="100%"
                  />
                </FormControl>
              )}

              {formData.category === 'Event Hall' ? (
                <FormControl isRequired>
                  <FormLabel mt={4}>Capacity</FormLabel>
                  <CustomSelectField
                    value={formData.capacity}
                    handleChange={(value: string | number) => {
                      setFormData(prev => ({ ...prev, capacity: String(value) }));
                    }}
                    data={[
                      { value: "0-50", label: "0-50" },
                      { value: "50-100", label: "50-100" },
                      { value: "100-200", label: "100-200" },
                      { value: "200-500", label: "200-500" },
                      { value: "500-1000", label: "500-1000" },
                      { value: "1000+", label: "1000+" },
                    ]}
                    itemValueKey="value"
                    itemLabelKey="label"
                    placeholder="Select capacity"
                    width="100%"
                  />
                </FormControl>
              ) : (
                <FormControl isRequired>
                  <FormLabel mt={4}>Purpose</FormLabel>
                  <CustomSelectField
                    value={formData.purpose}
                    handleChange={(value: string | number) => {
                      setFormData(prev => ({ ...prev, purpose: String(value) }));
                    }}
                    data={[
                      { value: "Residential", label: "Residential" },
                      { value: "Commercial", label: "Commercial" },
                    ]}
                    itemValueKey="value"
                    itemLabelKey="label"
                    placeholder="Select purpose"
                    width="100%"
                  />
                </FormControl>
              )}

              <FormControl isRequired>
                <FormLabel mt={4}>State</FormLabel>
                <CustomSelectField
                  value={formData.state}
                  handleChange={(value: string | number) => {
                    setFormData(prev => ({ ...prev, state: String(value) }));
                  }}
                  data={nigerianStates.map(state => ({
                    value: state.name,
                    label: state.name,
                  }))}
                  itemValueKey="value"
                  itemLabelKey="label"
                  placeholder="Select state"
                  width="100%"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>City</FormLabel>
                <CustomSelectField
                  value={formData.city}
                  handleChange={(value: string | number) => {
                    setFormData(prev => ({ ...prev, city: String(value) }));
                  }}
                  data={cities.map(city => ({
                    value: city,
                    label: city,
                  }))}
                  itemValueKey="value"
                  itemLabelKey="label"
                  placeholder="Select city"
                  width="100%"
                  disabled={!formData.state}
                />
              </FormControl>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="100%"
            >
              <FormControl>
                <FormLabel mt={[1,1,4]}>Area</FormLabel>
                <Input
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Neighborhood or specific area"
                  _focus={{ border: "none", boxShadow: "md" }}
                  bg='white'
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>Budget Range</FormLabel>
                <SimpleGrid columns={2} spacing={2}>
                  <Input
                    name="min_budget"
                    value={formData.min_budget}
                    onChange={handleChange}
                    placeholder="Min"
                    type="number"
                    bg='white'
                    _focus={{ border: "none", boxShadow: "md" }}
                  />
                  <Input
                    name="max_budget"
                    value={formData.max_budget}
                    onChange={handleChange}
                    placeholder="Max"
                    type="number"
                    bg='white'
                    _focus={{ border: "none", boxShadow: "md" }}
                  />
                </SimpleGrid>
              </FormControl>
   
              <FormControl isRequired>
                <FormLabel mt={4}>Full Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  _focus={{ border: "none", boxShadow: "md" }}
                  bg='white'
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>Email</FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="@mail.com"
                  type="email"
                  _focus={{ border: "none", boxShadow: "md" }}
                  bg='white'
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>WhatsApp Number</FormLabel>
                <Input
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="Whatsapp number"
                  type="tel"
                  _focus={{ border: "none", boxShadow: "md" }}
                  bg='white'
                />
              </FormControl>

              <Box flexGrow={1} />
              <Button
                type="submit"
                bg={colors.primary}
                size="lg"
                width="full"
                isLoading={isLoading}
                loadingText="Submitting"
                color={"white"}
                disabled={isLoading}
                display={"flex"}
                alignSelf="flex-end"
                mt={6}
                _hover={{ bg: colors.primary, opacity: 0.9 }}
              >
                Submit Search Request
              </Button>
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
});

SearchForm.displayName = 'SearchForm';

export default SearchForm;