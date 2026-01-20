import {
  Box,
  Stack,
  HStack,
  Text,
  Badge,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ViewIcon,
  CheckIcon,
  CloseIcon,
  StarIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { Property } from "@/types";
import { formatPrice } from "@/utils/Method";

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
  onDelete: (id: string) => void;
}

export const PropertyCard = ({
  property,
  onViewDetails,
  onTogglePublish,
  onToggleFeatured,
  onDelete,
}: PropertyCardProps) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.200"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
    >
      <Box p={4}>
        <HStack justify="space-between" align="start" mb={3}>
          <Text fontWeight="bold" fontSize="md" flex={1} noOfLines={2}>
            {property.title}
          </Text>
        </HStack>

        <HStack spacing={2} mb={3} flexWrap="wrap">
          <Badge
            bg={
              property.category === "Properties To Let"
                ? "green.100"
                : property.category === "Properties For Sale"
                ? "orange.100"
                : "blue.100"
            }
            fontSize="xs"
          >
            {property.category === "Properties To Let"
              ? "To Let"
              : property.category === "Properties For Sale"
              ? "For Sale"
              : "Short Let"}
          </Badge>
          {property.is_featured && (
            <Badge colorScheme="yellow" fontSize="xs">
              ⭐ Featured
            </Badge>
          )}
          {!property.is_featured && (
            <Badge
              colorScheme={property.is_published ? "green" : "gray"}
              fontSize="xs"
            >
              {property.is_published ? "Published" : "Draft"}
            </Badge>
          )}
        </HStack>

        <Divider mb={3} />

        <Stack spacing={2} fontSize="sm">
          <HStack justify="space-between">
            <Text fontWeight="600" color="purple.600">
              {formatPrice(property.price, (property.currency as 'NGN' | 'USD') || "NGN")}
            </Text>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<ChevronDownIcon />}
                size="sm"
                colorScheme="purple"
                aria-label="Actions"
              />
              <MenuList>
                <MenuItem icon={<ViewIcon />} onClick={() => onViewDetails(property)}>
                  View Details
                </MenuItem>
                <MenuItem
                  icon={property.is_published ? <CloseIcon /> : <CheckIcon />}
                  onClick={() =>
                    onTogglePublish(property.id, property.is_published || false)
                  }
                >
                  {property.is_published ? "Unpublish" : "Publish"}
                </MenuItem>
                <MenuItem
                  icon={<StarIcon />}
                  onClick={() =>
                    onToggleFeatured(property.id, property.is_featured || false)
                  }
                >
                  {property.is_featured ? "Remove Featured" : "Mark as Featured"}
                </MenuItem>
                <MenuItem
                  icon={<DeleteIcon />}
                  color="red.500"
                  onClick={() => onDelete(property.id)}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
};
