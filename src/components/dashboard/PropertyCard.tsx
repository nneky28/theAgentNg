'use client'

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Image,
  VStack,
  Flex,
  Text,
  HStack,
  Box,
  useColorModeValue,
  IconButton,
  Tooltip,
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

  Button,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';
import { FiTrash2 } from 'react-icons/fi';
import ConfirmDialog from "@/components/ConfirmDialog";

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
}

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => Promise<void> | void;
  onView?: (property: Property) => void;
  onDelete?: (propertyId: string) => void; 
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onView,
  onEdit,
  onDelete, 
}) => {
  const bgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  
  const getFirstImage = (p: Property) => {
    if (!p.images || p.images.length === 0) return null;
    const img = p.images.find((i) => typeof i === 'string' && i.trim() !== '');
    return img ? img.trim() : null;
  };
 
  const [imgSrc, setImgSrc] = useState<string>(
    getFirstImage(property) ?? ''
  );

  useEffect(() => {
    setImgSrc(getFirstImage(property) ?? '');
  }, [property.images, property]);

  const [form, setForm] = useState({
    state: property.state || '',
    city: property.city || '',
    price: property.price || 0,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    sqft: property.sqft || 0,
    status: property.status || 'active',
    images: property.images ? [...property.images] : [] as string[],
  });

  useEffect(() => {
  
    setForm({
      state: property.state || '',
      city: property.city || '',
      price: property.price || 0,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      sqft: property.sqft || 0,
      status: property.status || 'active',
      images: property.images ? [...property.images] : [],
    });
  }, [property]);

  const openEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // initialize form with current values
    setForm({
      state: property.state || '',
      city: property.city || '',
      price: property.price || 0,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      sqft: property.sqft || 0,
      status: property.status || 'active',
      images: property.images ? [...property.images] : [],
    });
    onOpen();
  };

  const handleFormChange = (field: string, value: string | number | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addImageField = () => {
    setForm(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
  };

  const updateImageAt = (idx: number, value: string) => {
    setForm(prev => {
      const arr = [...(prev.images || [])];
      arr[idx] = value;
      return { ...prev, images: arr };
    });
  };

  const removeImageAt = (idx: number) => {
    setForm(prev => {
      const arr = [...(prev.images || [])];
      arr.splice(idx, 1);
      return { ...prev, images: arr };
    });
  };

  const handleSave = async () => {
    const updated: Property = {
      ...property,
      state: String(form.state).trim(),
      city: String(form.city).trim(),
      price: Number(form.price) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      sqft: Number(form.sqft) || 0,
      status: form.status as Property['status'],
      images: (form.images || []).map((i) => (i || '').trim()).filter(Boolean),
    };

    if (onEdit) {
      await onEdit(updated);
    }

    // immediately reflect first image
    const first = updated.images && updated.images.length > 0 ? updated.images[0] : null;
    setImgSrc(first ?? '');

    onClose();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const handleCardClick = () => {
    if (onView) onView(property);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    if (onDelete) await onDelete(property.id);
    setIsDeleting(false);
    setConfirmOpen(false);
  };

  return (
    <Card
      variant="outline"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      cursor="pointer"
      transition="all 0.2s"
      onClick={handleCardClick}
      position="relative"
    >
      <Flex position="absolute" top="8px" right="8px" zIndex={2} gap={2}>
        <Tooltip label="Edit property" hasArrow>
          <IconButton
            aria-label="Edit property"
            icon={<EditIcon />}
            size="sm"
            onClick={openEdit}
          />
        </Tooltip>
        <Tooltip label="Delete property" hasArrow>
          <IconButton
            aria-label="Delete property"
            icon={<FiTrash2 />}
            size="sm"
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmOpen(true);
            }}
          />
        </Tooltip>
      </Flex>

      <Image
        src={imgSrc}
        alt={'Property image'}
        height="200px"
        width="100%"
        objectFit="cover"
        borderTopRadius="md"
        onError={() => {
          if (imgSrc !== '') {
            setImgSrc('');
          }
        }}
        fallback={
          <Box
            height="200px"
            width="100%"
            bg={bgColor}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderTopRadius="md"
          >
            <Text color={textColor}>Loading image...</Text>
          </Box>
        }
      />

      <CardBody>
        <VStack align="start" spacing={3}>
           <Text fontWeight="bold" fontSize="lg" color="purple.600">
              {property.title}
            </Text>
          <Flex justify="space-between" w="full" align="center">
            <Text fontWeight="bold" fontSize="lg" color="purple.600">
              {formatCurrency(property.price)}
            </Text>
            <Text color="gray.600" noOfLines={1} title={property.state}>
              📍 {property.state}, {property.city}
            </Text>
          </Flex>

          <HStack spacing={4} color="gray.600">
            <HStack spacing={1}>
              <Text fontSize="sm">🛏️</Text>
              <Text fontSize="sm" fontWeight="medium">{property.bedrooms}</Text>
            </HStack>
            <HStack spacing={1}>
              <Text fontSize="sm">🚿</Text>
              <Text fontSize="sm" fontWeight="medium">{property.bathrooms}</Text>
            </HStack>
            <HStack spacing={1}>
              <Text fontSize="sm">📏</Text>
              <Text fontSize="sm" fontWeight="medium">{property.sqft} sqm</Text>
            </HStack>
          </HStack>

          <Flex justify="space-between" w="full" pt={2} borderTop="1px" borderColor="gray.200">
            <Text fontSize="sm" color="gray.500">
              👁️ {property.views || 0} views
            </Text>

          </Flex>
        </VStack>
      </CardBody>

      {/* Edit modal */}
      <Modal isOpen={isOpen} onClose={onClose} onOverlayClick={onClose}>
        <ModalOverlay />
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>Edit Property</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
  

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
                <FormLabel>Price (NGN)</FormLabel>
                <NumberInput
                  value={String(form.price)}
                  onChange={(value) => handleFormChange('price', Number(value || 0))}
                  min={0}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

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
                <FormLabel>Sqm</FormLabel>
                <NumberInput
                  value={String(form.sqft)}
                  onChange={(value) => handleFormChange('sqft', Number(value || 0))}
                  min={0}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>


              <Box>
                <FormLabel>Images (full URLs)</FormLabel>
                <VStack align="stretch" spacing={2}>
                  {(form.images || []).map((img, idx) => (
                    <HStack key={idx}>
                      <Input
                        value={img}
                        onChange={(e) => updateImageAt(idx, e.target.value)}
                        placeholder="https://..."
                      />
                      <IconButton
                        aria-label={`Remove image ${idx + 1}`}
                        icon={<CloseIcon />}
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); removeImageAt(idx); }}
                      />
                    </HStack>
                  ))}
                  <Button
                    leftIcon={<AddIcon />}
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); addImageField(); }}
                  >
                    Add image URL
                  </Button>
                </VStack>
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="purple" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </Card>
  );
};