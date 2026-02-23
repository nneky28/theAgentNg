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
  Avatar,
  HStack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { FiPhone } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";

interface Agent {
  id: string;
  email: string;
  username: string | null;
  whatsapp_no: string | null;
  state: string | null;
  city: string | null;
  is_onboarded: boolean;
  role: string;
  created_at?: string;
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const supabase = createClient();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "agent")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Force state update
      setAgents([]);
      setTimeout(() => {
        setAgents(data || []);
      }, 0);
    } catch (error: unknown) {
      toast({
        title: "Error fetching agents",
        description: error as string,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this agent? This action cannot be undone."
      )
    )
      return;

    const supabase = createClient();

    try {
      // First delete from public.users
      const { error: userError } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (userError) throw userError;

      // Then delete from auth.users (requires admin privileges)
      const { error: authError } = await supabase.auth.admin.deleteUser(id);

      if (authError) {
        console.warn("Could not delete from auth.users:", authError);
        // Continue unknownway as the user record is deleted
      }

      toast({
        title: "Agent deleted successfully",
        status: "success",
        duration: 3000,
      });

      fetchAgents();
    } catch (error: unknown) {
      toast({
        title: "Error deleting agent",
        description: error as string,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    onOpen();
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.city?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Heading size="lg">Agents Management</Heading>
        <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
          {agents.length} Total Agents
        </Badge>
      </Flex>

      <Input
        placeholder="Search agents by name or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={6}
        size="lg"
      />

      {filteredAgents.length === 0 ? (
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="gray.200"
          p={12}
        >
          <Text textAlign="center" color="gray.500" fontSize="lg">
            {searchTerm ? "No agents match your search" : "No agents found"}
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
                <Th>Agent</Th>
                <Th>Contact</Th>
                <Th>Location</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredAgents.map((agent) => (
                <Tr key={agent.id} _hover={{ bg: "gray.50" }}>
                  <Td>
                    <HStack spacing={3}>
                      <Avatar size="sm" name={agent.username || agent.email} />
                      <VStack spacing={0} align="start">
                        <Text fontWeight="600" fontSize="sm">
                          {agent.username || "Not set"}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {agent.email}
                        </Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td>
                    <VStack spacing={1} align="start">
                      {agent.whatsapp_no && (
                        <HStack spacing={2}>
                          <FiPhone size={12} />
                          <Text fontSize="sm">{agent.whatsapp_no}</Text>
                        </HStack>
                      )}
                      {!agent.whatsapp_no && (
                        <Text fontSize="sm" color="gray.400">
                          No phone
                        </Text>
                      )}
                    </VStack>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {agent.city && agent.state
                        ? `${agent.city}, ${agent.state}`
                        : "Not set"}
                    </Text>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={agent.is_onboarded ? "green" : "yellow"}
                    >
                      {agent.is_onboarded ? "Active" : "Pending"}
                    </Badge>
                  </Td>
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
                          onClick={() => handleViewDetails(agent)}
                        >
                          View Details
                        </MenuItem>
                        <MenuItem
                          icon={<DeleteIcon />}
                          color="red.500"
                          onClick={() => handleDeleteAgent(agent.id)}
                        >
                          Delete Agent
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

      {/* Agent Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agent Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAgent && (
              <VStack spacing={4} align="stretch">
                <Flex justify="center" mb={4}>
                  <Avatar
                    size="xl"
                    name={selectedAgent.username || selectedAgent.email}
                  />
                </Flex>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Full Name
                  </Text>
                  <Text fontWeight="600">
                    {selectedAgent.username || "Not provided"}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Email
                  </Text>
                  <Text fontWeight="600">{selectedAgent.email}</Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    WhatsApp Number
                  </Text>
                  <Text fontWeight="600">
                    {selectedAgent.whatsapp_no || "Not provided"}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Location
                  </Text>
                  <Text fontWeight="600">
                    {selectedAgent.city && selectedAgent.state
                      ? `${selectedAgent.city}, ${selectedAgent.state}`
                      : "Not provided"}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Onboarding Status
                  </Text>
                  <Badge
                    colorScheme={
                      selectedAgent.is_onboarded ? "green" : "yellow"
                    }
                  >
                    {selectedAgent.is_onboarded ? "Completed" : "Pending"}
                  </Badge>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Account ID
                  </Text>
                  <Text fontSize="xs" fontFamily="mono" color="gray.500">
                    {selectedAgent.id}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
