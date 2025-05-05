'use client'
import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Container, 
  Button, 
  Flex,
  Stack,
  SlideFade,
  useColorModeValue
} from '@chakra-ui/react';
import { BiHome, BiMapPin } from 'react-icons/bi';
import { StarIcon } from '@chakra-ui/icons';
import Navbar from './Navbar';
import { colors } from '@/utils/color';


const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    "Verified Agents", 
    "Premium Properties", 
    "Personalized Recommendations"
  ];
  
  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const overlayColor = useColorModeValue('rgba(0,0,0,0.65)', 'rgba(0,0,0,0.75)');
  const primaryColor = useColorModeValue(colors.primary, 'teal.300');
  
  return (
    <Box 
      bgImage="url('https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')"
      bgSize="cover"
      bgPosition="center"
      position="relative"
      height="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="white"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: overlayColor,
        zIndex: 0,
        backdropFilter: 'blur(2px)'
      }}
    >
     <Navbar/>
      <Container maxW="container.xl" position="relative" zIndex="1">

        <Flex direction={{ base: 'column', lg: 'row' }} align="center" justify="space-between" mt={'18%'}>
          <Stack spacing={6} maxW={{ base: "100%", lg: "60%" }} textAlign={{ base: "center", lg: "left" }}>    
            <SlideFade in={isVisible} offsetY="30px" delay={0.4}>
              <Heading 
                as="h1" 
                size="2xl" 
                fontWeight="bold"
                lineHeight="shorter"
                letterSpacing="tight"
              >
                Find the perfect property,{" "}<br/>
                <Box as="span" color={primaryColor}>
                  the easy way.
                </Box>
              </Heading>
            </SlideFade>
            
       
            
            <SlideFade in={isVisible} offsetY="30px" delay={1}>
              <Flex 
                mt={2} 
                align="center" 
                justify={{ base: "center", lg: "flex-start" }}
                wrap="wrap"
                gap={8}
              >
                {features.map((feature, index) => (
                  <Flex key={index} align="center">
                    <Box 
                      color={activeFeature === index ? primaryColor : "gray.300"}
                      transition="all 0.3s ease"
                    >
                      {index === 0 && <BiHome size={18} />}
                      {index === 1 && <StarIcon w={18} h={18} />}
                      {index === 2 && <BiMapPin size={18} />}
                    </Box>
                    <Text 
                      ml={2} 
                      fontWeight={activeFeature === index ? "bold" : "normal"}
                      color={activeFeature === index ? "white" : "gray.300"}
                      transition="all 0.3s ease"
                    >
                      {feature}
                    </Text>
                   
                  </Flex>
                ))}
              </Flex>
            </SlideFade>
            
            <SlideFade in={isVisible} offsetY="30px" delay={1.2}>
              <Stack direction={{ base: "column", md: "row" }} spacing={4} mt={4}>
                <Button 
                  size="lg" 
                  bg={primaryColor}
                  color={'white'}
                  fontWeight={'bold'}
                  borderRadius="full"
                  px={8}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg"
                  }}
                  transition="all 0.3s ease"
                  _focus={
                  {
                      border: "none"
                  }
                  }
                  onClick={() => {
                    const agentCTASection = document.getElementById("featured");
                    if (agentCTASection) {
                      agentCTASection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            </SlideFade>
          </Stack>
          
        </Flex>
      </Container>
   
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="30%"
        bgGradient="linear(to-t, blackAlpha.800, transparent)"
        zIndex={0}
      />
    </Box>
  );
};

export default Hero;