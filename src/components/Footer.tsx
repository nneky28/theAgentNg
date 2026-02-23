import { Box, Container, Stack, Text, Link, Image, IconButton, HStack, Flex } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box bg="black" color="white" py={10}>
      <Container maxW="container.xl">
        <Flex
          gap={8}
          alignItems={['center', 'flex-start']}
          justifyContent={['center', 'space-between']}
          direction={['column', 'row']} 
          textAlign={['center', 'left']} 
        >
          <Stack align={['center', 'flex-start']}>
            <Box>
              <Image src="/images/L1.png" alt="TheAgent Logo" w="60px" mx={['auto', 'unset']} />
            </Box>
            <Text fontSize="sm" maxW={'350px'}>
              Nigeria&apos;s largest network of real estate agents. Our goal is to help you find the right property, the easy way.
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
          
          <Stack align={['center', 'flex-start']} fontSize="sm" w={['full', 'auto']}>
            <Text fontWeight="bold" mb={2}>Quick Links</Text>
            <Link href="/rent" textAlign={['center', 'left']} w={['full', 'auto']}>Properties To Let</Link>
            <Link href="/buy" textAlign={['center', 'left']} w={['full', 'auto']}>Properties For Sale</Link>
            <Link href="/short-let" textAlign={['center', 'left']} w={['full', 'auto']}>Short Lets</Link>
            <Link href="/event-center" textAlign={['center', 'left']} w={['full', 'auto']}>Event Centers</Link>
          </Stack>
          
          <Stack align={['center', 'flex-start']} fontSize="sm" w={['full', 'auto']}>
            <Text fontWeight="bold" mb={2}>Legal</Text>
            <Link href="/privacy" textAlign={['center', 'left']} w={['full', 'auto']}>Privacy Policy</Link>
            <Link href="/terms" textAlign={['center', 'left']} w={['full', 'auto']}>Terms of Service</Link>
          </Stack>
          
          <Stack align={['center', 'flex-start']} fontSize="sm" w={['full', 'auto']}>
            <Text fontWeight="500" mb={2}>Contact</Text>
            <Link href="tel:+2348053034767" textAlign={['center', 'left']} w={['full', 'auto']}>+234 805 303 4767</Link>
            <Link href="mailto:theagentnigeria@gmail.com" textAlign={['center', 'left']} w={['full', 'auto']}>theagentnigeria@gmail.com</Link>
            <Text textAlign={['center', 'left']} w={['full', 'auto']}>49a Oyibo Adjahor Street, Lekki, Lagos.</Text>
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