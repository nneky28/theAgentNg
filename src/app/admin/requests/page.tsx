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
} from "@chakra-ui/react";
import { ChevronDownIcon, ViewIcon } from "@chakra-ui/icons";
import { FiBell } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";

interface SearchRequest {
  id: string;
  first_name: string;
  last_name: string;
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
  const [selectedRequest, setSelectedRequest] = useState<SearchRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifying, setNotifying] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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
        message: `${request.first_name} ${request.last_name} is looking for ${request.property_type} in ${request.city}, ${request.state}`,
        type: "property_request",
        request_data: {
          client_name: `${request.first_name} ${request.last_name}`,
          whatsapp: request.whatsapp,
          email: request.email,
          location: `${request.city}, ${request.state}`,
          area: request.area,
          property_type: request.property_type,
          purpose: request.purpose,
          budget: `₦${request.min_budget} - ₦${request.max_budget}`,
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

  const filteredRequests = requests.filter((request) =>
    `${request.first_name} ${request.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    request.whatsapp.includes(searchTerm) ||
    request.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl">
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Client Requests</Heading>
        <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
          {requests.length} Total Requests
        </Badge>
      </Flex>

      <Input
        placeholder="Search by name, phone, or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={6}
        size="lg"
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
      ) : (
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
                <Th>Date</Th>
                <Th>Full Name</Th>
                <Th>WhatsApp Number</Th>
                <Th>Category</Th>
                <Th>Location</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={'sm'}>
              {filteredRequests.map((request) => (
                <Tr key={request.id} _hover={{ bg: "gray.50" }}>
                  <Td>
                    {new Date(request.created_at).toLocaleDateString()}
                  </Td>
                  <Td fontWeight="500">
                    {request.first_name} {request.last_name}
                  </Td>
                  <Td>{request.whatsapp}</Td>
                  <Td>
                    {request.category}
                  </Td>
                  <Td>{`${request.city}, ${request.state}`}</Td>
                  <Td>
                    <Badge colorScheme={request.notified ? "green" : "yellow"}>
                      {request.notified ? "Notified" : "Pending"}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        size="sm"
                        colorScheme="purple"
                        variant="ghost"
                      >
                        Actions
                      </MenuButton>
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
                          {request.notified ? "Already Notified" : "Notify Agents"}
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
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedRequest && (
              <VStack spacing={4} align="stretch">
                <Alert status={selectedRequest.notified ? "success" : "info"} borderRadius="md">
                  <AlertIcon />
                  {selectedRequest.notified
                    ? "Agents have been notified about this request"
                    : "Agents have not been notified yet"}
                </Alert>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Client Information</Text>
                  <VStack align="stretch" spacing={2} pl={4}>
                    <HStack>
                      <Text fontWeight="600" minW="120px">Full Name:</Text>
                      <Text>{selectedRequest.first_name} {selectedRequest.last_name}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="600" minW="120px">WhatsApp:</Text>
                      <Text>{selectedRequest.whatsapp}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="600" minW="120px">Email:</Text>
                      <Text>{selectedRequest.email || "Not provided"}</Text>
                    </HStack>
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Property Requirements</Text>
                  <VStack align="stretch" spacing={2} pl={4}>
                    <HStack>
                      <Text fontWeight="600" minW="120px">Category:</Text>
                      <Badge colorScheme="blue">{selectedRequest.category}</Badge>
                    </HStack>
                    <HStack>
                      <Text fontWeight="600" minW="120px">Property Type:</Text>
                      <Text>{selectedRequest.property_type}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="600" minW="120px">Purpose:</Text>
                      <Text>{selectedRequest.purpose}</Text>
                    </HStack>
                    {selectedRequest.capacity && (
                      <HStack>
                        <Text fontWeight="600" minW="120px">Capacity:</Text>
                        <Text>{selectedRequest.capacity}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Location</Text>
                  <VStack align="stretch" spacing={2} pl={4}>
                    <HStack>
                      <Text fontWeight="600" minW="120px">State:</Text>
                      <Text>{selectedRequest.state}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="600" minW="120px">City:</Text>
                      <Text>{selectedRequest.city}</Text>
                    </HStack>
                    {selectedRequest.area && (
                      <HStack>
                        <Text fontWeight="600" minW="120px">Area:</Text>
                        <Text>{selectedRequest.area}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Budget</Text>
                  <VStack align="stretch" spacing={2} pl={4}>
                    <HStack>
                      <Text fontWeight="600" minW="120px">Budget Range:</Text>
                      <Text>₦{selectedRequest.min_budget} - ₦{selectedRequest.max_budget}</Text>
                    </HStack>
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <HStack>
                    <Text fontWeight="600" minW="120px">Submitted:</Text>
                    <Text>{new Date(selectedRequest.created_at).toLocaleString()}</Text>
                  </HStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            {selectedRequest && !selectedRequest.notified && (
              <Button
                colorScheme="purple"
                leftIcon={<Icon as={FiBell} />}
                onClick={() => {
                  handleNotifyAgents(selectedRequest);
                  onClose();
                }}
                isLoading={notifying}
                mr={3}
              >
                Notify Agents
              </Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}