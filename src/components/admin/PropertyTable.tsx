import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
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

interface PropertyTableProps {
  properties: Property[];
  onViewDetails: (property: Property) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
  onDelete: (id: string) => void;
}

export const PropertyTable = ({
  properties,
  onViewDetails,
  onTogglePublish,
  onToggleFeatured,
  onDelete,
}: PropertyTableProps) => {
  return (
    <Box
      overflowX="auto"
      bg="white"
      borderRadius="xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>Category</Th>
            <Th>Title</Th>
            <Th>Location</Th>
            <Th>Price</Th>
            <Th>Status</Th>
            <Th>Date</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {properties.map((property) => {
            if (!property || !property.id) return null;

            return (
              <Tr key={property.id} _hover={{ bg: "gray.50" }}>
                <Td>
                  <Badge
                    bg={
                      property.category === "Properties To Let"
                        ? "green.100"
                        : property.category === "Properties For Sale"
                        ? "orange.100"
                        : "blue.100"
                    }
                  >
                    {property.category === "Properties To Let"
                      ? "To Let"
                      : property.category === "Properties For Sale"
                      ? "For Sale"
                      : "Short Let"}
                  </Badge>
                </Td>
                <Td>
                  <Text noOfLines={1} fontSize="sm">
                    {property.title || "Untitled"}
                  </Text>
                </Td>
                <Td fontSize="sm">
                  {property?.city && property?.state
                    ? `${property.city}, ${property.state}`
                    : property?.city || property?.state || "N/A"}
                </Td>
                <Td fontWeight="semibold" fontSize="sm">
                  {formatPrice(property.price, (property.currency as 'NGN' | 'USD') || "NGN")}
                </Td>
                <Td>
                  {property.is_featured ? (
                    <Badge colorScheme="yellow" fontSize="xs">
                      ⭐ Featured
                    </Badge>
                  ) : property.is_published ? (
                    <Badge colorScheme="green" fontSize="xs">
                      <CheckIcon boxSize={2} mr={1} /> Published
                    </Badge>
                  ) : (
                    <Badge colorScheme="gray" fontSize="xs">
                      <CloseIcon boxSize={2} mr={1} /> Draft
                    </Badge>
                  )}
                </Td>
                <Td color="gray.600" fontSize="sm">
                  {property.created_at ? new Date(property.created_at).toLocaleDateString() : "N/A"}
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<ChevronDownIcon />}
                      size="sm"
                      colorScheme="purple"
                      aria-label="Actions"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<ViewIcon />}
                        onClick={() => onViewDetails(property)}
                      >
                        View Details
                      </MenuItem>
                      <MenuItem
                        icon={
                          property.is_published ? (
                            <CloseIcon />
                          ) : (
                            <CheckIcon />
                          )
                        }
                        onClick={() =>
                          onTogglePublish(
                            property.id,
                            property.is_published || false
                          )
                        }
                      >
                        {property.is_published ? "Unpublish" : "Publish"}
                      </MenuItem>
                      <MenuItem
                        icon={<StarIcon />}
                        onClick={() =>
                          onToggleFeatured(
                            property.id,
                            property.is_featured || false
                          )
                        }
                      >
                        {property.is_featured
                          ? "Remove Featured"
                          : "Mark as Featured"}
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
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};
