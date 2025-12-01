"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Flex,
  Spinner,
  Text,
  VStack,
  HStack,
  Icon,
  Avatar,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaHome, FaUsers, FaBuilding, FaSignOutAlt } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { FiBell } from "react-icons/fi";


interface UserData {
  role: string;
  is_onboarded: boolean;
  email?: string;
}

interface NavItemProps {
  icon: any;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, href, isActive, onClick }: NavItemProps) => {
  return (
    <Link href={href} style={{ width: "100%" }} onClick={onClick}>
      <Flex
        align="center"
        px={4}
        py={3}
        cursor="pointer"
        bg={isActive ? "purple.50" : "transparent"}
        color={isActive ? "purple.600" : "gray.700"}
        fontWeight={isActive ? "600" : "normal"}
        borderLeft={isActive ? "4px solid" : "4px solid transparent"}
        borderLeftColor={isActive ? "purple.600" : "transparent"}
        _hover={{
          bg: "purple.50",
          color: "purple.600",
        }}
        transition="all 0.2s"
      >
        <Icon as={icon} mr={3} boxSize={5} />
        <Text>{label}</Text>
      </Flex>
    </Link>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const INACTIVITY_TIME = 45 * 60 * 1000; // 45 minutes
  const WARNING_TIME = 44 * 60 * 1000; // Show warning at 44 minutes (1 minute before logout)

  const navItems = [
    { icon: FaHome, label: "Dashboard", href: "/admin" },
    { icon: FaBuilding, label: "Properties", href: "/admin/properties" },
    { icon: FaUsers, label: "Agents", href: "/admin/agents" },
    { icon: FiBell, label: "Requests", href: "/admin/requests" },
  ];
  
  useEffect(() => {
    checkAdminRole();
  }, []);

  // Inactivity logout logic
  useEffect(() => {
    if (!isAdmin) return;

    const handleLogoutDueToInactivity = async () => {
      clearAllTimers();
      
      toast({
        title: "Logged out due to inactivity",
        description: "You've been logged out after 45 minutes of inactivity",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    };

    const showWarningModal = () => {
      setShowWarning(true);
      setCountdown(60);
      
      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const resetInactivityTimer = () => {
      // Clear existing timers
      clearAllTimers();
      setShowWarning(false);

      // Set warning timer (1 minute before logout)
      warningTimerRef.current = setTimeout(() => {
        showWarningModal();
      }, WARNING_TIME);

      // Set logout timer
      inactivityTimerRef.current = setTimeout(() => {
        handleLogoutDueToInactivity();
      }, INACTIVITY_TIME);
    };

    const clearAllTimers = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };

    // Activity events
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'mousemove'];
    
    events.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Start the timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      clearAllTimers();
      events.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [isAdmin]);

  const checkAdminRole = async () => {
    const supabase = createClient();

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/");
        return;
      }

      const { data: userData, error: dbError } = await supabase
        .from("users")
        .select("role, is_onboarded, email")
        .eq("id", user.id)
        .single<UserData>();

      if (dbError || !userData) {
        router.push("/");
        return;
      }

      if (userData.role !== "admin") {
        router.push("/dashboard/agent");
        return;
      }

      setUserData(userData);
      setIsAdmin(true);
      if (!pathname.startsWith("/admin")) {
       router.replace("/admin");
      }
    } catch (error) {
      console.error("Error in admin check:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 2000,
      });
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    // This will trigger the activity event and reset all timers
    window.dispatchEvent(new Event('click'));
  };

  if (loading) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="100vh"
        direction="column"
        gap={4}
      >
        <Spinner size="xl" color="purple.500" thickness="4px" />
        <Text>Verifying admin access...</Text>
      </Flex>
    );
  }
  if (!isAdmin) {
    return (
      <Flex
      justify="center"
      align="center"
      minH="100vh"
      direction="column"
      gap={4}
      >
        <Spinner size="xl" color="purple.500" />
        <Text>Redirecting...</Text>
      </Flex>
    );
  }
  
  const SidebarContent = () => (
    <VStack h="100%" spacing={0} align="stretch">
      <Box p={6} borderBottom="1px" borderColor="gray.200">
        <Image
          w={["26px", "96px"]}
          src="/images/L1.png"
          objectFit="contain"
          transition="all 0.3s ease"
          alt="TheAgent Logo"
          px={4}
          />
      </Box>

      {/* Navigation */}
    <VStack flex={1} spacing={1} py={4} align="stretch" p={4}>
      {navItems.map((item) => {
        const isActive = item.href === "/admin" 
          ? pathname === "/admin" 
          : pathname === item.href;

        return (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={isActive}
            onClick={isOpen ? onClose : undefined} // <-- Close drawer on mobile
          />
        );
      })}
    </VStack>

      {/* User Profile & Logout */}
      <Box p={4} borderTop="1px" borderColor="gray.200">
        <HStack align="start" spacing={3}>
          <Avatar size="sm" name={userData?.email || "Admin"} />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="sm" fontWeight="600" noOfLines={1}>
              {userData?.email || "Admin"}
            </Text>
            <Text fontSize="xs" color="gray.500" mb={2}>
              Super Admin
            </Text>
            <Button
              leftIcon={<FaSignOutAlt />}
              onClick={handleLogout}
              colorScheme="red"
              variant="ghost"
              size="sm"
              alignSelf="start" 
              mt={2}
              // p={0}
            >
              Logout
            </Button>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  );
  
  return (
    <>
      <Flex h="100vh" overflow="hidden">
  
        {/* Desktop Sidebar */}
        <Box
          w="280px"
          bg="white"
          borderRight="1px"
          borderColor="gray.200"
          display={{ base: "none", lg: "block" }}
          position="fixed"
          h="100vh"
        >
          <SidebarContent />
        </Box>

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
            <DrawerBody p={0}>
              <SidebarContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content */}
        <Box flex={1} ml={{ base: 0, lg: "280px" }} bg="gray.50" overflowY="auto">
          {/* Mobile Header */}
          <Flex
            display={{ base: "flex", lg: "none" }}
            bg="white"
            p={4}
            borderBottom="1px"
            borderColor="gray.200"
            align="center"
            position="sticky"
            top={0}
            zIndex={10}
          >
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
              mr={3}
            />
            <Image
              w={["26px", "96px"]}
              src="/images/L1.png"
              objectFit="contain"
              transition="all 0.3s ease"
              alt="TheAgent Logo"
              px={4}
            />
          </Flex>

          {/* Page Content */}
          <Box p={{ base: 4, md: 8 }}>{children}</Box>
        </Box>
      </Flex>

      {/* Inactivity Warning Modal */}
      <Modal 
        isOpen={showWarning} 
        onClose={() => {}} 
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent>
          <ModalHeader>Session Timeout Warning</ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="start">
              <Text>
                You've been inactive for a while. You will be automatically logged out in:
              </Text>
              <Box 
                w="100%" 
                p={4} 
                bg="orange.50" 
                borderRadius="md" 
                textAlign="center"
              >
                <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                  {countdown}s
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.600">
                Click "Stay Logged In" to continue your session.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="purple" 
              onClick={handleStayLoggedIn}
              w="100%"
            >
              Stay Logged In
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}