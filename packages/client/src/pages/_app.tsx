import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from 'next/app';
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import React from "react";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import { useGetCurrentUserQuery } from "../api";
import '../styles/main.css';
import { createClient, generateTheme } from "../utils";

const generatedTheme = generateTheme();
const client = createClient()

const Index: React.FC<{}> = (props) => {
  useGetCurrentUserQuery();

  return <>
    {props.children}
    <ReactQueryDevtools />
  </>
}

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={generatedTheme}>
    <Head>
      <title>BUPD</title>
    </Head>
    <QueryClientProvider client={client}>
      <SnackbarProvider maxSnack={4}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Index>
          <Component {...pageProps} />
        </Index>
      </SnackbarProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default MyApp;
