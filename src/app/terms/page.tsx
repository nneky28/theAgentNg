import { Box, Container, Heading, Text, VStack, Link } from '@chakra-ui/react';
import { NextPage } from 'next';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';

const TermsOfService: NextPage = () => {
  return (
    <Box>
      <Hero />
      <Container maxW="container.lg" py={10}>
        <VStack align="stretch" spacing={6}>
          <Heading as="h1" size="2xl" color="brand.900">
            Terms of Service
          </Heading>
          
          <Text fontSize="sm" color="gray.600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              1. Agreement to Terms
            </Heading>
            <Text>
              By accessing or using The Agent Ng (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Service.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              2. Description of Service
            </Heading>
            <Text>
              The Agent Ng is Nigeria&apos;s largest network of real estate agents, providing a platform that connects property seekers with real estate agents and property listings. Our Service helps users search for properties to buy, rent, or short-let across Nigeria.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              3. User Accounts
            </Heading>
            <Text mb={2}>When you create an account with us, you must provide accurate and complete information. You are responsible for:</Text>
            <VStack align="stretch" pl={6} spacing={2}>
              <Text>• Maintaining the security of your account and password</Text>
              <Text>• All activities that occur under your account</Text>
              <Text>• Notifying us immediately of any unauthorized access</Text>
            </VStack>
            <Text mt={2}>
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              4. Acceptable Use
            </Heading>
            <Text mb={2}>You agree not to:</Text>
            <VStack align="stretch" pl={6} spacing={2}>
              <Text>• Use the Service for any illegal purpose or in violation of any laws</Text>
              <Text>• Impersonate any person or entity</Text>
              <Text>• Post false, misleading, or fraudulent information</Text>
              <Text>• Interfere with or disrupt the Service or servers</Text>
              <Text>• Attempt to gain unauthorized access to any part of the Service</Text>
              <Text>• Harass, abuse, or harm other users</Text>
              <Text>• Use automated systems to access the Service without permission</Text>
            </VStack>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              5. Property Listings
            </Heading>
            <Text>
              Property listings on our platform are provided by real estate agents and property owners. We do not guarantee the accuracy, completeness, or reliability of any property information. Users should conduct their own due diligence before making any property-related decisions.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              6. Agent Services
            </Heading>
            <Text>
              Real estate agents using our platform are independent service providers. The Agent Ng does not employ these agents and is not responsible for their actions, representations, or the quality of their services. Any agreements between users and agents are solely between those parties.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              7. Intellectual Property
            </Heading>
            <Text>
              The Service and its original content, features, and functionality are owned by The Agent Ng and are protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or reproduce any content without our express written permission.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              8. User-Generated Content
            </Heading>
            <Text>
              By submitting content to the Service (reviews, comments, listings), you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display such content. You represent that you own or have the necessary rights to submit such content.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              9. Payments and Fees
            </Heading>
            <Text>
              Certain features of the Service may require payment. You agree to provide accurate payment information and authorize us to charge applicable fees. All fees are non-refundable unless otherwise stated.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              10. Disclaimer of Warranties
            </Heading>
            <Text>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free. We disclaim all liability for any property transactions conducted through our platform.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              11. Limitation of Liability
            </Heading>
            <Text>
              To the maximum extent permitted by law, The Agent Ng shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service, including but not limited to property transactions, agent interactions, or data loss.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              12. Indemnification
            </Heading>
            <Text>
              You agree to indemnify and hold harmless The Agent Ng and its affiliates from any claims, damages, losses, liabilities, and expenses arising from your use of the Service or violation of these Terms.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              13. Termination
            </Heading>
            <Text>
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              14. Governing Law
            </Heading>
            <Text>
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Lagos State, Nigeria.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              15. Changes to Terms
            </Heading>
            <Text>
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={3}>
              16. Contact Information
            </Heading>
            <Text>
              If you have any questions about these Terms, please contact us at:
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

export default TermsOfService;
