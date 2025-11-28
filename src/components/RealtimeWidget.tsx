// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { FiDatabase, FiZap, FiRefreshCw, FiCheck } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";

interface RealtimeEvent {
  id: string;
  type: string;
  table: string;
  timestamp: Date;
  data: any;
}

export const RealtimeVisualization = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [listenCount, setListenCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    const statusChannel = supabase
      .channel('status_check')
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    const tables = ['properties', 'notifications', 'search_requests', 'users'];
    const channels: any[] = [];

    tables.forEach(table => {
      const channel = supabase
        .channel(`${table}_events`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
          },
          (payload) => {
            const newEvent: RealtimeEvent = {
              id: Math.random().toString(36).substr(2, 9),
              type: payload.eventType,
              table: table,
              timestamp: new Date(),
              data: payload.new || payload.old,
            };

            setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
            setListenCount(prev => prev + 1);

            console.log(`🔥 REALTIME EVENT: ${table} - ${payload.eventType}`, payload);
          }
        )
        .subscribe();

      channels.push(channel);
    });

    return () => {
      supabase.removeChannel(statusChannel);
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { 
            transform: translateX(-20px); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }
      `}</style>

      <Box
        position="fixed"
        bottom={4}
        right={4}
        zIndex={9999}
        bg="white"
        borderRadius="xl"
        boxShadow="2xl"
        maxW="400px"
        borderWidth="2px"
        borderColor={isConnected ? "green.400" : "gray.300"}
        overflow="hidden"
      >
        <Flex
          bg={isConnected ? "green.500" : "gray.500"}
          color="white"
          p={4}
          align="center"
          justify="space-between"
        >
          {/* <HStack spacing={2}>
            <Box
              as={Icon}
              icon={FiZap}
              boxSize={5}
              sx={{
                animation: isConnected ? 'pulse 2s ease-in-out infinite' : 'none'
              }}
            >
              <FiZap />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="700">
                Real-time Monitor
              </Text>
              <Text fontSize="xs" opacity={0.9}>
                {isConnected ? "Connected" : "Disconnected"}
              </Text>
            </VStack>
          </HStack> */}
          <Badge colorScheme="whiteAlpha" fontSize="lg">
            {listenCount}
          </Badge>
        </Flex>

        <Box p={4} bg="gray.50">
          <VStack spacing={3} align="stretch">
            <HStack spacing={2}>
              <Box bg="blue.100" p={2} borderRadius="md" flex={1} textAlign="center">
                <Icon as={FiDatabase} color="blue.600" mb={1} />
                <Text fontSize="xs" fontWeight="600">Database Change</Text>
              </Box>
              <Text fontSize="xl">→</Text>
              <Box bg="purple.100" p={2} borderRadius="md" flex={1} textAlign="center">
                <Icon as={FiZap} color="purple.600" mb={1} />
                <Text fontSize="xs" fontWeight="600">WebSocket Event</Text>
              </Box>
            </HStack>

            <HStack justify="center">
              <Text fontSize="xl">↓</Text>
            </HStack>

            <HStack spacing={2}>
              <Box bg="green.100" p={2} borderRadius="md" flex={1} textAlign="center">
                <Icon as={FiRefreshCw} color="green.600" mb={1} />
                <Text fontSize="xs" fontWeight="600">Auto Re-fetch</Text>
              </Box>
              <Text fontSize="xl">→</Text>
              <Box bg="orange.100" p={2} borderRadius="md" flex={1} textAlign="center">
                <Icon as={FiCheck} color="orange.600" mb={1} />
                <Text fontSize="xs" fontWeight="600">UI Updates</Text>
              </Box>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        <Box p={4} maxH="300px" overflowY="auto">
          <Text fontSize="xs" fontWeight="700" mb={3} color="gray.600">
            RECENT EVENTS (Last 10)
          </Text>
          
          {events.length === 0 ? (
            <Text fontSize="xs" color="gray.500" textAlign="center" py={4}>
              Waiting for changes...
              <br />
              Try adding/editing a property or notification
            </Text>
          ) : (
            <VStack spacing={2} align="stretch">
              {events.map((event) => (
                <Box
                  key={event.id}
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  borderLeft="3px solid"
                  borderColor={
                    event.type === 'INSERT' ? 'green.400' :
                    event.type === 'UPDATE' ? 'blue.400' : 'red.400'
                  }
                  sx={{ animation: 'slideIn 0.3s ease-out' }}
                >
                  <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={0} flex={1}>
                      <HStack spacing={2}>
                        <Badge
                          colorScheme={
                            event.type === 'INSERT' ? 'green' :
                            event.type === 'UPDATE' ? 'blue' : 'red'
                          }
                          fontSize="xs"
                        >
                          {event.type}
                        </Badge>
                        <Text fontSize="xs" fontWeight="600">{event.table}</Text>
                      </HStack>
                      <Text fontSize="xs" color="gray.600" mt={1}>
                        {event.data?.title || event.data?.email || event.data?.name || 'Data changed'}
                      </Text>
                    </VStack>
                    <Text fontSize="xs" color="gray.500">
                      {event.timestamp.toLocaleTimeString()}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        <Box bg="gray.50" p={3} borderTop="1px solid" borderColor="gray.200">
          <Text fontSize="xs" color="gray.600" textAlign="center">
            💡 No page reload needed - updates happen automatically via WebSocket
          </Text>
        </Box>
      </Box>
    </>
  );
};