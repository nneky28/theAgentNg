// // @ts-nocheck
// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Flex,
//   useToast,
//   Drawer,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerHeader,
//   DrawerBody,
//   Image,
// } from "@chakra-ui/react";
// import { usePathname, useRouter } from "next/navigation";
// import TopBar from "@/components/TopBar";
// import Sidebar from "@/components/SideBar";
// import { createClient } from "@/utils/supabase/client";

// interface SidebarItem {
//   label: string;
//   path: string;
//   badge?: number;
// }

// const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   const [unreadNotifications, setUnreadNotifications] = useState(0);
//   const [userImage, setUserImage] = useState<string | undefined>(undefined);
//   const [active, setActive] = useState("Home");
//   const [isDrawerOpen, setDrawerOpen] = useState(false);

//   const pathname = usePathname();
//   const router = useRouter();
//   const toast = useToast();

//   const sidebarItems: SidebarItem[] = [
//     { label: "Home", path: "/dashboard/agent" },
//     { label: "Properties", path: "/dashboard/agent#properties" },
//     { label: "FAQs", path: "/dashboard/agent/faqs" },
//     {
//       label: "Notifications",
//       path: "/dashboard/agent/notifications",
//       badge: unreadNotifications,
//     },
//     { label: "Settings", path: "/dashboard/agent/settings" },
//   ];

//   useEffect(() => {
//     fetchUserData();
//     fetchUnreadNotifications();
//     const cleanup = setupRealtimeSubscription();

//     return () => {
//       if (cleanup) cleanup();
//     };
//   }, []);

//   // FIXED: Simplified active state detection
//   useEffect(() => {
//     // Handle hash-based paths
//     const hash = typeof window !== "undefined" ? window.location.hash : "";
//     const fullPath = hash ? pathname + hash : pathname;

//     // Find matching item
//     const currentItem = sidebarItems.find((item) => {
//       if (item.path.includes("#")) {
//         return fullPath === item.path;
//       }
//       return pathname === item.path;
//     });

//     if (currentItem) {
//       setActive(currentItem.label);
//     } else if (pathname === "/dashboard/agent") {
//       setActive("Home");
//     }
//   }, [pathname]);

//   const fetchUserData = async () => {
//     const supabase = createClient();

//     try {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();
//       if (userError || !user) return;

//       const picture =
//         user.user_metadata?.picture || user.user_metadata?.avatar_url || "";
//       setUserImage(picture);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   const fetchUnreadNotifications = async () => {
//     const supabase = createClient();

//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;

//       const { count, error } = await supabase
//         .from("notifications")
//         .select("*", { count: "exact", head: true })
//         .eq("agent_id", user.id)
//         .eq("is_read", false);

//       if (error) throw error;
//       setUnreadNotifications(count || 0);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   const setupRealtimeSubscription = () => {
//     const supabase = createClient();

//     const channel = supabase
//       .channel("agent_notifications")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "notifications",
//         },
//         (payload) => {
//           const checkIfForCurrentUser = async () => {
//             const {
//               data: { user },
//             } = await supabase.auth.getUser();
//             if (user && payload.new.agent_id === user.id) {
//               fetchUnreadNotifications();

//               toast({
//                 title: "New Notification",
//                 description: payload.new.title || "You have a new notification",
//                 status: "info",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "top-right",
//               });
//             }
//           };

//           checkIfForCurrentUser();
//         }
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "notifications",
//         },
//         () => {
//           fetchUnreadNotifications();
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   };


//   const handleNavClick = (label: string, path: string) => {
//     setActive(label);
//     if (path.includes("#")) {
//       const [basePath, hashPart] = path.split("#");
//       if (pathname === basePath) {
//         const element = document.getElementById(hashPart);
//         if (element) {
//           element.scrollIntoView({ behavior: "smooth", block: "start" });
//         }
//       } else {
//         router.push(basePath);
//         setTimeout(() => {
//           const element = document.getElementById(hashPart);
//           if (element) {
//             element.scrollIntoView({ behavior: "smooth", block: "start" });
//           }
//         }, 100);
//       }
//     } else {
//       router.push(path);
//     }
//   };
//   return (
//     <Box bg="#fff" boxShadow="md" pb="20px" px={"20px"}>
//       <TopBar setDrawerOpen={setDrawerOpen} />

//       {/* Sidebar - Fixed position */}
//       <Box
//         display={{ base: "none", md: "block" }}
//         width={{ md: "250px", lg: "280px" }}
//         position="fixed"
//         top="100px"
//         left={0}
//         height={`calc(100vh - 100px)`}
//         bg="white"
//         zIndex={10}
//         boxShadow="sm"
//       >
//         <Sidebar
//           sidebarItems={sidebarItems}
//           active={active}
//           onSetActive={handleNavClick}
//           userImage={userImage}
//         />
//       </Box>

//       {/* Drawer - Mobile Sidebar */}
//       <Drawer
//         isOpen={isDrawerOpen}
//         placement="left"
//         onClose={() => setDrawerOpen(false)}
//         size="xs"
//       >
//         <DrawerOverlay />
//         <DrawerContent>
//           <DrawerHeader borderBottomWidth="1px">
//             <Image
//               w={["50px", "80px"]}
//               src="/images/L1.png"
//               objectFit="contain"
//               transition="all 0.3s ease"
//               alt="TheAgent Logo"
//             />
//           </DrawerHeader>
//           <DrawerBody>
//             {/* Sidebar items at the top */}
//             <Sidebar
//               sidebarItems={sidebarItems}
//               active={active}
//               onSetActive={(label, path) => {
//                 handleNavClick(label, path);
//                 setDrawerOpen(false);
//               }}
//               userImage={userImage}
//               isMobile
//             />
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>

//       {/* Main content */}

//       <Box pt="100px">
//         <Flex
//           flexDirection="row"
//           bg="#F3F5F6"
//           borderRadius="12px"
//           px={["12px", "60px"]}
//           py={["12px", "30px"]}
//           h="calc(100vh - 100px)"
//           position="relative"
//           overflow="hidden"
//           gap={{ base: "0", md: "24px" }}
//         >
//           <Box
//             flex="1"
//             overflowY="auto"
//             pb={4}
//             ml={{ md: "250px", lg: "250px" }}
//           >
//             {children}
//           </Box>
//         </Flex>
//       </Box>
//     </Box>
//   );
// };

// export default DashboardLayout;



// @ts-nocheck
"use client";
import React, { useEffect, useState, createContext, useContext } from "react";
import {
  Box,
  Flex,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Image,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/SideBar";
import { createClient } from "@/utils/supabase/client";

interface SidebarItem {
  label: string;
  path: string;
  badge?: number;
}

// Create a context for drawer control
const DrawerContext = createContext<{
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
} | null>(null);

// Hook to use the drawer context
export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within DashboardLayout");
  }
  return context;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [active, setActive] = useState("Home");
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  const sidebarItems: SidebarItem[] = [
    { label: "Home", path: "/dashboard/agent" },
    { label: "Properties", path: "/dashboard/agent#properties" },
    { label: "FAQs", path: "/dashboard/agent/faqs" },
    {
      label: "Notifications",
      path: "/dashboard/agent/notifications",
      badge: unreadNotifications,
    },
    { label: "Settings", path: "/dashboard/agent/settings" },
  ];

  useEffect(() => {
    fetchUserData();
    fetchUnreadNotifications();
    const cleanup = setupRealtimeSubscription();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const fullPath = hash ? pathname + hash : pathname;

    const currentItem = sidebarItems.find((item) => {
      if (item.path.includes("#")) {
        return fullPath === item.path;
      }
      return pathname === item.path;
    });

    if (currentItem) {
      setActive(currentItem.label);
    } else if (pathname === "/dashboard/agent") {
      setActive("Home");
    }
  }, [pathname]);

  const fetchUserData = async () => {
    const supabase = createClient();

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;

      const picture =
        user.user_metadata?.picture || user.user_metadata?.avatar_url || "";
      setUserImage(picture);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUnreadNotifications = async () => {
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("agent_id", user.id)
        .eq("is_read", false);

      if (error) throw error;
      setUnreadNotifications(count || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const setupRealtimeSubscription = () => {
    const supabase = createClient();

    const channel = supabase
      .channel("agent_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const checkIfForCurrentUser = async () => {
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (user && payload.new.agent_id === user.id) {
              fetchUnreadNotifications();

              toast({
                title: "New Notification",
                description: payload.new.title || "You have a new notification",
                status: "info",
                duration: 5000,
                isClosable: true,
                position: "top-right",
              });
            }
          };

          checkIfForCurrentUser();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchUnreadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleNavClick = (label: string, path: string) => {
    setActive(label);
    if (path.includes("#")) {
      const [basePath, hashPart] = path.split("#");
      if (pathname === basePath) {
        const element = document.getElementById(hashPart);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        router.push(basePath);
        setTimeout(() => {
          const element = document.getElementById(hashPart);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    } else {
      router.push(path);
    }
  };

  // Drawer control functions
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <DrawerContext.Provider value={{ isDrawerOpen, openDrawer, closeDrawer }}>
      <Box bg="#fff" boxShadow="md" pb="20px" px={"20px"}>
        <TopBar setDrawerOpen={setDrawerOpen} />

        {/* Sidebar - Fixed position */}
        <Box
          display={{ base: "none", md: "block" }}
          width={{ md: "250px", lg: "280px" }}
          position="fixed"
          top="100px"
          left={0}
          height={`calc(100vh - 100px)`}
          bg="white"
          zIndex={10}
          boxShadow="sm"
        >
          <Sidebar
            sidebarItems={sidebarItems}
            active={active}
            onSetActive={handleNavClick}
            userImage={userImage}
          />
        </Box>

        {/* Drawer - Mobile Sidebar */}
        <Drawer
          isOpen={isDrawerOpen}
          placement="left"
          onClose={closeDrawer}
          size="xs"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              <Image
                w={["50px", "80px"]}
                src="/images/L1.png"
                objectFit="contain"
                transition="all 0.3s ease"
                alt="TheAgent Logo"
              />
            </DrawerHeader>
            <DrawerBody>
              <Sidebar
                sidebarItems={sidebarItems}
                active={active}
                onSetActive={(label, path) => {
                  handleNavClick(label, path);
                  closeDrawer();
                }}
                userImage={userImage}
                isMobile
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main content */}
        <Box pt="100px">
          <Flex
            flexDirection="row"
            bg="#F3F5F6"
            borderRadius="12px"
            px={["12px", "60px"]}
            py={["12px", "30px"]}
            h="calc(100vh - 100px)"
            position="relative"
            overflow="hidden"
            gap={{ base: "0", md: "24px" }}
          >
            <Box
              flex="1"
              overflowY="auto"
              pb={4}
              ml={{ md: "250px", lg: "250px" }}
            >
              {children}
            </Box>
          </Flex>
        </Box>
      </Box>
    </DrawerContext.Provider>
  );
};

export default DashboardLayout;