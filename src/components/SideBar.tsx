
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Icon,
  Text,
  Avatar,
  useToast,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { RxDashboard } from "react-icons/rx";
import { colors } from "@/utils/color";
import { BiLogOutCircle } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface SidebarProps {
  sidebarItems: { label: string; path: string; badge?: number }[];
  active: string;
  onSetActive: (label: string, path: string) => void;
  userImage?: string;
}

interface UserProfile {
  email: string;
  username: string;
  whatsapp_no: string;
  state: string;
  cities: string[];
  full_name: string;
  picture: string;
  avatar_url: string;
}

const Sidebar = ({
  active,
  sidebarItems,
  onSetActive,
 
}: SidebarProps) => {
  const toast = useToast();
  const router = useRouter();
  const accentColor = "#724B9B";
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const supabase = createClient();
    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setIsLoading(false);
        return;
      }

      const fullName =
        user.user_metadata?.full_name || user.user_metadata?.name || "";
      const picture =
        user.user_metadata?.picture || user.user_metadata?.avatar_url || "";
      const email = user.email || "";
      const metaUsername = user.user_metadata?.username || "";
      const metaWhatsapp = user.user_metadata?.whatsapp_no || "";
      const avatar_url = user.user_metadata?.avatar_url || "";

      type DBUser = {
        username?: string;
        whatsapp_no?: string;
        state?: string;
        cities?: string[];
      };

      const { data: dbData} = await supabase
        .from("users")
        .select("username, whatsapp_no, state, cities")
        .eq("id", user.id)
        .single<DBUser>();

      setUserProfile({
        email,
        username: dbData?.username || metaUsername || "",
        whatsapp_no: dbData?.whatsapp_no || metaWhatsapp || "",
        state: dbData?.state || "",
        cities: dbData?.cities || [],
        full_name: fullName,
        picture,
        avatar_url,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationDisplay = () => {
    if (!userProfile) return "";

    if (userProfile.cities && userProfile.cities.length > 0) {
      return `${userProfile.cities.join(", ")}, ${userProfile.state}`;
    }

    return userProfile.state;
  };

  const handleSignOut = async () => {
    const supabase = createClient();

    toast({
      title: "Signing out...",
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // FIXED: Use onSetActive from props instead of router.push
  const handleNavigation = (label: string, path: string) => {
    onSetActive(label, path);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleSignOut();
        toast({
          title: "Logged out due to inactivity",
          status: "info",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      }, 30 * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  // REMOVED: The storage and visibility change listeners that cause page reloads
  // These were causing navigation issues

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="24px"
      position="sticky"
      top="10px"
      height="100vh"
      overflow="visible"
    >
      <Box
        p={"16px"}
        display={"flex"}
        flexDirection={"column"}
        gap={"10px"}
        borderRadius={"16px"}
        bg={"white"}
        mt={4}
      >
        <Box bg={"#F3F5F6"} p={"16px"} borderRadius={"16px"}>
          {isLoading ? (
            <Center py={4}>
              <Spinner size="sm" color={accentColor} />
            </Center>
          ) : (
            <>
              <Flex align="center" gap={4} mb={2}>
                <Avatar
                  size="lg"
                  name={
                    userProfile?.full_name ||
                    userProfile?.username ||
                    userProfile?.email ||
                    "Agent"
                  }
                  src={
                    typeof userProfile?.picture === "string" &&
                    userProfile.picture
                      ? userProfile.picture
                      : typeof userProfile?.avatar_url === "string" &&
                        userProfile.avatar_url
                      ? userProfile.avatar_url
                      : undefined
                  }
                  bg="white"
                  color={accentColor}
                />
              </Flex>

              <Flex gap={"8px"}>
                <Box display={"flex"} flexDirection={"row"} gap={"4px"}>
                  <Box display={"flex"} flexDirection={"column"} gap={"4px"}>
                    <HStack>
                      <Text
                        fontSize={"14px"}
                        lineHeight={"20px"}
                        color={colors.textColor}
                        fontWeight={600}
                      >
                        {userProfile?.full_name ?? ""}
                      </Text>
                      {userProfile?.full_name && (
                        <Box>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M5.73317 15L4.4665 12.8667L2.0665 12.3333L2.29984 9.86667L0.666504 8L2.29984 6.13333L2.0665 3.66667L4.4665 3.13333L5.73317 1L7.99984 1.96667L10.2665 1L11.5332 3.13333L13.9332 3.66667L13.6998 6.13333L15.3332 8L13.6998 9.86667L13.9332 12.3333L11.5332 12.8667L10.2665 15L7.99984 14.0333L5.73317 15ZM7.29984 10.3667L11.0665 6.6L10.1332 5.63333L7.29984 8.46667L5.8665 7.06667L4.93317 8L7.29984 10.3667Z"
                              fill="#0275D8"
                            />
                          </svg>
                        </Box>
                      )}
                    </HStack>

                    <Text
                      fontSize={"12px"}
                      lineHeight={"16px"}
                      fontWeight={400}
                      color={colors.textColor}
                    >
                      {userProfile?.username ?? ""}
                    </Text>
                    <Text
                      fontSize={"12px"}
                      lineHeight={"16px"}
                      fontWeight={400}
                      color={colors.textColor}
                    >
                      {userProfile?.whatsapp_no ?? ""}
                    </Text>
                  </Box>
                </Box>
              </Flex>

              <Box display={"flex"}>
                <Text
                  fontSize={"12px"}
                  lineHeight={"16px"}
                  fontWeight={400}
                  color={colors.textColor}
                >
                  {getLocationDisplay()}
                </Text>
              </Box>
            </>
          )}
        </Box>
      </Box>

      <Box id="sign-out" bg="white" p={"16px"} borderRadius={"16px"}>
        <Box>
          {sidebarItems.map((item) => (
            <Box
              key={item.label}
              onClick={() => handleNavigation(item.label, item.path)}
            >
              <Flex
                align="center"
                cursor="pointer"
                w={"100%"}
                py={2}
                bg={item.label === active ? "#EBF8FE" : "none"}
                color={item.label === active ? "#0275D8" : "#5F738C"}
                gap={2}
                px={3}
                border={item.label === active ? "1px solid #0275D8" : "none"}
                borderRadius={"8px"}
                my={3}
                transition="all 0.2s"
                _hover={{
                  bg: item.label === active ? "#EBF8FE" : "#F3F5F6",
                }}
              >
                <Icon
                  as={RxDashboard}
                  fontSize="xl"
                  color={item.label === active ? "#0275D8" : "#5F738C"}
                />
                <Flex align="center" justify={"space-between"} w="100%">
                  <Text>{item.label}</Text>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Box>

        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          mb={8}
          h={"20vh"}
          onClick={handleSignOut}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            p={3}
            px={4}
            color={"red"}
            cursor={"pointer"}
            fontWeight={600}
            _hover={{
              bg: "#FFF5F5",
            }}
            borderRadius={"8px"}
            transition="all 0.2s"
          >
            <BiLogOutCircle />
            Sign Out
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;