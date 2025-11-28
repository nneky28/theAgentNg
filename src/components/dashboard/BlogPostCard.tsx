'use client'

import {
  Box,
  Flex,
  Image,
  HStack,
  Badge,
  Icon,
  Text,
  Heading,
  LinkBox,
  LinkOverlay,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCalendar, FiEdit, FiEye } from 'react-icons/fi';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  status: 'published' | 'draft';
}

interface BlogPostCardProps {
  post: BlogPost;
  onEdit?: (post: BlogPost) => void;
  onView?: (post: BlogPost) => void;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  onEdit,
  onView,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = '#724B9B';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'green';
      case 'draft': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <Box
      bg={cardBg}
      rounded="xl"
      shadow="md"
      overflow="hidden"
      _hover={{ shadow: 'lg' }}
      transition="box-shadow 0.3s ease"
    >
      <Flex direction={{ base: 'column', md: 'row' }}>
        <Box flexShrink={0} w={{ base: '100%', md: '40%' }}>
          <Image
            src={post.image}
            alt={post.title}
            objectFit="cover"
            h="100%"
          />
        </Box>
        <Box p={6} flex="1">
          <HStack mb={2}>
            <Badge colorScheme={getStatusColor(post.status)} px={3} py={1} borderRadius="full">
              {post.status}
            </Badge>
            <HStack color="gray.500" fontSize="xs">
              <Icon as={FiCalendar} boxSize={3} />
              <Text>{post.date}</Text>
            </HStack>
          </HStack>

          <LinkBox>
            <Heading as="h3" size="md" mb={2}>
              <LinkOverlay href="#" _hover={{ color: accentColor }}>
                {post.title}
              </LinkOverlay>
            </Heading>
          </LinkBox>

          <Text color={secondaryTextColor} mb={4}>
            {post.excerpt}
          </Text>

          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color={textColor}>
              by {post.author}
            </Text>
            <HStack>
              <IconButton
                aria-label="Edit post"
                icon={<FiEdit />}
                size="sm"
                variant="ghost"
                onClick={() => onEdit?.(post)}
              />
              <IconButton
                aria-label="View post"
                icon={<FiEye />}
                size="sm"
                variant="ghost"
                onClick={() => onView?.(post)}
              />
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};