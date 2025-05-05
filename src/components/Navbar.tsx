import {
    Box,
    Button,
    Container,
    Flex,
    HStack,
    IconButton,
    Image,
    Text,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    VStack,
   
  } from "@chakra-ui/react";
  import { usePathname } from "next/navigation";
  import { useEffect, useState, useRef } from "react";
  import Link from "next/link";
  import { HamburgerIcon} from "@chakra-ui/icons";
  
  interface NavLinkProps {
    href: string;
    label: string;
    isActive: boolean;
    hasSubmenu?: boolean;
    onClick?: () => void;
    isScrolled: boolean;
  }
  
  const NavLink = ({ href, label, isActive, onClick, isScrolled }: NavLinkProps) => {
    return (
      <Box
        as={Link}
        href={href}
        position="relative"
        fontWeight={600}
        color={isScrolled ? "white" : "white"}
        px={2}
        py={1}
        cursor="pointer"
        onClick={onClick}
        _hover={{
          textDecoration: "none"
        }}
      >
        <Flex align="center">
          <Text>{label}</Text>
        </Flex>
    
        {isActive && (
          <Box
            position="absolute"
            bottom="-6px"
            left="0"
            width="100%"
            height="2px"
            bg="white"
            borderRadius="full"
          />
        )}
      </Box>
    );
  };
  
  const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [, setIsNavbarTransparent] = useState(true);
    const pathname = usePathname();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>(null);
    

    const navItems = [
      { label: "About Us", href: "/about" },
      { label: "Properties To Let", href: "/rent"},
      { label: "Properties For Sale", href: "/buy" },
      { label: "News & Tips", href: "/blog" },
     
    ];
  
    useEffect(() => {
      const handleScroll = () => {
        if (window.pageYOffset > 0) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    useEffect(() => {
      const handleScroll = () => {
        const scrollThreshold = 200;
        const shouldMakeNavbarOpaque = window.scrollY > scrollThreshold;
        setIsNavbarTransparent(!shouldMakeNavbarOpaque);
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
  
    return (
      <Box
        w="100%"
        p={isScrolled ? 2 : 4}
        position="fixed"
        top="0"
        zIndex="999"
        id="nav-bar"
        data-testid="navbar"
        bgColor={isScrolled ? "rgba(114, 75, 155, 0.95)" : "transparent"}
        transition="all 0.3s ease-in-out"
        backdropFilter={isScrolled ? "blur(10px)" : "none"}
        boxShadow={isScrolled ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none"}
      >
        <Container
          maxW="1300px"
          px={{ base: 4, md: 6 }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            position="relative"
            zIndex="1"
          >
         
            <Link href="/" passHref>
              <Box position="relative">
                <Image
                  w="116px"
                  h="auto"
                  p={isScrolled ? 1 : 0}
                  src="/images/L2.png"
                  objectFit="contain"
                  transition="all 0.3s ease"
                  alt="TheAgent Logo"
                />
            
              </Box>
            </Link>
  
      
            <HStack
              spacing={{ md: 4, lg: 8 }}
              alignItems="center"
              display={{ base: "none", md: "flex" }}
              data-testid="navbar-links"
            >
              {navItems.map((item, index) => (
                  <NavLink
                    key={index}
                    href={item.href}
                    label={item.label}
                    isActive={pathname === item.href}
                    isScrolled={isScrolled}
                  />
                ))}
            </HStack>
  
            <HStack spacing={3}>
              <Button
                display={{ base: "none", sm: "flex" }}
                color={isScrolled ? "#724B9B" : "white"}
                bg={isScrolled ? "white" : "#724B9B"}
                variant={isScrolled ? "solid" : "solid"}
                px={{ base: 4, md: 12}}
                py={6}
                fontWeight="bold"
                fontSize="16px"
                borderRadius="8px"
                _hover={{ 
                  bg: isScrolled ? "whiteAlpha.800" : "#633d8a",
                  transform: "translateY(-2px)",
                  boxShadow: "md"
                }}
                transition="all 0.2s ease"
                onClick={() => {
                  const agentCTASection = document.getElementById("agent-cta");
                  if (agentCTASection) {
                    agentCTASection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Agent Login
              </Button>
              
              <IconButton
                ref={btnRef}
                aria-label="Open menu"
                icon={<HamburgerIcon />}
                size="lg"
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
              />
            </HStack>
          </Flex>
        </Container>
  
        {/* Mobile Drawer */}
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
          size="xs"
        >
          <DrawerOverlay />
          <DrawerContent bg="#724B9B" color="white">
            <DrawerCloseButton size="lg" />
            <DrawerHeader borderBottomWidth="1px">
              <Image
                w="100px"
                src="/images/L2.png"
                objectFit="contain"
                alt="TheAgent Logo"
              />
            </DrawerHeader>
  
            <DrawerBody pt={8}>
              <VStack spacing={6} align="stretch">
                {navItems.map((item, index) => (
                  <Box key={index}>
                
                      <Text 
                        as={Link} 
                        href={item.href} 
                        fontWeight="bold" 
                        fontSize="lg"
                        onClick={onClose}
                      >
                        {item.label}
                      </Text>
                
                  </Box>
                ))}
                
                <Button 
                  colorScheme="whiteAlpha" 
                  variant="outline" 
                  size="lg" 
                  mt={6}
                  borderWidth={2}
                  onClick={() => {
                    onClose();
                    const agentCTASection = document.getElementById("agent-cta");
                    if (agentCTASection) {
                      agentCTASection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Sign in
                </Button>
                
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    );
  };
  
  export default Navbar;