import { Button, HStack } from "@chakra-ui/react";
import React from "react";

const Pagination = () => {
  return (
    <HStack justify="center" my={10} spacing={2}>
      <Button size="sm" colorScheme="purple">
        1
      </Button>
      <Button size="sm" variant="outline">
        2
      </Button>
      <Button size="sm" variant="outline">
        3
      </Button>
      <Button size="sm" variant="ghost">
        ...
      </Button>
      <Button size="sm" variant="outline">
        8
      </Button>
    </HStack>
  );
};

export default Pagination;
