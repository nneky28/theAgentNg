
// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  VStack,
  HStack,
  Checkbox,
  CheckboxGroup,
  Stack,
  Icon,
  useToast,
  Card,
  CardBody,
  Progress,
  Divider,
  useColorModeValue,
  Image,
  Badge,
  Wrap,
  WrapItem,
  Spinner,
} from "@chakra-ui/react";
import { FiUser, FiMapPin, FiArrowRight, FiX } from "react-icons/fi";
import { nigerianStates } from "@/utils/nigerian-states";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface FormData {
  username: string;
  whatsappNo: string;
  state: string;
  cities: string[];
}

const getCities = (stateName: string): string[] => {
  const state = nigerianStates.find((s) => s.name === stateName);
  return state ? state.cities : [];
};

const OnboardingPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    whatsappNo: "",
    state: "",
    cities: [],
  });

  const [cities, setCities] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  
  const toast = useToast();
  const router = useRouter();
  const overlayColor = useColorModeValue("rgba(0,0,0,0.65)", "rgba(0,0,0,0.75)");

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to continue",
          status: "error",
          duration: 3000,
        });
        router.push("/");
        return;
      }

      // Check if user is already onboarded
      const { data: userData, error: dbError } = await supabase
        .from("users")
        .select("is_onboarded, onboarding_completed, role")
        .eq("id", user.id)
        .single();

      if (dbError) {
        console.error("Error checking onboarding status:", dbError);
      }

      // Type assertion for userData
      const typedUserData = userData as any;

      // If already onboarded, redirect to appropriate dashboard
      if (typedUserData?.is_onboarded || typedUserData?.onboarding_completed) {
        if (typedUserData.role === "admin") {
          router.push("/admin/properties");
        } else {
          router.push("/dashboard/agent");
        }
        return;
      }

      setUserEmail(user.email || "");
      setUserId(user.id);
      setCheckingAuth(false);
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/");
    }
  };

  useEffect(() => {
    if (formData.state) {
      setCities(getCities(formData.state));
      setFormData((prev) => ({ ...prev, cities: [] }));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCityChange = (values: string[]): void => {
    if (values.length <= 5) {
      setFormData((prev) => ({
        ...prev,
        cities: values,
      }));
    } else {
      toast({
        title: "Maximum 5 cities allowed",
        description: "You can only select up to 5 cities",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const removeCity = (cityToRemove: string): void => {
    setFormData((prev) => ({
      ...prev,
      cities: prev.cities.filter((city) => city !== cityToRemove),
    }));
  };

  const validateStep = (step: number): boolean => {
    const whatsappRegex = /^(0[789][01]\d{8}|\+234[789][01]\d{8})$/;
    
    if (step === 1) {
      return (
        formData.username.trim().length >= 3 &&
        whatsappRegex.test(formData.whatsappNo.trim())
      );
    }
    
    if (step === 2) {
      return formData.state !== "";
    }
    
    return false;
  };

  const handleNext = (): void => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
    } else {
      let errorMsg = "Please fill in all required fields";
      
      if (formData.username.trim().length < 3) {
        errorMsg = "Username must be at least 3 characters.";
      } else if (!/^(0[789][01]\d{8}|\+234[789][01]\d{8})$/.test(formData.whatsappNo.trim())) {
        errorMsg = "Enter a valid Nigerian WhatsApp number.";
      }
      
      toast({
        title: errorMsg,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateStep(2)) {
      toast({
        title: "Please select your state",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!userId || !userEmail) {
      toast({
        title: "Authentication error",
        description: "Please sign in again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const updateData = {
        username: formData.username,
        whatsapp_no: formData.whatsappNo,
        state: formData.state,
        city: formData.cities.length > 0 ? formData.cities[0] : null,
        cities: formData.cities,
        is_onboarded: true,
        onboarding_completed: true,
        completed_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId);

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      toast({
        title: "Welcome aboard! 🎉",
        description: "Your profile has been set up successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Small delay before redirect
      setTimeout(() => {
        router.push("/dashboard/agent");
      }, 1000);
      
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = (): void => {
    setCurrentStep(1);
  };

  const progressPercentage: number = (currentStep / 2) * 100;

  if (checkingAuth) {
    return (
      <Flex minH="100vh" align="center" justify="center" direction="column" gap={4}>
        <Spinner size="xl" color="purple.500" thickness="4px" />
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <Box
      minH="100vh"
      bgImage="url('/images/Home1.webp')"
      bgSize="cover"
      bgPosition="center"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="white"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: overlayColor,
        zIndex: 0,
        backdropFilter: "blur(2px)",
      }}
      py={8}
    >
      <Container maxW="lg" position="relative" zIndex={1}>
        <VStack spacing={8}>
          <Box
            textAlign="center"
            color="white"
            opacity={0.9}
            w="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Image
              w={["26px", "80px"]}
              src="/images/L2.png"
              objectFit="contain"
              transition="all 0.3s ease"
              alt="TheAgent Logo"
              alignSelf="center"
              opacity={0.9}
              mb={8}
            />
            <Heading mb={2}>Welcome to The Agent Ng</Heading>
            <Text fontSize="lg" opacity={0.9}>
              Let&apos;s set up your profile to get started
            </Text>
          </Box>

          <Box w="full" bg="whiteAlpha.200" borderRadius="full" p={1}>
            <Progress
              value={progressPercentage}
              colorScheme="purple"
              borderRadius="full"
              bg="gray"
            />
          </Box>

          <Card w="full" shadow="2xl" borderRadius="2xl">
            <CardBody p={8}>
              <VStack spacing={6}>
                {currentStep === 1 && (
                  <>
                    <Box textAlign="center" mb={4}>
                      <Icon as={FiUser} boxSize={8} color="purple.500" mb={2} />
                      <Heading size="lg" color="gray.700">
                        Personal Information
                      </Heading>
                      <Text color="gray.500">Tell us a bit about yourself</Text>
                    </Box>

                    <FormControl isRequired>
                      <FormLabel fontWeight="600" color="gray.700">
                        Username / Business Name
                      </FormLabel>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        size="lg"
                        borderRadius="xl"
                        _focus={{
                          borderColor: "purple.400",
                          boxShadow: "0 0 0 1px #9F7AEA",
                        }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontWeight="600" color="gray.700">
                        WhatsApp Number
                      </FormLabel>
                      <Input
                        name="whatsappNo"
                        value={formData.whatsappNo}
                        onChange={handleInputChange}
                        placeholder="Enter your WhatsApp number"
                        size="lg"
                        borderRadius="xl"
                        _focus={{
                          borderColor: "purple.400",
                          boxShadow: "0 0 0 1px #9F7AEA",
                        }}
                      />
                    </FormControl>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <Box textAlign="center" mb={4}>
                      <Icon as={FiMapPin} boxSize={8} color="purple.500" mb={2} />
                      <Heading size="lg" color="gray.700">
                        Locations of Interest
                      </Heading>
                      <Text color="gray.500">
                        Where do you primarily operate?
                      </Text>
                    </Box>

                    <FormControl isRequired>
                      <FormLabel fontWeight="600" color="gray.700">
                        State
                      </FormLabel>
                      <Select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Select state"
                        size="lg"
                        borderRadius="xl"
                        _focus={{
                          borderColor: "purple.400",
                          boxShadow: "0 0 0 1px #9F7AEA",
                        }}
                      >
                        {nigerianStates.map((state) => (
                          <option key={state.name} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="600" color="gray.700">
                        City (You can select up to 5)
                      </FormLabel>
                      
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
                                  _hover={{ color: "red.500" }}
                                />
                              </Badge>
                            </WrapItem>
                          ))}
                        </Wrap>
                      )}

                      <CheckboxGroup
                        value={formData.cities}
                        onChange={handleCityChange}
                      >
                        <Stack
                          spacing={3}
                          maxH="300px"
                          overflowY="auto"
                          p={4}
                          border="1px"
                          borderColor="gray.200"
                          borderRadius="xl"
                          bg={!formData.state ? "gray.50" : "white"}
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
                                  !formData.cities.includes(city) &&
                                  formData.cities.length >= 5
                                }
                                size="lg"
                              >
                                {city}
                              </Checkbox>
                            ))
                          )}
                        </Stack>
                      </CheckboxGroup>
                      
                      <Text fontSize="xs" color="gray.500" mt={2}>
                        {formData.cities.length}/5 cities selected 
                        {formData.cities.length === 0 ? " (Optional)" : ""}
                      </Text>
                    </FormControl>
                  </>
                )}

                <Divider />

                <Flex w="full" justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.500">
                    Step {currentStep} of 2
                  </Text>

                  <HStack spacing={3}>
                    {currentStep === 2 && (
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        colorScheme="purple"
                      >
                        Back
                      </Button>
                    )}

                    {currentStep === 1 ? (
                      <Button
                        colorScheme="purple"
                        rightIcon={<FiArrowRight />}
                        onClick={handleNext}
                        size="lg"
                        borderRadius="xl"
                        px={8}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        colorScheme="purple"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText="Setting up..."
                        size="lg"
                        borderRadius="xl"
                        px={8}
                      >
                        Complete Setup
                      </Button>
                    )}
                  </HStack>
                </Flex>
              </VStack>
            </CardBody>
          </Card>

          <Text textAlign="center" color="whiteAlpha.800" fontSize="sm">
            Need help? Contact support
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default OnboardingPage;