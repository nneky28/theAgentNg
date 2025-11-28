'use client'

import {
  Box,
  Button,
  HStack,
  Text,
  IconButton,
  Select,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = '#724B9B';

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Show 5 page numbers at most
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <Box mt={12}>
      <Flex 
        justify="space-between" 
        align="center" 
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        {/* Items per page selector */}
        <HStack spacing={2}>
          <Text fontSize="sm" color={textColor}>
            Show
          </Text>
          <Select
            size="sm"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            w="auto"
          >
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
          </Select>
          <Text fontSize="sm" color={textColor}>
            per page
          </Text>
        </HStack>

        {/* Page info */}
        <Text fontSize="sm" color={textColor}>
          Showing {startItem}-{endItem} of {totalItems} results
        </Text>

        {/* Pagination controls */}
        <HStack spacing={1}>
          <IconButton
            aria-label="Previous page"
            icon={<FiChevronLeft />}
            size="sm"
            variant="outline"
            isDisabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          />
          
          {getPageNumbers().map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? "solid" : "outline"}
              bg={currentPage === page ? accentColor : "transparent"}
              color={currentPage === page ? "white" : "inherit"}
              _hover={{
                bg: currentPage === page ? "purple.600" : "gray.100"
              }}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
          
          <IconButton
            aria-label="Next page"
            icon={<FiChevronRight />}
            size="sm"
            variant="outline"
            isDisabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          />
        </HStack>
      </Flex>
    </Box>
  );
};