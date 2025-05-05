'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
  Badge,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Avatar,
  SimpleGrid,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import {
  FiCalendar,
  FiFilter,
  FiArrowRight,
  FiArrowLeft,
} from 'react-icons/fi';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const blogPosts = [
  {
    id: 1,
    title: 'Harmonizing Energy: Chakra Principles in Modern Architecture',
    excerpt:
      'Discover how the ancient principles of chakra energy flow can transform modern living spaces into balanced and harmonious environments.',
    image:
      'https://media.istockphoto.com/id/1421422160/photo/interior-of-living-room.webp?a=1&b=1&s=612x612&w=0&k=20&c=z0nRq3IMBRow4NotaBjxVVc8cLReRe69Yty0QPOPjqI=',
    author: 'Jasmine Chisom',
    date: 'April 28, 2025',
    category: 'Design',
    likes: 42,
    comments: 8,
  },
  {
    id: 2,
    title: 'Serenity Heights',
    excerpt:
      'A stunning penthouse with panoramic views, designed to enhance wisdom and spiritual connection.',
    image:
      'https://images.unsplash.com/photo-1715424778955-141efa67a50a?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    author: 'Victor Chukwuma',
    date: 'April 14, 2025',
    category: 'Community',
    likes: 56,
    comments: 15,
  },
  {
    id: 3,
    title: 'The Root Chakra Approach to Real Estate Investment',
    excerpt:
      'Exploring how grounding principles from the Root Chakra can guide solid, stable investment decisions in today\'s volatile market.',
    image:
      'https://media.istockphoto.com/id/1482804681/photo/modern-apartment-buildings.webp?a=1&b=1&s=612x612&w=0&k=20&c=VR7c_e5WwGx-fshEBCjnGyin9gG6WitG9LuMjwpTtJo=',
    author: 'Nneka Chucks',
    date: 'April 21, 2025',
    category: 'Investment',
    likes: 37,
    comments: 12,
  },
  {
    id: 4,
    title: 'Grounded Gardens Estate',
    excerpt:
      'A spacious family home with extensive gardens, promoting stability and security.',
    author: 'Chioma Ogba',
    date: 'April 14, 2025',
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1630225865033-7a3908cee9ce?w=200&dpr=2&crop=entropy&h=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    likes: 56,
    comments: 15,
  },
  {
    id: 5,
    title: 'Creating Heart-Centered Community Spaces in Urban Developments',
    excerpt:
      'How the Heart Chakra\'s principles of connection and compassion are reshaping community areas in modern real estate projects.',
    image:
      'https://media.istockphoto.com/id/2156929929/photo/relaxing-at-home-with-wireless-technology.webp?a=1&b=1&s=612x612&w=0&k=20&c=syAedLqZS4HvpEaiMQrgGqTaa-mr6-WGVm4Ql3k5uug=',
    author: 'Chioma Obi',
    date: 'April 14, 2025',
    category: 'Community',
    likes: 56,
    comments: 15,
  },
];

const categories = ['All', 'Design', 'Investment', 'Community', 'Sustainability', 'Market Trends'];

const RealEstateBlog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePosts, setVisiblePosts] = useState(4); 

  // Filter posts based on category and search query
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + 4);
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const primaryColor = useColorModeValue('purple.600', 'purple.400');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Hero Section */}
      <Box bgGradient="linear(to-r, purple.700, purple.500)" color="white" py={6} h={'60vh'}>
        <Navbar />
        <Container maxW="container.xl" textAlign="center"  pt={['40%',"15%"]}>
          <Heading as="h1" size="2xl" mb={4}>
            Balanced Living Through Mindful Spaces
          </Heading>
          <Text fontSize="xl" maxW="3xl" mx="auto" mb={8} color="purple.100">
            Insights and inspirations on property with personalized
            recommendations from our expert agents.
          </Text>
          <Flex
            bg={cardBg}
            rounded="lg"
            p={2}
            maxW="xl"
            mx="auto"
            alignItems="center"
            boxShadow="lg"
          >
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                border="none"
                _focus={{ outline: 'none' }}
                color={textColor}
              />
            </InputGroup>
            <Button colorScheme="purple" ml={2}>
              Search
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Category Filter */}
      <Box py={8} bg={cardBg} borderBottom="1px" borderColor="gray.200">
        <Container maxW="container.xl">
          <HStack mb={4}>
            <Icon as={FiFilter} color={primaryColor} />
            <Text fontWeight="medium">Filter by Category</Text>
          </HStack>
          <Flex flexWrap="wrap" gap={2}>
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'solid' : 'outline'}
                colorScheme={selectedCategory === category ? 'purple' : 'gray'}
                borderRadius="full"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        <Box gap={8}>
          <Heading as="h2" size="lg" mb={6}>
            Latest Articles
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {filteredPosts.length > 0 ? (
              filteredPosts.slice(0, visiblePosts).map((post) => (
                <Box
                  key={post.id}
                  bg={cardBg}
                  rounded="xl"
                  shadow="md"
                  overflow="hidden"
                  _hover={{ shadow: 'lg' }}
                  transition="box-shadow 0.3s ease"
                >
                  <Flex direction={{ base: 'column', md: 'row' }}>
                    <Box flexShrink={0} w={{ base: '100%', md: '33%' }}>
                      <Image
                        src={post.image}
                        alt={post.title}
                        objectFit="cover"
                        h="100%"
                      />
                    </Box>
                    <Box p={6} flex="1">
                      <HStack mb={2}>
                        <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                          {post.category}
                        </Badge>
                        <HStack color="gray.500" fontSize="xs">
                          <Icon as={FiCalendar} boxSize={3} />
                          <Text>{post.date}</Text>
                        </HStack>
                      </HStack>

                      <LinkBox>
                        <Heading as="h3" size="md" mb={2}>
                          <LinkOverlay href="#" _hover={{ color: primaryColor }}>
                            {post.title}
                          </LinkOverlay>
                        </Heading>
                      </LinkBox>

                      <Text color={secondaryTextColor} mb={4}>
                        {post.excerpt}
                      </Text>

                      <Flex justify="space-between" align="center">
                        <HStack>
                          <Avatar
                            size="sm"
                            name={post.author}
                            bg="purple.200"
                            color="purple.700"
                          />
                          <Text fontSize="sm" color={textColor}>
                            {post.author}
                          </Text>
                        </HStack>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              ))
            ) : (
              <Box textAlign="center" py={12} bg={cardBg} rounded="lg" shadow="md">
                <Text color="gray.500">No articles found matching your criteria.</Text>
                <Button
                  variant="link"
                  colorScheme="purple"
                  mt={4}
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Clear filters
                </Button>
              </Box>
            )}
          </SimpleGrid>

          <Flex justify="center" mt={12} py={12}>
            {filteredPosts.length > visiblePosts && (
              <Button
                variant="solid"
                color={'white'}
                bg={'#724B9B'}
                fontWeight={'bold'}
                rightIcon={<FiArrowRight />}
                p={6}
                onClick={handleLoadMore}
                mr={4}
              >
                Load more articles
              </Button>
            )}
            {visiblePosts > 4 && (
              <Button
              variant="solid"
              color={'white'}
              bg={'#724B9B'}
              fontWeight={'bold'}
              leftIcon={<FiArrowLeft />}
                p={6}
                onClick={() => setVisiblePosts(4)}
              >
                See less
              </Button>
            )}
          </Flex>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default RealEstateBlog;