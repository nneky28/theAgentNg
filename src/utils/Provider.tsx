"use client";
import React from "react";
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';



const averta = {
  fontFamily: "Averta",
  src: "local('Averta'), url('./fonts/Averta-Regular.otf') format('otf')",
};

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
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
    const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );
  return (
       
<>
 <QueryClientProvider client={queryClient}>
  <ChakraProvider theme={theme}>
      {children}
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
</>
  );
}

export default Providers;
