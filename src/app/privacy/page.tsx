import { Box, Container, Heading, Text, VStack, Link } from '@chakra-ui/react';
import { NextPage } from 'next';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';

const PrivacyPolicy: NextPage = () => {
  return (
    <Box>
      <Hero />
      <Container maxW="container.lg" py={10}>
        <VStack align="stretch" spacing={6}>
          <Heading as="h1" size="2xl" color="brand.900">
            Privacy Policy
          </Heading>
          
          <Text fontSize="sm" color="gray.600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              1. Introduction
            </Heading>
            <Text>
              Welcome to The Agent Ng (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services at https://theagent.ng/.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              2. Information We Collect
            </Heading>
            <Text mb={2}>We collect information that you provide directly to us, including:</Text>
            <VStack align="stretch" pl={6} spacing={2}>
              <Text>• Personal identification information (name, email address, phone number)</Text>
              <Text>• Property preferences and search history</Text>
              <Text>• Communication data when you contact us</Text>
            </VStack>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              3. How We Use Your Information
            </Heading>
            <Text mb={2}>We use the information we collect to:</Text>
            <VStack align="stretch" pl={6} spacing={2}>
              <Text>• Provide, maintain, and improve our services</Text>
              <Text>• Connect you with real estate agents and property listings</Text>
              <Text>• Send you property recommendations and updates</Text>
              <Text>• Respond to your inquiries and provide customer support</Text>
              <Text>• Send marketing communications (with your consent)</Text>
              <Text>• Detect, prevent, and address technical issues and fraudulent activity</Text>
            </VStack>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              4. Information Sharing
            </Heading>
            <Text>
              We may share your information with:
            </Text>
            <VStack align="stretch" pl={6} spacing={2} mt={2}>
              <Text>• Real estate agents and property owners when you express interest in a property</Text>
              <Text>• Service providers who assist in our operations</Text>
              <Text>• Law enforcement or government authorities when required by law</Text>
            </VStack>
            <Text mt={2}>
              We do not sell your personal information to third parties.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              5. Data Security
            </Heading>
            <Text>
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              6. Your Rights
            </Heading>
            <Text mb={2}>You have the right to:</Text>
            <VStack align="stretch" pl={6} spacing={2}>
              <Text>• Access and receive a copy of your personal data</Text>
              <Text>• Correct inaccurate or incomplete data</Text>
              <Text>• Request deletion of your data</Text>
              <Text>• Object to or restrict the processing of your data</Text>
              <Text>• Withdraw consent at any time</Text>
            </VStack>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              7. Cookies and Tracking Technologies
            </Heading>
            <Text>
              We use cookies and similar tracking technologies to collect and track information about your activity on our website and to enhance your user experience. You can control cookies through your browser settings.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              8. Third-Party Services
            </Heading>
            <Text>
              Our service may contain links to third-party websites or integrate with third-party services (such as Google Authentication). We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              9. Children&apos;s Privacy
            </Heading>
            <Text>
              Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              10. Changes to This Privacy Policy
            </Heading>
            <Text>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              11. Contact Us
            </Heading>
            <Text>
              If you have any questions about this Privacy Policy, please contact us at:
            </Text>
            <VStack align="stretch" pl={6} spacing={2} mt={2}>
              <Text>Email: <Link href="mailto:info@theagent.ng" color="blue.500">info@theagent.ng</Link></Text>
              <Text>Phone: <Link href="tel:+2348053034767" color="blue.500">+234 8053034767</Link></Text>
              <Text>Address: 49a Oyibo Adjahor Street, Lekki, Lagos, Nigeria</Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
};

export default PrivacyPolicy;
