"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FiUsers, FiMapPin, FiTrendingUp, FiStar } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";
import { formatPrice } from "@/utils/Method";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

interface Stats {
  totalProperties: number;
  totalAgents: number;
  featuredProperties: number;
  recentListings: number;
}

interface RecentProperty {
  id: string;
  title: string;
  price: string;
  category: string;
  created_at: string;
  is_featured: boolean;
  is_published: boolean;
}

const StatCard = ({ icon, label, value, helpText, color }: any) => (
  <Box
    bg="white"
    p={6}
    borderRadius="xl"
    boxShadow="sm"
    borderWidth="1px"
    borderColor="gray.200"
  >
    <Flex justify="space-between" align="start">
      <Stat>
        <StatLabel color="gray.600" fontSize="sm" fontWeight="500">
          {label}
        </StatLabel>
        <StatNumber fontSize="3xl" fontWeight="bold" color="gray.800" mt={2}>
          {value}
        </StatNumber>
        {helpText && (
          <StatHelpText color="gray.500" fontSize="xs" mt={1}>
            {helpText}
          </StatHelpText>
        )}
      </Stat>
      <Box bg={`${color}.50`} p={3} borderRadius="lg">
        <Icon as={icon} boxSize={6} color={`${color}.500`} />
      </Box>
    </Flex>
  </Box>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    totalAgents: 0,
    featuredProperties: 0,
    recentListings: 0,
  });
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const supabase = createClient();
    setLoading(true);

    try {
      // Fetch properties count
      const { count: propertiesCount, error: propError } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("is_archived", false);

      // Fetch featured properties count
      const { count: featuredCount, error: featuredError } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("is_featured", true)
        .eq("is_archived", false);

      // Fetch agents count
      const { count: agentsCount, error: agentsError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "agent");

      // Fetch recent properties (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: recentCount, error: recentError } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      // Fetch recent properties for table
      const { data: recentProps, error: recentPropsError } = await supabase
        .from("properties")
        .select("id, title, price, category, created_at, is_featured")
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(5);

      if (
        propError ||
        featuredError ||
        agentsError ||
        recentError ||
        recentPropsError
      ) {
        throw new Error("Error fetching dashboard data");
      }

      setStats({
        totalProperties: propertiesCount || 0,
        totalAgents: agentsCount || 0,
        featuredProperties: featuredCount || 0,
        recentListings: recentCount || 0,
      });

      setRecentProperties(recentProps || []);
    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl">
      <Heading mb={8} size="lg">
        Dashboard Overview
      </Heading>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          icon={FiMapPin}
          label="Total Properties"
          value={stats.totalProperties}
          helpText="Active listings"
          color="blue"
        />
        <StatCard
          icon={FiUsers}
          label="Total Agents"
          value={stats.totalAgents}
          helpText="Registered agents"
          color="green"
        />
        <StatCard
          icon={FiStar}
          label="Featured"
          value={stats.featuredProperties}
          helpText="Featured properties"
          color="yellow"
        />
        <StatCard
          icon={FiTrendingUp}
          label="Recent Listings"
          value={stats.recentListings}
          helpText="Last 30 days"
          color="purple"
        />
      </SimpleGrid>

      {/* Recent Properties Table */}
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="gray.200"
        p={6}
      >
        <Heading size="md" mb={4}>
          Recent Properties
        </Heading>
        {recentProperties.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={8}>
            No properties found
          </Text>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Title</Th>
                  <Th>Location</Th>
                  <Th>Price</Th>
                  <Th>Category</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody fontSize={'sm'}>
                {recentProperties.map((property) => (
                  <Tr key={property.id}>
                    <Td color="gray.600">
                      {new Date(property.created_at).toLocaleDateString()}
                    </Td>
                    <Td>
                      <Text noOfLines={1}>{property.title}</Text>
                    </Td>
                    <Td fontWeight="600">{formatPrice(property.price)}</Td>
                    <Td>{property.category}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          property.category === "For Sale" ? "orange" : "green"
                        }
                      >
                        {property.category}
                      </Badge>
                    </Td>
                    <Td>
                      {property.is_featured ? (
                        <Badge colorScheme="yellow" fontSize="xs">
                          ⭐ Featured
                        </Badge>
                      ) : property.is_published ? (
                        <Badge colorScheme="green" fontSize="xs">
                          <CheckIcon boxSize={2} mr={1} /> Published
                        </Badge>
                      ) : (
                        <Badge colorScheme="gray" fontSize="xs">
                          <CloseIcon boxSize={2} mr={1} /> Draft
                        </Badge>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Container>
  );
}
