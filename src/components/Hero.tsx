'use client'
import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Container, 
  Flex,
  Stack,
  Link,
  useColorModeValue
} from '@chakra-ui/react';
import { BiHome, BiMapPin } from 'react-icons/bi';
import { StarIcon } from '@chakra-ui/icons';
import Navbar from './Navbar';
import { colors } from '@/utils/color';



const Hero = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    "Verified Agents", 
    "Premium Properties", 
    "Personalized Recommendations"
  ];
  
  useEffect(() => {
    
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
     
  }, [activeFeature]);
  
  const primaryColor = useColorModeValue(colors.primary, 'teal.300');
  
  return (
    <Box 
      position="relative"
        overflow="hidden"
        backgroundImage="url('/images/Home2.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        bgColor="#00425F"
        h={['600px']}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: "black",
          opacity: 0.5,
          zIndex: 0,
        }}
    >
     <Navbar/>
      <Container 
          maxW="container.xl"
          py={16}
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          h="full"
          position="relative"
          zIndex={1}
      >

        <Flex direction={{ base: 'column', lg: 'row' }} align="center" justify="space-between" mt={'18%'}>
          <Stack spacing={6} maxW={{ base: "100%", lg: "60%" }} textAlign={{ base: "center", lg: "left" }}>    
            <Box>
              <Heading 
                as="h1" 
                size="2xl" 
                fontWeight="bold"
                lineHeight="shorter"
                letterSpacing="tight"
                color={'white'}
              >
                Find the perfect property,{" "}<br/>
                <Box as="span" color={'white'}>
                  the easy way.
                </Box>
              </Heading>
              
              <Text 
                mt={4} 
                fontSize="lg" 
                color="gray.200" 
                maxW="600px"
              >
                Nigeria&apos;s largest network of real estate agents. We connect you with verified agents to help you buy, rent, or short-let properties across Nigeria.
              </Text>
              
       
            </Box>
            
       
            
            <Box>
              <Flex 
                mt={2} 
                align="center" 
                justify={{ base: "center", lg: "flex-start" }}
                wrap="wrap"
                gap={[2,8]}
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
            </Box>
            
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