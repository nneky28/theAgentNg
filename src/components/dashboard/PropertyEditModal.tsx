'use client'

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  RadioGroup,
  Radio,
  Button,
  Stack,
  Textarea,
  VStack,
  HStack,
  IconButton,
  Image,
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

interface Property {
  id: string;
  state: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: 'active' | 'pending' | 'sold';
  views: number;
  images?: string[];
  title: string;
  currency?: 'NGN' | 'USD' | string;
  toilets?: number;
  video_link?: string | null;
  description?: string;
}

interface PropertyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onSave: (updated: Property) => Promise<void> | void;
}

export const PropertyEditModal: React.FC<PropertyEditModalProps> = ({
  isOpen,
  onClose,
  property,
  onSave,
}) => {
  const [form, setForm] = useState({
    title: property.title || '',
    state: property.state || '',
    city: property.city || '',
    price: property.price || 0,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    sqft: property.sqft || 0,
    status: property.status || 'active',
    images: property.images ? [...property.images] : [] as string[],
    currency: property.currency || 'NGN',
    toilets: property.toilets || 0,
    video_link: property.video_link || '',
    description: property.description || '',
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const bgColor = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    setForm({
      title: property.title || '',
      state: property.state || '',
      city: property.city || '',
      price: property.price || 0,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      sqft: property.sqft || 0,
      status: property.status || 'active',
      images: property.images ? [...property.images] : [],
      currency: property.currency || 'NGN',
      toilets: property.toilets || 0,
      video_link: property.video_link || '',
      description: property.description || '',
    });
    setUploadedImages(property.images || []);
  }, [property]);

  const handleFormChange = (field: string, value: string | number | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert files to base64 or upload to server
    // For now, we'll create object URLs as a placeholder
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        newImages.push(result);
        if (newImages.length === files.length) {
          setUploadedImages(prev => [...prev, ...newImages]);
          setForm(prev => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    setForm(prev => {
      const images = [...(prev.images || [])];
      images.splice(index, 1);
      return { ...prev, images };
    });
  };

  const handleSave = async () => {
    const updated: Property = {
      ...property,
      title: String(form.title).trim(),
      state: String(form.state).trim(),
      city: String(form.city).trim(),
      price: Number(form.price) || 0,
      currency: form.currency || 'NGN',
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      toilets: Number(form.toilets) || 0,
      sqft: Number(form.sqft) || 0,
      status: form.status as Property['status'],
      images: uploadedImages.filter(Boolean),
      video_link: form.video_link?.trim() || null,
      description: form.description?.trim() || '',
    };

    await onSave(updated);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>Edit Property</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={form.description || ''}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={4}
              />
            </FormControl>

            <FormControl>
              <FormLabel>State</FormLabel>
              <Input
                value={form.state}
                onChange={(e) => handleFormChange('state', e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                value={form.city}
                onChange={(e) => handleFormChange('city', e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Price</FormLabel>
              <RadioGroup
                value={form.currency || 'NGN'}
                onChange={(value) => handleFormChange('currency', value)}
                mb={2}
              >
                <Stack direction="row" spacing={4}>
                  <Radio value="NGN" colorScheme="purple">Naira (₦)</Radio>
                  <Radio value="USD" colorScheme="purple">Dollar ($)</Radio>
                </Stack>
              </RadioGroup>
              <NumberInput
                value={String(form.price)}
                onChange={(value) => handleFormChange('price', Number(value || 0))}
                min={0}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <HStack spacing={4} align="start">
              <FormControl>
                <FormLabel>Bedrooms</FormLabel>
                <NumberInput
                  value={String(form.bedrooms)}
                  onChange={(value) => handleFormChange('bedrooms', Number(value || 0))}
                  min={0}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Bathrooms</FormLabel>
                <NumberInput
                  value={String(form.bathrooms)}
                  onChange={(value) => handleFormChange('bathrooms', Number(value || 0))}
                  min={0}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Toilets</FormLabel>
                <NumberInput
                  value={String(form.toilets || 0)}
                  onChange={(value) => handleFormChange('toilets', Number(value || 0))}
                  min={0}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Size (sqm)</FormLabel>
              <NumberInput
                value={String(form.sqft)}
                onChange={(value) => handleFormChange('sqft', Number(value || 0))}
                min={0}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Video Link (Optional)</FormLabel>
              <Input
                value={form.video_link || ''}
                onChange={(e) => handleFormChange('video_link', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Property Images</FormLabel>
              <VStack align="stretch" spacing={3}>
                {/* Display uploaded images with delete button */}
                {uploadedImages.length > 0 && (
                  <VStack align="stretch" spacing={2}>
                    {uploadedImages.map((img, index) => (
                      <Box
                        key={index}
                        position="relative"
                        borderRadius="md"
                        overflow="hidden"
                        border="1px solid"
                        borderColor="gray.200"
                      >
                        <Image
                          src={img}
                          alt={`Property ${index + 1}`}
                          width="100%"
                          height="150px"
                          objectFit="cover"
                        />
                        <IconButton
                          aria-label={`Remove image ${index + 1}`}
                          icon={<CloseIcon />}
                          size="sm"
                          position="absolute"
                          top={2}
                          right={2}
                          colorScheme="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                        />
                      </Box>
                    ))}
                  </VStack>
                )}

                {/* Upload button */}
                <Box
                  as="label"
                  htmlFor="image-upload"
                  cursor="pointer"
                  borderWidth={2}
                  borderStyle="dashed"
                  borderColor="purple.500"
                  borderRadius="md"
                  p={8}
                  bg={bgColor}
                  textAlign="center"
                  _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
                  transition="background 0.2s"
                >
                  <VStack spacing={2}>
                    <Text fontSize="3xl">📤</Text>
                    <Text fontWeight="medium" color="purple.500">
                      Click to upload images
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      PNG, JPG, JPEG up to 10MB
                    </Text>
                  </VStack>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    display="none"
                    onChange={handleImageUpload}
                  />
                </Box>
              </VStack>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="purple" onClick={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
