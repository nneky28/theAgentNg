"use client";
import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";




const averta = {
  fontFamily: "Averta",
  src: "local('Averta'), url('./fonts/Averta-Regular.otf') format('otf')",
};

const theme = extendTheme({
  fonts: {
    heading: `Raleway`,
    body: `Montserrat`,
    button: "Averta, sans-serif",

  },
  fontWeights: {
    light: 300,
    normal: 400,
    semibold: 400,
    bold: 600,
    extraBold: 800,
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [averta],
      },
    },
    MuiTypography: {
      root: {
        fontFamily: '"Averta" !important',
      },
    },
  },
  breakpoints: {
    base: "0em",
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em",
  },
});
function Providers({ children }: React.PropsWithChildren): React.JSX.Element {
  return (
      <ChakraProvider theme={theme}>
        {children}  
      </ChakraProvider>

  );
}

export default Providers;
