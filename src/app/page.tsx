import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import Hero from '../components/Hero';
import FeaturedListings from '../components/FeaturedListings';
import NewsTips from '../components/NewsTips';
import AgentCTA from '@/components/AgentCTA';
import SearchForm from '@/components/SearchForm';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Home: NextPage = () => {
  return (
    <Box as="main">
      <Hero />
      <Header/>
      <FeaturedListings />
      <SearchForm />
      <NewsTips />
      <AgentCTA />
      <Footer/>
    </Box>
  );
};

export default Home;