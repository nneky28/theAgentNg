'use client'

import { colors } from '@/utils/color';
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
  const accentColor = colors.primary;

  const faqs = [
    {
      question: 'What is The Agent Ng?',
      answer: 'The Agent Ng is a real estate platform designed to connect people searching for properties with Agents in their desired location.'
    },
    {
      question: 'How does The Agent Ng work?',
      answer: 'When a user submits a property search, the information is sent to our Agents within that location. Agents with matching properties are free to contact the user.'
    },
    {
      question: 'How will I get property notifications?',
      answer: 'When there is a property search in your location, you will receive notifications in your dashboard and email, with the users contact information.'
    },
    {
      question: 'Which areas will I get notifications for?',
      answer: 'You will be notified whenever a user submits a property search within the locations you selected on your profile.'
    },
    {
      question: 'Can I edit my profile information?',
      answer: 'Yes. Click "Settings" on your dashboard menu to update your username, whatsapp number and location preferences.'
    },
    {
      question: 'Can I list my property on the website?',
      answer: 'Yes. Click the "Add New" button on your dashboard, fill in the property details, upload images and submit.'
    },
    {
      question: 'What areas can I list properties in?',
      answer: 'You can list properties in any category, city or state within Nigeria.'
    },
    {
      question: 'How do users find my listings?',
      answer: 'After you submit your property details, it will be reviewed and published on the website.'
    },
    {
      question: 'Can I edit my property listings?',
      answer: 'Yes. From your dashboard, select "Edit" to update the property details, images, or pricing.'
    },
    {
      question: 'How many properties can I list?',
      answer: 'As a new Agent, you can list up to 10 properties on the platform.'
    },
    {
      question:'How will I know when someone is interested in my property?',
      answer:'If a user is interested in your property, they can click the chat button to contact you via Whatsapp.'
    },
    {
      question:'How do I delete my account?',
      answer:'Click "Settings" from your dashboard menu and select "Delete Profile". Please note this action is permanent and will remove all your properties and data.'
    }
    
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
              <Text 
                as="a" 
                href="mailto:theagentnigeria@gmail.com"
                color={accentColor} 
                fontWeight="600"
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
              >
                theagentnigeria@gmail.com
              </Text>
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default FAQsPage;