import { Select } from "@chakra-ui/react";

interface SortSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  width?: string | number;
}

const SortSelect = ({ value, onChange, width = "200px" }: SortSelectProps) => (
  <Select
    width={width}
    value={value}
    onChange={onChange}
    bg="white"
    borderRadius="md"
    fontWeight="medium"
  >
    <option value="featured">Sort by: Featured</option>
    <option value="price-low">Price: Low to High</option>
    <option value="price-high">Price: High to Low</option>
    <option value="newest">Newest Listings</option>
  </Select>
);

export default SortSelect;