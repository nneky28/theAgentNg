// @ts-nocheck
"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  VStack,
  Box,
  Icon,
  Text,
  Button,
  Flex,
  InputGroup,
  InputLeftElement,
  useToast,
  useColorModeValue,
  Checkbox,
  CheckboxGroup,
  Stack,
  Wrap,
  WrapItem,
  Badge,
  CloseButton,
  Progress,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { FiCamera, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { CATEGORY_OPTIONS, PROPERTY_TYPES } from "@/constants/propertyOptions";
import CustomSelectField from "../CustomSelect";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { nigerianStates } from "@/utils/nigerian-states";

const PROPERTY_FEATURES = [
  "Smart Home",
  "Balcony",
  "Wardrobes",
  "CCTV",
  "Chandelier",
  "Outdoor Space",
  "Electricity",
  "Ensuite",
  "Panoramic Views",
  "Fully Furnished",
  "Private Garden",
  "Staff Quarters",
  "Gym",
  "Kitchen Cabinets",
  "Laundry Room",
  "Parking Space",
  "Pop Ceiling",
  "24/7 Security",
  "Swimming Pool",
  "Modern Amenities",
  "Water Heater",
  "Wi-Fi",
  "Service Charge",
  "24/7 Light",
  "Water Supply",
];

const MIN_IMAGES = 5;
const MAX_IMAGES = 10;

const getCities = (stateName: string): string[] => {
  const state = nigerianStates.find((s) => s.name === stateName);
  return state ? state.cities : [];
};

interface PropertyFormData {
  title: string;
  address: string;
  price: number;
  currency: 'NGN' | 'USD';
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  sqft: number;
  propertyType: string;
  category: string;
  description: string;
  features: string[];
  images: File[];
  state: string;
  city: string;
  capacity?: string;
  video_link?: string;
}

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: PropertyFormData) => void;
}

// Upload images directly to Supabase Storage
const uploadImages = async (files: File[], userId: string) => {
  const supabase = createClient();
  const imageUrls: string[] = [];

  console.log("🚀 Starting upload for", files.length, "images");
  console.log("👤 User ID:", userId);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}_${i}.${fileExt}`;

    console.log(`📤 Uploading image ${i + 1}/${files.length}:`, fileName);

    const { data, error } = await supabase.storage
      .from("property-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(`❌ Upload failed for image ${i + 1}:`, error);
      console.error("Error details:", {
        message: error.message,
        statusCode: error,
        error: error,
      });
      throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
    }

    console.log(`✅ Image ${i + 1} uploaded successfully:`, data.path);

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("property-images").getPublicUrl(fileName);

    imageUrls.push(publicUrl);
  }

  console.log("🎉 All images uploaded successfully!");
  return imageUrls;
};

// Create property directly in Supabase
const createProperty = async (data: any) => {
  const supabase = createClient();

  // First check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in to create properties");
  }

  // Upload images first
  const imageUrls = await uploadImages(data.imageFiles, user.id);

  // Insert property
  const { data: propertyData, error: dbError } = await supabase
    .from("properties")
    .insert([
      {
        title: data.title,
        price: data.price,
        currency: data.currency || 'NGN',
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        toilets: data.toilets || null,
        sqft: data.sqft,
        propertytype: data.propertyType,
        category: data.category,
        description: data.description,
        features: data.features,
        images: imageUrls,
        state: data.state,
        city: data.city,
        owner_email: user.email,
        owner_id: user.id,
        status: "active",
        views: 0,
        capacity: data.capacity || null,
        video_link: data.video_link || null,
      },
    ])
    .select()
    .single();

  if (dbError) {
    throw new Error(`Failed to create property: ${dbError.message}`);
  }

  return propertyData;
};

export const PropertyModal: React.FC<PropertyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = "#724B9B";
  const toast = useToast();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cities, setCities] = useState<string[]>([]);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    address: "",
    price: 0,
    currency: 'NGN',
    bedrooms: 0,
    bathrooms: 0,
    toilets: 0,
    sqft: 0,
    propertyType: "",
    category: "",
    description: "",
    features: [],
    images: [],
    state: "",
    city: "",
    capacity: "",
    video_link: "",
  });

  // Update cities when state changes
  useEffect(() => {
    if (formData.state) {
      setCities(getCities(formData.state));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  // React Query mutation
  const mutation = useMutation({
    mutationFn: createProperty,
    onSuccess: (data) => {
      console.log("Property added successfully!", data);
      toast({
        title: "Property added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      queryClient.invalidateQueries({ queryKey: ["properties"] });

      onSubmit?.(formData);

      // Reset form
      setFormData({
        title: "",
        address: "",
        price: 0,
        currency: 'NGN',
        bedrooms: 0,
        bathrooms: 0,
        toilets: 0,
        sqft: 0,
        propertyType: "",
        category: "",
        description: "",
        features: [],
        images: [],
        state: "",
        city: "",
        capacity: "",
        video_link: "",
      });
      setUploadProgress(0);

      onClose();
    },
    onError: (error: any) => {
      console.error("Submission error:", error);

      toast({
        title: "Error uploading property",
        description: error.message || "Failed to create property",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
      setUploadProgress(0);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleFeatureChange = (selectedFeatures: string[]) => {
    setFormData((prev) => ({ ...prev, features: selectedFeatures }));
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== featureToRemove),
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const totalImages = formData.images.length + files.length;
    if (totalImages > MAX_IMAGES) {
      toast({
        title: `Maximum ${MAX_IMAGES} images allowed`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.title ||
      !formData.propertyType ||
      !formData.category ||
      !formData.state ||
      !formData.city ||
      formData.images.length < MIN_IMAGES
    ) {
      toast({
        title: "Missing required fields",
        description: `Please fill in all required fields and upload at least ${MIN_IMAGES} images`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Prepare payload
    const payload = {
      title: formData.title,
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms) || null,
      bathrooms: Number(formData.bathrooms) || null,
      sqft: Number(formData.sqft) || null,
      propertyType: formData.propertyType,
      category: formData.category,
      description: formData.description || null,
      features: formData.features,
      imageFiles: formData.images, // Pass File objects directly
      state: formData.state,
      city: formData.city,
    };

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    mutation.mutate(payload);
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      setUploadProgress(100);
    }
  }, [mutation.isSuccess]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      closeOnOverlayClick={!mutation.isPending}
    >
      <ModalOverlay />
      <ModalContent maxH="90vh" overflowY="auto">
        <ModalHeader color={accentColor}>Add New Property</ModalHeader>
        <ModalCloseButton isDisabled={mutation.isPending} />
        <ModalBody pb={6}>
          {mutation.isPending && (
            <Box mb={4}>
              <Text fontSize="sm" mb={2}>
                Uploading property... {uploadProgress}%
              </Text>
              <Progress
                value={uploadProgress}
                size="sm"
                colorScheme="purple"
                hasStripe
                isAnimated
              />
            </Box>
          )}

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <CustomSelectField
                  value={formData.category}
                  handleChange={(value: string | number) => {
                    setFormData((prev) => ({
                      ...prev,
                      category: String(value),
                    }));
                  }}
                  data={CATEGORY_OPTIONS}
                  itemValueKey="value"
                  itemLabelKey="label"
                  placeholder="Select category"
                  width="100%"
                />
              </FormControl>

              {formData.category !== "Event Hall" && (
                <FormControl isRequired>
                  <FormLabel>Property Type</FormLabel>
                  <CustomSelectField
                    value={formData.propertyType}
                    handleChange={(value: string | number) => {
                      setFormData((prev) => ({
                        ...prev,
                        propertyType: String(value),
                      }));
                    }}
                    data={PROPERTY_TYPES}
                    itemValueKey="value"
                    itemLabelKey="label"
                    placeholder="Select property type"
                    width="100%"
                  />
                </FormControl>
              )}

              {formData.category === 'Event Hall' && (
                <FormControl isRequired>
                  <FormLabel>Capacity</FormLabel>
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
              )}

              <FormControl isRequired>
                <FormLabel>State</FormLabel>
                <CustomSelectField
                  value={formData.state}
                  handleChange={(value: string | number) => {
                    setFormData(prev => ({ ...prev, state: String(value), city: "" }));
                  }}
                  data={nigerianStates.map(s => ({ value: s.name, label: s.name }))}
                  itemValueKey="value"
                  itemLabelKey="label"
                  placeholder="Select state"
                  width="100%"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>City</FormLabel>
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

              <FormControl isRequired>
                <FormLabel>Property Title</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="4 Bedroom Detached Duplex"
                  size="lg"
                  borderRadius="xl"
                  _focus={{
                    borderColor: accentColor,
                    boxShadow: `0 0 0 1px ${accentColor}`,
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <RadioGroup
                  value={formData.currency}
                  onChange={(value) => setFormData(prev => ({ ...prev, currency: value as 'NGN' | 'USD' }))}
                  mb={3}
                >
                  <Stack direction="row" spacing={5}>
                    <Radio value="NGN" colorScheme="purple">Naira (₦)</Radio>
                    <Radio value="USD" colorScheme="purple">Dollar ($)</Radio>
                  </Stack>
                </RadioGroup>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Text fontSize="xl" color="gray.400">
                      {formData.currency === 'USD' ? '$' : '₦'}
                    </Text>
                  </InputLeftElement>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleNumberChange}
                    placeholder="450000"
                    borderRadius="xl"
                    _focus={{
                      borderColor: accentColor,
                      boxShadow: `0 0 0 1px ${accentColor}`,
                    }}
                    min={0}
                    step="any"
                  />
                </InputGroup>
              </FormControl>

              <SimpleGrid columns={4} spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm">Bedrooms</FormLabel>
                  <NumberInput min={0} value={formData.bedrooms}>
                    <NumberInputField
                      name="bedrooms"
                      onChange={handleNumberChange}
                      borderRadius="xl"
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                      }}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Bathrooms</FormLabel>
                  <NumberInput min={0} value={formData.bathrooms}>
                    <NumberInputField
                      name="bathrooms"
                      onChange={handleNumberChange}
                      borderRadius="xl"
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                      }}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Toilets</FormLabel>
                  <NumberInput min={0} value={formData.toilets}>
                    <NumberInputField
                      name="toilets"
                      onChange={handleNumberChange}
                      borderRadius="xl"
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                      }}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Sqm</FormLabel>
                  <NumberInput min={0} value={formData.sqft}>
                    <NumberInputField
                      name="sqft"
                      onChange={handleNumberChange}
                      borderRadius="xl"
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                      }}
                    />
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
            </VStack>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the property features, neighborhood, and highlights..."
                  rows={6}
                  borderRadius="xl"
                  _focus={{
                    borderColor: accentColor,
                    boxShadow: `0 0 0 1px ${accentColor}`,
                  }}
                />
              </FormControl>

        

              <FormControl>
                <FormLabel>Features</FormLabel>

                {formData.features.length > 0 && (
                  <Wrap spacing={2} mb={3}>
                    {formData.features.map((feature) => (
                      <WrapItem key={feature}>
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
                          {feature}
                          <Icon
                            as={FiX}
                            cursor="pointer"
                            onClick={() => removeFeature(feature)}
                            _hover={{ color: "red.500" }}
                          />
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}

                <CheckboxGroup
                  value={formData.features}
                  onChange={handleFeatureChange}
                >
                  <Stack
                    spacing={3}
                    maxH="200px"
                    overflowY="auto"
                    p={4}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    bg="white"
                  >
                    <SimpleGrid columns={2} spacing={2}>
                      {PROPERTY_FEATURES.map((feature) => (
                        <Checkbox
                          key={feature}
                          value={feature}
                          colorScheme="purple"
                          size="sm"
                        >
                          {feature}
                        </Checkbox>
                      ))}
                    </SimpleGrid>
                  </Stack>
                </CheckboxGroup>

                <Text fontSize="xs" color="gray.500" mt={2}>
                  {formData.features.length} features selected
                </Text>
              </FormControl>
           <FormControl>
                <FormLabel>Video Link (Optional)</FormLabel>
                <Input
                  name="video_link"
                  value={formData.video_link}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  size="lg"
                  borderRadius="xl"
                  _focus={{
                    borderColor: accentColor,
                    boxShadow: `0 0 0 1px ${accentColor}`,
                  }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Property Images</FormLabel>
                <Box
                  border="2px dashed"
                  borderColor={borderColor}
                  borderRadius="xl"
                  p={6}
                  textAlign="center"
                  cursor={
                    formData.images.length >= MAX_IMAGES
                      ? "not-allowed"
                      : "pointer"
                  }
                  _hover={{
                    borderColor:
                      formData.images.length >= MAX_IMAGES
                        ? borderColor
                        : accentColor,
                  }}
                  transition="all 0.2s"
                >
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    display="none"
                    id="property-image-upload"
                    disabled={formData.images.length >= MAX_IMAGES}
                  />
                  <label
                    htmlFor="property-image-upload"
                    style={{
                      cursor:
                        formData.images.length >= MAX_IMAGES
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    <VStack spacing={2}>
                      <Icon as={FiCamera} boxSize={8} color="gray.400" />
                      <Text>
                        {formData.images.length >= MAX_IMAGES
                          ? "Maximum 10 images reached"
                          : "Click to upload images"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {formData.images.length} / {MAX_IMAGES} images selected
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Minimum {MIN_IMAGES} images required
                      </Text>
                    </VStack>
                  </label>
                </Box>

                {formData.images.length > 0 && (
                  <Wrap spacing={3} mt={4}>
                    {formData.images.map((img, idx) => (
                      <WrapItem key={idx}>
                        <Box position="relative">
                          <Box
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="md"
                            w="80px"
                            h="80px"
                            bg="gray.100"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Image
                              src={URL.createObjectURL(img)}
                              alt={`property-img-${idx}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              width={80}
                              height={80}
                            />
                          </Box>
                          <CloseButton
                            size="sm"
                            position="absolute"
                            top={1}
                            right={1}
                            color="red.500"
                            bg="white"
                            borderRadius="full"
                            boxShadow="sm"
                            onClick={() => removeImage(idx)}
                          />
                        </Box>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}
              </FormControl>

              <Flex gap={4} mt={4}>
                <Button
                  flex={1}
                  bg={accentColor}
                  color="white"
                  _hover={{ bg: "purple.600" }}
                  onClick={handleSubmit}
                  size="lg"
                  borderRadius="xl"
                  isDisabled={
                    formData.images.length < MIN_IMAGES || mutation.isPending
                  }
                  isLoading={mutation.isPending}
                  loadingText="Uploading..."
                >
                  Add Property
                </Button>
                <Button
                  flex={1}
                  variant="outline"
                  onClick={onClose}
                  size="lg"
                  borderRadius="xl"
                  isDisabled={mutation.isPending}
                >
                  Cancel
                </Button>
              </Flex>
            </VStack>
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PropertyModal;
