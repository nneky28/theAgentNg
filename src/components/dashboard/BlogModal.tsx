'use client'

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
  Select,
  SimpleGrid,
  VStack,
  Box,
  Icon,
  Text,
  Button,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
import { useState } from 'react';

interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: File | null;
  status: 'published' | 'draft';
}

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BlogFormData) => void;
  categories: string[];
}

export const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
}) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = '#724B9B';

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: null,
    status: 'draft'
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      image: null,
      status: 'draft'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={accentColor}>Create New Blog Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Article Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Harmonizing Energy: Chakra Principles in Modern Architecture"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Select category"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Excerpt</FormLabel>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Professional insights and inspirations from expert agents..."
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Featured Image</FormLabel>
                <Box
                  border="2px dashed"
                  borderColor={borderColor}
                  borderRadius="md"
                  p={6}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ borderColor: accentColor }}
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    display="none"
                    id="blog-image-upload"
                  />
                  <label htmlFor="blog-image-upload">
                    <VStack spacing={2}>
                      <Icon as={FiCamera} boxSize={8} color="gray.400" />
                      <Text>Click to upload featured image</Text>
                      <Text fontSize="sm" color="gray.500">
                        {formData.image ? formData.image.name : 'No image selected'}
                      </Text>
                    </VStack>
                  </label>
                </Box>
              </FormControl>
            </VStack>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Article Content</FormLabel>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your article content here..."
                  rows={15}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'published' | 'draft' }))}
                >
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish Now</option>
                </Select>
              </FormControl>

              <Flex gap={4}>
                <Button
                  flex={1}
                  bg={accentColor}
                  color="white"
                  _hover={{ bg: 'purple.600' }}
                  onClick={handleSubmit}
                >
                  {formData.status === 'published' ? 'Publish Article' : 'Save Draft'}
                </Button>
                <Button flex={1} variant="outline" onClick={onClose}>
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