import { useState, useEffect, useRef } from 'react';
import { Flex, Box, Text, useBreakpointValue } from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import { colors } from '@/utils/color';

const counterVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

const digitVariants = {
  initial: { y: -20, opacity: 0 },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      stiffness: 150
    }
  }),
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const AnimatedCounter = ({ from = 0, to, duration = 1.5 }: { from?: number; to: string; duration?: number }) => {
  const [count, setCount] = useState<number>(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -50px 0px" });
  
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    if (!isInView) return;
    
    const startValue = from;
    const endValue = parseInt(to.replace(/,/g, ''));
    const range = endValue - startValue;
    
    const easeOutQuad = (t: number) => t * (2 - t);
    
    let startTime: number;
    let animationFrameId: number;
    let restartTimeout: NodeJS.Timeout;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / (duration * 1000), 1);
      const easedProgress = easeOutQuad(progress);
      
      const currentValue = Math.floor(startValue + (range * easedProgress));
      setCount(currentValue);
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        restartTimeout = setTimeout(() => {
          setCount(from);
          startTime = 0;
          animationFrameId = requestAnimationFrame(animateCount);
        }, 1000);
      }
    };
    
    const startAnimation = () => {
      animationFrameId = requestAnimationFrame(animateCount);
    };
    
    startAnimation();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(restartTimeout);
    };
  }, [isInView, from, to, duration]);
  
  const formattedValue = formatNumber(count);
  
  return (
    <Box 
      as={motion.div}
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={counterVariants}
    >
      <Flex justify="center" align="flex-end" lineHeight="1">
        {formattedValue.split('').map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={digitVariants}
            animate={count === parseInt(to.replace(/,/g, '')) ? "pulse" : "animate"}
            style={{
              display: 'inline-block',
              minWidth: char === ',' ? '4px' : '0.6em',
              textAlign: 'center'
            }}
          >
            <Text
              as="span"
              fontSize={{ base: "3xl", md: "48px", lg: "54px" }}
              fontWeight="900"
              bgClip="text"
              lineHeight="1"
              color={colors.primary}
            >
              {char}
            </Text>
          </motion.span>
        ))}
        {count === parseInt(to.replace(/,/g, '')) && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ marginLeft: '4px' }}
          >
            <Text
              as="span"
              fontSize={{ base: "3xl", md: "48px", lg: "54px" }}
              fontWeight="900"
              bgGradient="linear(to-r, purple.600, pink.500)"
              bgClip="text"
              lineHeight="1"
            >
              +
            </Text>
          </motion.span>
        )}
      </Flex>
    </Box>
  );
};

const StatsSection = () => {
  const [, setIsVisible] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -100px 0px" });
  
  const stats = [
    { number: "500", label: "Active Agents" },
    { number: "60", label: "Cities Covered" },
    { number: "2,500", label: "Listed Properties" }
  ];
  
  const responsivePadding = useBreakpointValue({ base: 4, md: 8 });
  const responsiveBorder = useBreakpointValue({ base: "none", md: "2px" });
  
  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    }
  }, [isInView]);
  
  return (
    <Box ref={ref} w="full" py={12} mb={12}>
      <Flex 
        w="full" 
        justify="center" 
        align="center"
        flexWrap="wrap" 
        gap={{ base: 6, md: 0 }}
        fontWeight={800}
      >
        {stats.map((stat, index) => (
          <Box 
            key={index}
            textAlign="center" 
            px={responsivePadding} 
            borderRight={index < 2 ? responsiveBorder : "none"} 
            borderColor={colors.primary}
            pb={{ base: 0, md: 0 }}
            as={motion.div}
            whileHover={{ scale: 1.05 }}
          >
            <AnimatedCounter 
              from={0} 
              to={stat.number} 
              duration={1.8 + index * 0.3} 
            />
            <Text 
              fontSize={{ base: "md", md: "xl" }}
              color={colors.textColor}
              fontWeight="800"
              mt={2}
              letterSpacing="wide"
            >
              {stat.label}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default StatsSection;