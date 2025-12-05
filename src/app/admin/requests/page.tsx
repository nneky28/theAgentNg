
// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Text,
  Flex,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Divider,
  Icon,
  ModalFooter,
  Alert,
  AlertIcon,
  useBreakpointValue,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, ViewIcon } from "@chakra-ui/icons";
import { FiBell } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";
import { formatPrice, formatTitleCase } from "@/utils/Method";

interface SearchRequest {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  state: string;
  city: string;
  area: string;
  property_type: string;
  purpose: string;
  condition: string;
  min_budget: string;
  max_budget: string;
  capacity: string;
  category: string;
  created_at: string;
  notified: boolean;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<SearchRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SearchRequest | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifying, setNotifying] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const supabase = createClient();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("search_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching requests",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request: SearchRequest) => {
    setSelectedRequest(request);
    onOpen();
  };

  const handleNotifyAgents = async (request: SearchRequest) => {
    setNotifying(true);
    const supabase = createClient();

    try {
      // Find agents in the same city/state
      const { data: agents, error: agentsError } = await supabase
        .from("users")
        .select("id, email, username, whatsapp_no")
        .eq("role", "agent")
        .eq("state", request.state);

      if (agentsError) throw agentsError;

      if (!agents || agents.length === 0) {
        toast({
          title: "No agents found",
          description: `No agents found in ${request.city}, ${request.state}`,
          status: "warning",
          duration: 5000,
        });
        setNotifying(false);
        return;
      }

      // Filter agents by city if they have cities array
      const matchingAgents = agents.filter((agent: any) => {
        if (agent.cities && Array.isArray(agent.cities)) {
          return agent.cities.includes(request.city);
        }
        return true; // Include agents without specific cities
      });

      if (matchingAgents.length === 0) {
        toast({
          title: "No agents found",
          description: `No agents found specifically in ${request.city}`,
          status: "warning",
          duration: 5000,
        });
        setNotifying(false);
        return;
      }

      // Create notifications for each matching agent
      const notifications = matchingAgents.map((agent: any) => ({
        agent_id: agent.id,
        request_id: request.id,
        title: "New Property Request",
        message: `${request.name} is looking for ${formatTitleCase(request.category)}, ${request.property_type} in ${request.city}, ${request.state}`,
        type: "property_request",
        request_data: {
          client_name: `${request.name}`,
          whatsapp: request.whatsapp,
          email: request.email,
          location: `${request.city}, ${request.state}`,
          area: request.area,
          property_type: request.property_type,
          purpose: request.purpose,
          budget: `${formatPrice(request.min_budget)} - ${formatPrice(request.max_budget)}`,
          category: request.category,
        },
        is_read: false,
        created_at: new Date().toISOString(),
      }));

      const { error: notifError } = await supabase
        .from("notifications")
        .insert(notifications);

      if (notifError) throw notifError;

      // Mark request as notified
      const { error: updateError } = await supabase
        .from("search_requests")
        .update({ notified: true })
        .eq("id", request.id);

      if (updateError) throw updateError;

      toast({
        title: "Agents notified!",
        description: `${matchingAgents.length} agent(s) in ${request.city} have been notified`,
        status: "success",
        duration: 5000,
      });

      fetchRequests();
    } catch (error: any) {
      console.error("Error notifying agents:", error);
      toast({
        title: "Error notifying agents",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setNotifying(false);
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      `${request.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.whatsapp.includes(searchTerm) ||
      request.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("FilteredRequests:", filteredRequests);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        flexDir={{ base: "column", sm: "row" }}
        gap={4}
      >
        <Heading size={{ base: "md", md: "lg" }}>Client Requests</Heading>
        <Badge
          colorScheme="purple"
          fontSize={{ base: "sm", md: "md" }}
          px={3}
          py={1}
        >
          {requests.length} Total Requests
        </Badge>
      </Flex>

      <Input
        placeholder="Search by name, phone, or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={6}
        size={{ base: "md", md: "lg" }}
      />

      {filteredRequests.length === 0 ? (
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="gray.200"
          p={12}
        >
          <Text textAlign="center" color="gray.500" fontSize="lg">
            {searchTerm ? "No requests match your search" : "No requests found"}
          </Text>
        </Box>
      ) : isMobile ? (
        // Mobile Card View
        <VStack spacing={4} align="stretch">
          {filteredRequests.map((request) => (
            <Box
              key={request.id}
              bg="white"
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.200"
              p={4}
              _hover={{ boxShadow: "md" }}
              transition="all 0.2s"
            >
              <VStack align="stretch" spacing={3}>
                <Flex justify="space-between" align="start">
                  <Box flex="1">
                    <Text fontWeight="600" fontSize="lg" mb={1}>
                      {request.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {request.whatsapp}
                    </Text>
                  </Box>
                  <Badge
                    colorScheme={request.notified ? "green" : "yellow"}
                    ml={2}
                  >
                    {request.notified ? "Notified" : "Pending"}
                  </Badge>
                </Flex>

                <Divider />

                <Stack spacing={2} fontSize="sm">
                  <HStack justify="space-between">
                    <Text fontWeight="500">{request.category}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="500">
                      {request.city}, {request.state}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="500">{request.property_type}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>
                      {new Date(request.created_at).toLocaleDateString()}
                    </Text>
                  </HStack>
                </Stack>

                <Divider />

                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    variant="outline"
                    flex="1"
                    leftIcon={<ViewIcon />}
                    onClick={() => handleViewDetails(request)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    flex="1"
                    leftIcon={<Icon as={FiBell} />}
                    onClick={() => handleNotifyAgents(request)}
                    isDisabled={request.notified || notifying}
                    isLoading={notifying}
                  >
                    {request.notified ? "Notified" : "Notify"}
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </VStack>
      ) : (
        // Desktop Table View
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="gray.200"
          overflowX="auto"
        >
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Category</Th>
                <Th>Location</Th>
                <Th>Name</Th>
                <Th>WhatsApp</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody fontSize="sm">
              {filteredRequests.map((request) => (
                <Tr key={request.id} _hover={{ bg: "gray.50" }}>
                  <Td>
                    <Badge
                      bg={
                        request.category === "Properties To Let"
                          ? "green.100"
                          : request.category === "Properties For Sale"
                          ? "orange.100"
                          : request.category === "Short Let Apartment"
                          ? "blue.100"
                          : "purple.100"
                      }
                    >
                      {request.category === "Properties To Let" ? "To Let" : request.category === "Properties For Sale" ? "For Sale" : request.category === "Short Let Apartment" ? "Short Let" : `${request.category}`
                        }
                    </Badge>
                  </Td>
                  <Td>{`${request.city}, ${request.state}`}</Td>
                  <Td fontWeight="500">
                    {request.name}
                  </Td>
                  <Td>{request.whatsapp}</Td>
                  <Td>
                    <Badge colorScheme={request.notified ? "green" : "yellow"}>
                      {request.notified ? "Notified" : "Pending"}
                    </Badge>
                  </Td>
                  <Td>{new Date(request.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<ChevronDownIcon />}
                        size="sm"
                        colorScheme="purple"
                        aria-label="Actions"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<ViewIcon />}
                          onClick={() => handleViewDetails(request)}
                        >
                          View Details
                        </MenuItem>
                        <MenuItem
                          icon={<Icon as={FiBell} />}
                          onClick={() => handleNotifyAgents(request)}
                          isDisabled={request.notified || notifying}
                        >
                          {request.notified
                            ? "Already Notified"
                            : "Notify Agents"}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "full", md: "2xl" }}
      >
        <ModalOverlay />
        <ModalContent m={{ base: 0, md: 4 }}>
          <ModalHeader>Request Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedRequest && (
              <VStack spacing={4} align="stretch">
                <Alert
                  status={selectedRequest.notified ? "success" : "info"}
                  borderRadius="md"
                >
                  <AlertIcon />
                  {selectedRequest.notified
                    ? "Agents have been notified about this request"
                    : "Agents have not been notified yet"}
                </Alert>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2} fontWeight="600">
                    Client Information
                  </Text>
                  <VStack align="stretch" spacing={2} pl={2}>
                    <HStack flexWrap="wrap">
                      <Text fontWeight="600" minW="120px" fontSize="sm">
                        Full Name:
                      </Text>
                      <Text fontSize="sm">
                        {selectedRequest.first_name} {selectedRequest.last_name}
                      </Text>
                    </HStack>
                    <HStack flexWrap="wrap">
                      <Text fontWeight="600" minW="120px" fontSize="sm">
                        WhatsApp:
                      </Text>
                      <Text fontSize="sm">{selectedRequest.whatsapp}</Text>
                    </HStack>
                    <HStack flexWrap="wrap">
                      <Text fontWeight="600" minW="120px" fontSize="sm">
                        Email:
                      </Text>
                      <Text fontSize="sm">
                        {selectedRequest.email || "Not provided"}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2} fontWeight="600">
                    Property Requirements
                  </Text>
                  <VStack align="stretch" spacing={2} pl={2}>
                    <HStack flexWrap="wrap">
                      <Text fontWeight="600" minW="120px" fontSize="sm">
                        Category:
                      </Text>
                      <Badge colorScheme="blue">
                        {selectedRequest.category}
                      </Badge>
                    </HStack>
                    <HStack flexWrap="wrap">
                      <Text fontWeight="600" minW="120px" fontSize="sm">
                        Property Type:
                      </Text>
                      <Text fontSize="sm">{selectedRequest.property_type}</Text>
                    </HStack>
                    <HStack flexWrap="wrap">
                      <Text fontWeight="600" minW="120px" fontSize="sm">
                        Purpose:
                      </Text>
                      <Text fontSize="sm">{selectedRequest.purpose}</Text>
                    </HStack>
                    {selectedRequest.capacity && (
                      <HStack flexWrap="wrap">
                        <Text fontWeight="600" minW="120px" fontSize="sm">
                          Capacity:
                        </Text>
                        <Text fontSize="sm">{selectedRequest.capacity}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2} fontWeight="600">
                    Location
                  </Text>
                  <VStack align="stretch" spacing={2} pl={2}>
                    <HStack flexWrap="wrap">
                      <Text fontWeight="600" minW="120px" fontSize="sm">
                        State:
                      </Text>
                      <Text fontSize="sm">{selectedRequest.state}</Text>
                    </HStack>
                    <HStack flexWrap="wrap">
                      <Text fontWeight="600" minW="120px" fontSize="sm">
                        City:
                      </Text>
                      <Text fontSize="sm">{selectedRequest.city}</Text>
                    </HStack>
                    {selectedRequest.area && (
                      <HStack flexWrap="wrap">
                        <Text fontWeight="600" minW="120px" fontSize="sm">
                          Area:
                        </Text>
                        <Text fontSize="sm">{selectedRequest.area}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2} fontWeight="600">
                    Budget
                  </Text>
                  <VStack align="stretch" spacing={2} pl={2}>
                    <HStack flexWrap="wrap">
                      <Text fontWeight="600" minW="120px" fontSize="sm">
                        Budget Range:
                      </Text>
                      <Text fontSize="sm">
                        ₦{selectedRequest.min_budget} - ₦
                        {selectedRequest.max_budget}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <HStack flexWrap="wrap">
                    <Text fontWeight="600" minW="120px" fontSize="sm">
                      Submitted:
                    </Text>
                    <Text fontSize="sm">
                      {new Date(selectedRequest.created_at).toLocaleString()}
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter flexWrap="wrap" gap={2}>
            {selectedRequest && !selectedRequest.notified && (
              <Button
                colorScheme="purple"
                leftIcon={<Icon as={FiBell} />}
                onClick={() => {
                  handleNotifyAgents(selectedRequest);
                  onClose();
                }}
                isLoading={notifying}
                size={{ base: "sm", md: "md" }}
              >
                Notify Agents
              </Button>
            )}
            <Button onClick={onClose} size={{ base: "sm", md: "md" }}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Container>
  );
}
