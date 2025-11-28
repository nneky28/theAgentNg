import {
  Box,
  Button,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "./Icons";
import { colors } from "@/utils/color";

// Define a generic type for menu items
interface MenuItem {
  [key: string]: string | number | boolean | undefined;
  disabled?: boolean;
}

interface CustomSelectFieldProps {
  error?: string;
  value?: string;
  itemValueKey: string;
  itemLabelKey: string;
  handleChange?: (value: string | number) => void;
  data?: MenuItem[];
  disabled?: boolean;
  placeholder?: string;
  height?: number | string;
  width?: number | string;
  withSearch?: boolean;
  isSearching?: boolean;
  handleSearch?: (value: string) => void;
  placement?:
    | "auto-start"
    | "auto"
    | "auto-end"
    | "top-start"
    | "top"
    | "top-end"
    | "right-start"
    | "right"
    | "right-end"
    | "bottom-end"
    | "bottom"
    | "bottom-start"
    | "left-end"
    | "left"
    | "left-start";
  dataTestId?: string;
}

const CustomSelectField: React.FunctionComponent<CustomSelectFieldProps> = ({
  error,
  value,
  height,
  width,
  data = [],
  disabled,
  withSearch,
  handleChange,
  placeholder = "",
  itemLabelKey,
  itemValueKey,
  handleSearch,
  isSearching,
  placement,
  dataTestId,
}) => {
  const [, setSelected] = useState<string | undefined>(undefined);
  const [searchedResults, setSearchedResults] = useState<MenuItem[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  const handleSearchValue = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredResult = data?.filter((item: MenuItem) => {
      const itemLabel = String(item[itemLabelKey] || "");
      return itemLabel.toLowerCase().includes(lowerCaseQuery);
    });
    setSearchedResults(filteredResult);
  };

  return (
    <Menu placement={placement}>
      {({ isOpen }) => (
        <>
          <MenuButton
            bg={"white"}
            py={6}
            px={5}
            borderRadius={4}
            as={Button}
            rightIcon={isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
            color={"gray.600"}
            textAlign={"left"}
            fontSize={"md"}
            _hover={{
              bg: "gray.100",
            }}
            _focus={{
              bg: "white",
            }}
            _active={{
              bg: "white",
            }}
            disabled={disabled}
            fontWeight={"light"}
            outline={"none"}
            border={error ? "1px solid" : "none"}
            borderColor={error ? "red.500" : "none"}
            width={width}
            data-testid={dataTestId}
            aria-invalid={!!error}
            boxShadow={'sm'}
          >
            {
              value
                ? String(
                    (data.find(item => item[itemValueKey] === value) ?? {})[itemLabelKey] ||
                      placeholder
                  )
                : placeholder
            }
          </MenuButton>
          <MenuList
            bg={"white"}
            border={"1px"}
            borderTopColor={"gray.200"}
            borderRightColor={"gray.200"}
            borderLeftColor={"gray.200"}
            borderBottomColor={"gray.200"}
            py={4}
            px={2}
            height={height ?? 300}
            overflowY={"scroll"}
            borderRadius={6}
            width={width}
          >
            <React.Fragment>
              {withSearch && (
                <HStack
                  py={0}
                  px={2.5}
                  bg={"gray.400"}
                  borderRadius={4}
                  mb={2}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Box mt={0.5}>
                    <SearchIcon size="16" />
                  </Box>
                  <Input
                    bg={"none"}
                    py={0}
                    px={0}
                    ml={0}
                    border={"none"}
                    placeholder="Search "
                    fontSize={"md"}
                    _placeholder={{
                      fontSize: "xs",
                    }}
                    color={"gray.600"}
                    onChange={(event) => {
                      if (handleSearch) {
                        handleSearch(event.target.value);
                      } else {
                        handleSearchValue(event.target.value);
                      }
                    }}
                    focusBorderColor="gray.400"
                    errorBorderColor="red.500"
                  />
                  {isSearching && (
                    <Spinner
                      size="sm"
                      color={colors.primary}
                      data-testid="status"
                      aria-label="Loading..."
                      role="status"
                    />
                  )}
                </HStack>
              )}
              {((searchedResults ?? data) || []).map((item: MenuItem) => (
                <MenuItem
                  key={String(item[itemValueKey])}
                  fontSize={"sm"}
                  color={"gray.600"}
                  _hover={{
                    bg: item.disabled ? undefined : "purple.400",
                       color:'white'
                  }}
                  _focus={{
                    bg: item.disabled ? undefined : "purple.400",
                       color:'white'
                  }}
                  borderRadius={6}
                  onClick={() => {
                    if (!item.disabled && handleChange) {
                      const labelValue = item[itemLabelKey];
                      const itemValue = item[itemValueKey];
                      setSelected(String(labelValue));
                      handleChange(itemValue as string | number); 
                    }
                  }}
                  textTransform={"capitalize"}
                  isDisabled={item.disabled} 
                >
                  {String(item[itemLabelKey])}
                </MenuItem>
              ))}
            </React.Fragment>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default CustomSelectField;