import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from 'next/app';
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import { useGetCurrentUserQuery } from "../api";
import { IRootContext, RootContext } from "../contexts";
import '../styles/main.css';
import { createClient, generateTheme } from "../utils";

const generatedTheme = generateTheme();
const client = createClient()

const Index: React.FC<{}> = (props) => {
  const { data: getCurrentUserQueryData, isLoading: isGetCurrentUserQueryLoading } = useGetCurrentUserQuery();
  let currentUser: IRootContext["currentUser"] = null;
  if (!isGetCurrentUserQueryLoading) {
    currentUser = getCurrentUserQueryData?.status === "success" ? getCurrentUserQueryData.data : null;
  }

  return <RootContext.Provider value={{ currentUser }}>
    {props.children}
    <ReactQueryDevtools />
  </RootContext.Provider>
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <ThemeProvider theme={generatedTheme}>
    <Head>
      <title>BUPD</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap" rel="stylesheet"></link>
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
};

export default MyApp;
