import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from 'next/app';
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import '../styles/main.css';
import { createClient, generateTheme } from "../utils";

const generatedTheme = generateTheme();
const client = createClient()

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
        <Component {...pageProps} />
        <ReactQueryDevtools />
      </SnackbarProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default MyApp;
