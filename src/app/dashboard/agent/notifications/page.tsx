// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Flex,
  Spinner,
  Card,
  CardBody,
  Icon,
  HStack,
  Button,
} from "@chakra-ui/react";
import {  FiCheck } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";
import { colors } from "@/utils/color";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    const supabase = createClient();
    
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
      
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
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
    <Container maxW="container.lg" py={8}>
      <Heading mb={8}>Notifications</Heading>

      {notifications.length === 0 ? (
        <Card>
          <CardBody>
            <Text textAlign="center" color="gray.500" py={8}>
              No notifications yet
            </Text>
          </CardBody>
        </Card>
      ) : (
        <VStack spacing={4} align="stretch">
          {notifications.map((notification: any) => (
            <Card
              key={notification.id}
              bg={notification.is_read ? "white" : 'purple.50'}
              borderLeft="4px"
              borderColor={notification.is_read ? "gray.200" : colors.primary}
            >
              <CardBody>
                <Flex justify="space-between" align="start">
                  <HStack spacing={4} flex={1}>
                  
                    <VStack align="start" spacing={2} flex={1}>
                      <Heading size="sm">{notification.title}</Heading>
                      <Text color="gray.600">{notification.message}</Text>
                      
                      {notification.request_data.budget && (
                        <Box mt={2} p={3} bg="gray.50" borderRadius="md" w="full">
                          <VStack align="start" spacing={1} fontSize="sm">

                            <Text><strong>Budget:</strong> {notification.request_data.budget}</Text>
                            <Text><strong>WhatsApp:</strong> {notification.request_data.whatsapp}</Text>

                          </VStack>
                        </Box>
                      )}
                                            
                      {
                        notification.request_data.budget && (
                          <Text fontSize={'sm'} color="gray.500">If you have a property matching this description, kindly send pictures/videos to the client via WhatsApp.</Text>
                        )
                      }
                      <Text fontSize="xs" color="gray.500">
                        {new Date(notification.created_at).toLocaleString()}
                      </Text>
                    </VStack>
             
                  </HStack>
                  
                </Flex>
              </CardBody>
                   {!notification.is_read && (
                    <Button
                      size="sm"
                      leftIcon={<Icon as={FiCheck} />}
                      colorScheme="purple"
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                      alignSelf={'left'}
                      display={'flex'}
                      justifyContent={'left'}
                    >
                      Mark as read
                    </Button>
                  )}
            </Card>
          ))}
        </VStack>
      )}
    </Container>
  );
}