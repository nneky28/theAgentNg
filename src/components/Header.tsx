'use client'
import { Box, Flex, Container, SlideFade, useColorModeValue, Text, Heading, Button, VStack } from "@chakra-ui/react";
import { useState } from "react";
import StatsSection from "./AnimationCounter";
import Navbar from "./Navbar";
import { colors } from "@/utils/color";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const primaryColor = useColorModeValue("purple.500", "teal.300");
  const bgColor = useColorModeValue("purple.50", "purple.800");
  const textColor = useColorModeValue("gray.700", "gray.100");
  
  return (
    <Box
      as="section"
      bg={bgColor}
      py={12}
      position="relative"
      overflow="hidden"
    >
  
  
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.05"
        bgImage="url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGQ9Ik0zNiAzMGE2IDYgMCAxIDAgMC0xMiA2IDYgMCAwIDAgMCAxMnptMCAwYTYgNiAwIDEgMCAwLTEyIDYgNiAwIDAgMCAwIDEyem0xMiAxMmE2IDYgMCAxIDAgMC0xMiA2IDYgMCAwIDAgMCAxMnptLTI0IDBhNiA2IDAgMSAwIDAtMTIgNiA2IDAgMCAwIDAgMTJ6Ii8+PC9nPjwvc3ZnPg==')"
        bgSize="100px"
        zIndex="0"
      />

      <Container maxW="900px" position="relative" zIndex="1">
        <VStack spacing={6} textAlign="center">
          <SlideFade in={isVisible} offsetY="30px" delay={0.6}>
            <Heading 
              as="h1" 
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              lineHeight="1.2"
            >
              Welcome to{" "}
              <Box as="span" color={colors.primary} position="relative">
                The Agent Ng
        
              </Box>{" "}
            </Heading>
            <Text 
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="medium"
              color={textColor}
              mt={2}
            >
              Nigeria's largest network of real estate agents.
            </Text>
          </SlideFade>
            <Text 
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              maxW="600px"
              color={useColorModeValue("gray.600", "gray.300")}
              lineHeight="1.7"
            >
             Our goal is to help you find the right property with personalized
              recommendations from our expert agents.
            </Text>
            <Text 
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              maxW="600px"
              color={useColorModeValue("gray.600", "gray.300")}
              lineHeight="1.7"
            >
            Simply provide a few details and get matching recommendations within a week.
            </Text>
         <StatsSection/>
      
    

        </VStack>
      </Container>
    </Box>
  );
};

export default Header;