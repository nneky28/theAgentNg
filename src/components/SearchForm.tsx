"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  VStack,
  Flex,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { SearchFormData } from "../types";
import { getCities, nigerianStates } from "@/utils/nigerian-states";
import { colors } from "@/utils/color";

const SearchForm = () => {
  const toast = useToast();
  const [formData, setFormData] = useState<SearchFormData>({
    state: "",
    city: "",
    area: "",
    propertyType: "",
    purpose: "",
    condition: "",
    minBudget: "",
    maxBudget: "",
    firstName: "",
    lastName: "",
    whatsapp: "",
    email: "",
  });
  const [cities, setCities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Request submitted successfully!",
          description:
            "We'll get back to you within a week with property matches.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Reset form
        setFormData({
          state: "",
          city: "",
          area: "",
          propertyType: "",
          purpose: "",
          condition: "",
          minBudget: "",
          maxBudget: "",
          firstName: "",
          lastName: "",
          whatsapp: "",
          email: "",
        });
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error: any) {
      toast({
        title: "Error submitting request",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="purple.50" py={12} id="search">
      <Container maxW="1300px">
        <VStack spacing={6} mb={8} textAlign="center">
          <Heading as="h2" size="xl">
            Submit a Search Request
          </Heading>
          <Text>
            Tell us what you're looking for and we'll connect you with the right
            agents.
          </Text>
        </VStack>

        <Box
          as="form"
          onSubmit={handleSubmit}
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="md"
        >
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={8}
            mb={8}
            justifyContent={"space-between"}
            flexDirection={{ base: "column", md: "row" }}
            w={"100%"}
          >
            <Box>
              <Heading as="h3" size="md" mb={6}>
                PROPERTY DETAILS
              </Heading>
              <FormControl isRequired>
                <RadioGroup
                  name="purpose"
                  value={formData.purpose}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, purpose: value }))
                  }
                >
                  <SimpleGrid columns={2}>
                    <Radio value="For Rent" colorScheme="purple">
                      I want to rent
                    </Radio>
                    <Radio value="For Sale" colorScheme="purple">
                      I want to buy
                    </Radio>
                  </SimpleGrid>
                </RadioGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>Type of Property</FormLabel>
                <Select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  placeholder="Select property type"
                  _focus={{ border: "none", boxShadow: "md" }}
                  
                >
                  <option value="1 Bedroom">1 Bedroom</option>
                  <option value="2 Bedroom">2 Bedroom</option>
                  <option value="3 Bedroom">3 Bedroom</option>
                  <option value="4 Bedroom">4 Bedroom</option>
                  <option value="5 Bedroom">5 Bedroom</option>
                  <option value="6 Bedroom">6 Bedroom</option>
                  <option value="Full Building">Full Building</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Shop / Store">Shop / Store</option>
                  <option value="Land">Land</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>Purpose</FormLabel>
                <Select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Select purpose"
                  _focus={{ border: "none", boxShadow: "md" }}
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>State</FormLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Select state"
                  _focus={{ border: "none", boxShadow: "md" }}
                >
                  {nigerianStates.map((state) => (
                    <option key={state.name} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>City</FormLabel>
                <Select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Select city"
                  isDisabled={!formData.state}
                  _focus={{ border: "none", boxShadow: "md" }}
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel mt={4}>Area</FormLabel>
                <Input
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Neighborhood or specific area"
                  _focus={{ border: "none", boxShadow: "md" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>Budget Range (₦)</FormLabel>
                <SimpleGrid columns={2} spacing={2}>
                  <Input
                    name="minBudget"
                    value={formData.minBudget}
                    onChange={handleChange}
                    placeholder="Min"
                    type="number"
                    _focus={{ border: "none", boxShadow: "md" }}
                  />
                  <Input
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    placeholder="Max"
                    type="number"
                    _focus={{ border: "none", boxShadow: "md" }}
                  />
                </SimpleGrid>
              </FormControl>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="100%"
            >
              <Heading as="h3" size="md" mb={6}>
                CLIENT DETAILS
              </Heading>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  _focus={{ border: "none", boxShadow: "md" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>Last Name</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  _focus={{ border: "none", boxShadow: "md" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>WhatsApp Number</FormLabel>
                <Input
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="e.g. +234XXXXXXXXXX"
                  type="tel"
                  _focus={{ border: "none", boxShadow: "md" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={4}>Email</FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  type="email"
                  _focus={{ border: "none", boxShadow:'md' }}
                />
              </FormControl>
              <Box flexGrow={1} />
              <Button
                type="submit"
                bg={colors.primary}
                size="lg"
                width="full"
                isLoading={isSubmitting}
                loadingText="Submitting"
                color={"white"}
                disabled={isSubmitting}
                display={"flex"}
                alignSelf="flex-end"
              >
                Submit Search Request
              </Button>
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
};
export default SearchForm;
