'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FiHelpCircle } from 'react-icons/fi';

const FAQsPage = () => {
  const accentColor = '#724B9B';

  const faqs = [
    {
      question: 'How do I add a new property?',
      answer: 'Click the "Add New" button on your dashboard, fill in the property details including title, address, price, and upload images. Click "Add Property" to submit.'
    },
    {
      question: 'How will I know when someone is interested in my property?',
      answer: 'You will receive instant notifications when a user submits a search request for properties in your location. Their contact information will be provided so you can reach out directly.'
    },
    {
      question: 'Can I edit my property listings?',
      answer: 'Yes! Click on any property card in your dashboard and select "Edit" to update the property details, images, or pricing.'
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Click the menu icon in the top-right corner and select "Edit Profile" to update your username, WhatsApp number, and location preferences.'
    },
    {
      question: 'What areas can I list properties in?',
      answer: 'You can list properties in the cities you selected during onboarding (up to 3 cities). You can update your location preferences in Settings.'
    },
    {
      question: 'How do I delete my account?',
      answer: 'Click the menu icon and select "Delete Profile". Please note this action is permanent and will remove all your properties and data.'
    },
    {
      question: 'Is there a limit to how many properties I can list?',
      answer: 'No, there is no limit! You can list as many properties as you want on the platform.'
    },
    {
      question: 'How do property seekers find my listings?',
      answer: 'Property seekers search by location, property type, and budget. If your property matches their criteria, it will appear in their search results.'
    },
  ];

  return (
    <Box minH="100vh" bg="gray.50" pt="80px">
      <Container maxW="container.md" py={10}>
        <VStack spacing={8}>
          <Flex align="center" gap={3}>
            <Icon as={FiHelpCircle} boxSize={8} color={accentColor} />
            <Heading color={accentColor}>
              Frequently Asked Questions
            </Heading>
          </Flex>

          <Text fontSize="lg" color="gray.600" textAlign="center">
            Find answers to common questions about using The Agent Ng platform
          </Text>

          <Accordion allowToggle w="full" bg="white" borderRadius="xl" shadow="md">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} border="none">
                <h2>
                  <AccordionButton
                    py={4}
                    _hover={{ bg: 'purple.50' }}
                    _expanded={{ bg: 'purple.50', color: accentColor }}
                  >
                    <Box flex="1" textAlign="left" fontWeight="600">
                      {faq.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} color="gray.600">
                  {faq.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          <Box
            w="full"
            p={6}
            bg="purple.50"
            borderRadius="xl"
            textAlign="center"
          >
            <Text fontWeight="600" color={accentColor} mb={2}>
              Still have questions?
            </Text>
            <Text color="gray.600">
              Contact us at{' '}
              <Text as="span" color={accentColor} fontWeight="600">
                support@theagent.ng
              </Text>
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default FAQsPage;