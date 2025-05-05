'use client';
import { Box, Container, Heading, Text, SimpleGrid, VStack, Link, Button } from '@chakra-ui/react';
import { NewsItem } from '../types';
import { colors } from '@/utils/color';
import { useRouter } from 'next/navigation';


const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Top 5 Areas in Lagos for Property Investment",
    excerpt: "Looking to invest in Lagos real estate? Here are the top 5 areas with the best ROI potential...",
    date: "April 28, 2025"
  },
  {
    id: 2,
    title: "Understanding Property Documentation in Nigeria",
    excerpt: "Learn about C of O, Governor's Consent, and other important property documents...",
    date: "April 20, 2025"
  },
  {
    id: 3,
    title: "Negotiating Rent in Nigeria's Major Cities",
    excerpt: "Tips and strategies for negotiating the best rental terms in Nigeria's competitive market...",
    date: "April 15, 2025"
  }
];

const NewsTips = () => {
  const router = useRouter();

  const handleLoadMore = () => {
    router.push('/blog');
  };

  return (
    <Box py={12} bg="gray.50" id="news">
      <Container maxW="1300px">
        <Heading as="h2" size="xl" mb={8} textAlign="center">News & Tips</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {newsItems.map((item) => (
            <VStack 
              key={item.id}
              align="start" 
              p={6} 
              bg="white" 
              borderRadius="lg" 
              boxShadow="md"
              spacing={3}
            >
              <Text fontSize="sm" color="gray.500">{item.date}</Text>
              <Heading as="h3" size="md">{item.title}</Heading>
              <Text color="gray.600">{item.excerpt}</Text>
              <Link color={colors.primary} fontWeight="bold">Read more</Link>
            </VStack>
          ))}
        </SimpleGrid>

        <Box textAlign="center" mt={8}>
          <Button
            onClick={handleLoadMore}
            bg={colors.primary}
            color="white"
            _hover={{ bg: colors.primaryLight }}
            size="lg"
            fontWeight={'bold'}
          >
            Load More
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsTips;