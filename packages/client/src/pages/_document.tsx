import { ServerStyleSheets } from '@mui/styles';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

function MyDocument() {
  return <Html>
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
}

MyDocument.getInitialProps = async (ctx: any) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) => (props: any) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};

export default MyDocument;