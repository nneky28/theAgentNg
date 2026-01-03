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
  VStack,
  useBreakpointValue,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { FiUsers, FiMapPin, FiTrendingUp, FiStar } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";
import { formatPrice } from "@/utils/Method";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { colors } from "@/utils/color";

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
  currency?: string;
  category: string;
  created_at: string;
  is_featured: boolean;
  is_published: boolean;
}

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number | string;
  color: string;
}) => (
  <Box
    bg="white"
    p={[4, 6]}
    borderRadius="xl"
    boxShadow="sm"
    borderWidth="1px"
    borderColor="gray.200"
  >
    <Flex justify="space-between" align="start">
      <Stat>
        <StatLabel
          color="gray.600"
          fontSize="sm"
          fontWeight="400"
          noOfLines={1}
        >
          {label}
        </StatLabel>
        <HStack
          justifyContent={"space-between"}
          display={"flex"}
          alignItems={"center"}
          mt={2}
        >
          <StatNumber fontSize="3xl" fontWeight="bold" color="gray.800">
            {value}
          </StatNumber>
          <Box bg={`${color}.50`} p={2} borderRadius="lg">
            <Icon as={icon} boxSize={6} color={`${color}.500`} />
          </Box>
        </HStack>

        {/* <Box bg={`${color}.50`} p={[1,3]} borderRadius="lg">
        <Icon as={icon} boxSize={6} color={`${color}.500`} />
      </Box> */}
      </Stat>
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
  const isMobile = useBreakpointValue({ base: true, md: false });

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
        .select(
          "id, title, price, category, created_at, is_featured, is_published"
        )
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
    <Container maxW="container.xl" px={{ base: 1, md: 6 }}>
      <Heading mb={8} size={{ base: "md", md: "lg" }}>
        Dashboard Overview
      </Heading>

      <Box
        bg={colors.primary}
        color="white"
        p={[4, 8]}
        // borderRadius="16px"
        borderTopLeftRadius={"16px"}
        borderTopRightRadius={"16px"}
      >
        {/* Stats Grid */}
        <SimpleGrid
          columns={{ base: 2, sm: 2, lg: 4 }}
          spacing={{ base: 4, md: 6 }}
          mb={8}
        >
          <StatCard
            icon={FiMapPin}
            label="Total Properties"
            value={stats.totalProperties}
            color="blue"
          />
          <StatCard
            icon={FiUsers}
            label="Total Agents"
            value={stats.totalAgents}
            color="green"
          />
          <StatCard
            icon={FiStar}
            label="Featured"
            value={stats.featuredProperties}
            color="yellow"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Recent Listings"
            value={stats.recentListings}
            color="purple"
          />
        </SimpleGrid>
      </Box>

      {/* Recent Properties Table/Cards */}
      <Box
        bg="white"
        borderBottomLeftRadius={"16px"}
        borderBottomRightRadius={"16px"}
        boxShadow="sm"
        borderWidth="1px"
        borderColor="gray.200"
        p={{ base: 4, md: 6 }}
      >
        <Heading size="md" mb={4}>
          Recent Properties
        </Heading>
        {recentProperties.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={8}>
            No properties found
          </Text>
        ) : isMobile ? (
          // Mobile Card View
          <VStack spacing={4} align="stretch">
            {recentProperties.map((property) => (
              <Box
                key={property.id}
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="lg"
                p={4}
                _hover={{ bg: "gray.50" }}
                transition="all 0.2s"
              >
                <VStack align="stretch" spacing={3}>
                  {/* Title and Category */}
                  <Box>
                    <Text fontWeight="600" fontSize="md" mb={2} noOfLines={2}>
                      {property.title}
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      <Badge
                        bg={
                          property.category === "Properties To Let"
                            ? "green.100"
                            : property.category === "Properties For Sale"
                            ? "orange.100"
                            : "blue.100"
                        }
                        fontSize="xs"
                      >
                        {property.category === "Properties To Let"
                          ? "To Let"
                          : property.category === "Properties For Sale"
                          ? "For Sale"
                          : "Short Let"}
                      </Badge>
                      <Badge>
                        {property.is_featured ? (
                          <Badge bg="yellow.100" fontSize="xs">
                            ⭐ Featured
                          </Badge>
                        ) : property.is_published ? (
                          <Badge bg="green.100" fontSize="xs">
                            <CheckIcon boxSize={2} mr={1} /> Published
                          </Badge>
                        ) : (
                          <Badge bg="gray.100" fontSize="xs">
                            <CloseIcon boxSize={2} mr={1} /> Draft
                          </Badge>
                        )}
                      </Badge>
                    </HStack>
                  </Box>

                  <Divider />

                  {/* Property Details */}
                  <VStack align="stretch" spacing={2} fontSize="sm">
                    <HStack justify="space-between">
                      <Text fontWeight="600" color="purple.600">
                        {formatPrice(property.price, (property.currency as "NGN" | "USD") || "NGN")}
                      </Text>
                        <Text fontWeight="500">
                        {new Date(property.created_at).toLocaleDateString()}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </VStack>
        ) : (
          // Desktop Table View
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Category</Th>
                  <Th>Title</Th>
                  <Th>Price</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {recentProperties.map((property) => (
                  <Tr key={property.id} _hover={{ bg: "gray.50" }}>
                    <Td>
                      <Badge
                        bg={
                          property.category === "Properties To Let"
                            ? "green.100"
                            : property.category === "Properties For Sale"
                            ? "orange.100"
                            : "blue.100"
                        }
                        fontSize="xs"
                      >
                        {property.category === "Properties To Let"
                          ? "To Let"
                          : property.category === "Properties For Sale"
                          ? "For Sale"
                          : "Short Let"}
                      </Badge>
                    </Td>
                    <Td>
                      <Text noOfLines={1} fontSize="sm">
                        {property.title}
                      </Text>
                    </Td>
                    <Td fontWeight="600" fontSize="sm">
                      {formatPrice(property.price, (property.currency as "NGN" | "USD") || "NGN")}
                    </Td>
                    <Td color="gray.600" fontSize="sm">
                      {new Date(property.created_at).toLocaleDateString()}
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
