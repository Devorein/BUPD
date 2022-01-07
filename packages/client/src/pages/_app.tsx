import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import React, { useEffect } from 'react';
import { QueryClientProvider } from 'react-query';
import { useGetCurrentUserQuery } from '../api';
import { Page } from '../components';
import { RootContext } from '../contexts';
import '../styles/main.css';
import { createClient, generateTheme } from '../utils';

const generatedTheme = generateTheme();
const client = createClient();

const Index: React.FC<{}> = (props) => {
  const getCurrentUserQuery = useGetCurrentUserQuery();
  const currentUser =
    getCurrentUserQuery.status === 'success' && getCurrentUserQuery.data.status === 'success'
      ? getCurrentUserQuery.data.data
      : null;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <RootContext.Provider value={{ currentUser, getCurrentUserQueryResult: getCurrentUserQuery }}>
      <Page>{props.children}</Page>
    </RootContext.Provider>
  );
};

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={generatedTheme}>
    <Head>
      <title>BUPD</title>
    </Head>
    <QueryClientProvider client={client}>
      <SnackbarProvider
        maxSnack={4}
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
