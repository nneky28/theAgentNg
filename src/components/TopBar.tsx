
import {
  Box,
  Flex,
  Image,
  HStack,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  useToast,
  Text
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { FiBell, FiEdit, FiTrash2, FiLogOut, FiMenu } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { colors } from "@/utils/color";

const TopBar = () => {
  const router = useRouter();
  const toast = useToast();
  const [notificationCount, setNotificationCount] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUserAndNotifications();
    setupRealtimeSubscription();
  }, []);

  const fetchUserAndNotifications = async () => {
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserEmail(user.email || "");

      // Fetch unread notification count
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      setNotificationCount(count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const supabase = createClient();
    
    const channel = supabase
      .channel('topbar_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          fetchUserAndNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        status: "success",
        duration: 2000,
      });
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleEditProfile = () => {
    router.push("/dashboard/agent/settings");
  };

  const handleNotifications = () => {
    router.push("/dashboard/agent/notifications");
  };

  const handleDeleteProfile = async () => {
    if (!userEmail) return;

    setIsDeleting(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Delete user from public.users table
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (deleteError) throw deleteError;

      // Delete from auth.users (requires admin privileges or RLS policy)
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) {
        console.warn("Could not delete auth user:", authError);
        // Continue with sign out even if auth deletion fails
      }

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Sign out and redirect
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      onDeleteClose();
    }
  };

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p="20px"
        position="fixed"
        top={0}
        left={0}
        right={0}
        bg="white"
        zIndex={1000}
        px={{ base: "20px", md: "80px" }}
        py="20px"
        boxShadow="sm"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <Box cursor="pointer" onClick={() => router.push("/dashboard/agent")}>
          <Image
            w={["26px", "66px"]}
            src="/images/L1.png"
            objectFit="contain"
            transition="all 0.3s ease"
            alt="TheAgent Logo"
          />
        </Box>

        <HStack spacing={4}>
          <Box position="relative">
            <IconButton
              aria-label="Notifications"
              icon={<FiBell />}
              variant="ghost"
              fontSize="20px"
              color="gray.600"
              _hover={{ bg: "gray.100", color: colors.primary }}
              position="relative"
              onClick={handleNotifications}
            />
            {notificationCount > 0 && (
              <Badge
                position="absolute"
                top="1"
                right="1"
                colorScheme="red"
                borderRadius="full"
                fontSize="10px"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </Badge>
            )}
          </Box>

          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMenu />}
              variant="ghost"
              fontSize="20px"
              color="gray.600"
              _hover={{ bg: "gray.100", color: "#724B9B" }}
              aria-label="Menu"
            />

            <MenuList boxShadow="lg" borderRadius="xl" py={2}>
              <MenuItem 
                icon={<FiEdit />} 
                fontSize="14px"
                onClick={handleEditProfile}
              >
                Edit Profile
              </MenuItem>
              <MenuItem 
                icon={<FiTrash2 />} 
                fontSize="14px"
                color="red.500"
                onClick={onDeleteOpen}
              >
                Delete Profile
              </MenuItem>

              <MenuDivider />

              <MenuItem
                icon={<FiLogOut />}
                fontSize="14px"
                onClick={handleSignOut}
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete your account? This action cannot be undone.
              All your properties and data will be permanently deleted.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteProfile}
              isLoading={isDeleting}
              loadingText="Deleting..."
            >
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TopBar;