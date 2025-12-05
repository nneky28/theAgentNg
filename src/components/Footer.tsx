import { Box, Container, Stack, Text, Link, Image, IconButton, HStack, Flex } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box bg="black" color="white" py={10}>
      <Container maxW="container.xl">
        <Flex
          gap={8}
          alignItems="center"
          justifyContent={['center', 'space-between']}
          direction={['column', 'row']} 
          textAlign={['center', 'left']} 
        >
          <Stack align={['center', 'flex-start']}>
            <Box>
              <Image src="/images/L1.png" alt="TheAgent Logo" w="60px" mx={['auto', 'unset']} />
            </Box>
            <Text fontSize="sm" maxW={'400px'}>
              Nigeria&apos;s latest network of real estate agents. Our goal is to help you find the right property, the easy way.
            </Text>
            <HStack spacing={2} justify={['center', 'flex-start']}>
              <IconButton 
                aria-label="Facebook" 
                icon={<FaFacebook />} 
                size="md" 
                colorScheme="whiteAlpha" 
                variant="ghost"
              />
              <IconButton 
                aria-label="Twitter" 
                icon={<FaTwitter />} 
                size="md" 
                colorScheme="whiteAlpha" 
                variant="ghost"
              />
              <IconButton 
                aria-label="Instagram" 
                icon={<FaInstagram />} 
                size="md" 
                colorScheme="whiteAlpha" 
                variant="ghost"
              />
              <IconButton 
                aria-label="LinkedIn" 
                icon={<FaLinkedin />} 
                size="md" 
                colorScheme="whiteAlpha" 
                variant="ghost"
              />
            </HStack>
          </Stack>
          
          <Stack align={['center', 'flex-start']} fontSize="sm">
            <Text fontWeight="bold" mb={2}>Quick Links</Text>
            <Link href="/">Home</Link>
            <Link href="/#featured">Featured Listings</Link>
            <Link href="/#news">News & Tips</Link>
            <Link href="/agent/signup">Join as Agent</Link>
          </Stack>
          
          <Stack align={['center', 'flex-start']} fontSize="sm">
            <Text fontWeight="500" mb={2}>Contact</Text>
            <Link href="mailto:info@theagent.ng">info@theagent.ng</Link>
            <Link href="tel:+2348053034767">+234 8053034767</Link>
            <Text>49a Oyibo Adjahor Street, Lekki Phase 1, Lagos.</Text>
          </Stack>
        </Flex>
        
        <Box borderTopWidth={1} borderColor="gray.700" pt={5} mt={10}>
          <Text textAlign="center" fontSize="sm">
            &copy; {new Date().getFullYear()} The Agent Ng. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
export default Footer;