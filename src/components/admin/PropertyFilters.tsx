import { Flex, Input, Select } from "@chakra-ui/react";

interface PropertyFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

export const PropertyFilters = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
}: PropertyFiltersProps) => {
  return (
    <Flex gap={4} mb={6} direction={{ base: "column", md: "row" }}>
      <Input
        placeholder="Search properties..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        maxW={{ md: "400px" }}
        size={{ base: "md", md: "lg" }}
      />
      <Select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        maxW={{ md: "200px" }}
        size={{ base: "md", md: "lg" }}
      >
        <option value="all">All Properties</option>
        <option value="published">Published</option>
        <option value="draft">Drafts</option>
        <option value="featured">Featured Only</option>
      </Select>
    </Flex>
  );
};
