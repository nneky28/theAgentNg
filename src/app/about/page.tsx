'use client'

import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  Stack,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  SimpleGrid
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const AboutUsPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const primaryColor = "#724B9B";
  
  return (
    
  
      <Box >
        <Hero/>
        <Container maxW="1200px" py={12}>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={10} alignItems="center">
            <GridItem>
              <Heading as="h1" size="2xl" mb={6}>
                About The Agent Ng
              </Heading>
              <Text fontSize="xl" mb={8}>
                Nigeria&apos;s premier network of professional real estate agents, dedicated to connecting property seekers with their perfect homes since 2020.
              </Text>
              <HStack spacing={4}>
                <Button 
                  bg="white" 
                  color={primaryColor} 
                  size="lg" 
                  _hover={{ bg: "gray.100" }}
                >
                  Our Services
                </Button>
                <Button 
                  variant="outline" 
                  colorScheme="whiteAlpha" 
                  size="lg" 
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  Meet Our Team
                </Button>
              </HStack>
            </GridItem>
            <GridItem display={{ base: "none", lg: "block" }}>
              <Image 
                src="https://media.istockphoto.com/id/2198966747/photo/couple-closing-real-estate-contract-with-real-estate-agent.webp?a=1&b=1&s=612x612&w=0&k=20&c=MRupwwS_sR21cACmOIEPxd5ykbXbZsxLoc_oKUsaNhc=" 
                alt="TheAgent Team" 
                borderRadius="lg" 
                shadow="2xl"
                fallbackSrc="https://via.placeholder.com/600x400?text=Our+Team"
              />
            </GridItem>
          </Grid>
        </Container>
     

      {/* Our Story Section */}
      <Box py={20}>
        <Container maxW="1200px">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <Image 
                src="https://media.istockphoto.com/id/1987087979/photo/new-sustainable-single-family-home-with-a-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=hE4Ge6KX7D90gxVviIHEmG3-_AiZxwP2I3NOgMD6AI0=" 
                alt="TheAgent Office" 
                borderRadius="lg" 
                shadow="lg"
                fallbackSrc="https://via.placeholder.com/600x400?text=Our+Story"
              />
            </GridItem>
            <GridItem order={{ base: 1, lg: 2 }}>
              <Text color={primaryColor} fontWeight="bold" mb={2}>OUR STORY</Text>
              <Heading as="h2" size="xl" mb={6}>From Vision to Nigeria&apos;s Leading Real Estate Network</Heading>
              <Text fontSize="lg" color="gray.600" mb={4}>
                Founded in 2020, TheAgent began with a simple yet powerful vision: to transform the Nigerian real estate market by building a transparent, trustworthy network of professional agents.
              </Text>
              <Text fontSize="lg" color="gray.600" mb={6}>
                What started as a small team of 10 agents in Lagos has now grown to a nationwide network of over 500 verified real estate professionals covering 30+ cities across Nigeria.
              </Text>
              <Stack spacing={3}>
                <HStack>
                  <CheckCircleIcon color={primaryColor} />
                  <Text fontWeight="medium">Trusted by over 10,000 property seekers</Text>
                </HStack>
                <HStack>
                  <CheckCircleIcon color={primaryColor} />
                  <Text fontWeight="medium">Strict verification process for all agents</Text>
                </HStack>
                <HStack>
                  <CheckCircleIcon color={primaryColor} />
                  <Text fontWeight="medium">Transparent fee structure with no hidden costs</Text>
                </HStack>
              </Stack>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Mission & Values */}
      <Box py={16} bg={bgColor}>
        <Container maxW="1200px">
          <VStack spacing={5} textAlign="center" mb={16}>
            <Text color={primaryColor} fontWeight="bold">OUR PURPOSE</Text>
            <Heading as="h2" size="xl">Mission & Values</Heading>
            <Text fontSize="lg" maxW="800px" color="gray.600">
              Our mission is to make property transactions simple, transparent, and trustworthy for every Nigerian.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {[
              {
                title: "Integrity",
                description: "We believe in complete transparency in every transaction and interaction with our clients and agents.",
                icon: "🤝"
              },
              {
                title: "Excellence",
                description: "We are committed to providing the highest standard of service in the Nigerian real estate industry.",
                icon: "⭐"
              },
              {
                title: "Innovation",
                description: "We continuously seek new ways to improve the property search and transaction experience.",
                icon: "💡"
              },
              {
                title: "Community",
                description: "We build strong relationships with our agent network and clients, creating a supportive community.",
                icon: "👥"
              },
              {
                title: "Accessibility",
                description: "We make quality real estate services accessible to Nigerians across all income levels.",
                icon: "🔑"
              },
              {
                title: "Education",
                description: "We empower our clients with knowledge to make informed property decisions.",
                icon: "📚"
              }
            ].map((value, idx) => (
              <Box 
                key={idx} 
                bg="white" 
                p={8} 
                borderRadius="lg" 
                shadow="md" 
                textAlign="center"
                transition="transform 0.3s"
                _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
              >
                <Text fontSize="4xl" mb={4}>{value.icon}</Text>
                <Heading as="h3" size="md" mb={4}>{value.title}</Heading>
                <Text color="gray.600">{value.description}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box py={20}>
        <Container maxW="1200px">
          <VStack spacing={5} textAlign="center" mb={16}>
            <Text color={primaryColor} fontWeight="bold">THE PEOPLE</Text>
            <Heading as="h2" size="xl">Our Leadership Team</Heading>
            <Text fontSize="lg" maxW="800px" color="gray.600">
              Meet the dedicated professionals behind TheAgent&apos;s success
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            {[
              {
                name: "Chucks Ifediorah",
                role: "Founder / CEO",
                image: "https://images.unsplash.com/profile-1529572840809-ca87d6ab1b67?w=64&dpr=1&crop=faces&bg=%23fff&h=64&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              },
              {
                name: "Jasmine Ifediorah",
                role: "Chief Operations Officer",
                image: "https://images.unsplash.com/profile-1637153272092-2cba15cad300image?w=64&dpr=1&crop=faces&bg=%23fff&h=64&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              },
              {
                name: "Ogemdi Anazodo",
                role: "Head of Marketing",
                image: "https://images.unsplash.com/profile-1682847758034-a27a30c7304fimage?w=64&dpr=1&crop=faces&bg=%23fff&h=64&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              },
              {
                name: "Nneka Ifediorah",
                role: "Chief Technology Officer",
                image: "https://images.unsplash.com/profile-1529572840809-ca87d6ab1b67?w=64&dpr=1&crop=faces&bg=%23fff&h=64&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              }
            ].map((member, idx) => (
              <Box 
                key={idx} 
                textAlign="center"
              >
                <Image 
                  src={member.image}
                  alt={member.name}
                  borderRadius="full"
                  boxSize="200px"
                  mx="auto"
                  mb={4}
                  objectFit="cover"
                />
                <Heading as="h3" size="md" mb={1}>{member.name}</Heading>
                <Text color={primaryColor} fontWeight="medium">{member.role}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Statistics */}
      <Box py={20} bg={primaryColor} color="white">
        <Container maxW="1200px">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={10} textAlign="center">
            {[
              { value: "500+", label: "Verified Agents" },
              { value: "30+", label: "Cities Covered" },
              { value: "10,000+", label: "Happy Clients" },
              { value: "25,000+", label: "Properties Listed" }
            ].map((stat, idx) => (
              <VStack key={idx} spacing={4}>
                <Heading as="h2" size="2xl">{stat.value}</Heading>
                <Text fontSize="lg" fontWeight="medium">{stat.label}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Join Us CTA */}
      <Box py={20}>
        <Container maxW="1200px">
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={10} alignItems="center">
            <GridItem>
              <Heading as="h2" size="xl" mb={4}>Join Nigeria&apos;s Fastest Growing Real Estate Network</Heading>
              <Text fontSize="lg" color="gray.600" mb={6}>
                Whether you&apos;re an experienced agent or just starting your real estate career, TheAgent provides the platform, tools, and community to help you succeed.
              </Text>
              <Button 
                bg={primaryColor} 
                color="white" 
                size="lg" 
                px={10}
                _hover={{ bg: "#633d8a" }}
                id="agent-cta"
              >
                Become an Agent
              </Button>
            </GridItem>
    
          </Grid>
        </Container>
      
      </Box>
      <Footer/>
      </Box>

  );
};

export default AboutUsPage;