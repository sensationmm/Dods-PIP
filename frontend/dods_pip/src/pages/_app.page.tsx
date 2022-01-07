import '../styles/globals.css';

import Footer from '@dods-ui/components/Footer';
import Header from '@dods-ui/components/Header';
import { ucFirst } from '@dods-ui/utils/string';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import * as Styled from './_app.styles';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const pagePath = router.pathname?.match(/[\w\d-]*$/);
  const rootPage = ucFirst((pagePath && pagePath[0].replace(/-/g, ' ')) || '');

  return (
    <div data-test={'page-app'}>
      <Head>
        <link rel="preload" href="/fonts/LibreBaskerville-Regular.ttf" as="font" crossOrigin="" />
        <link rel="preload" href="/fonts/OpenSans-Regular.ttf" as="font" crossOrigin="" />
        <link rel="preload" href="/fonts/OpenSans-Bold.ttf" as="font" crossOrigin="" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/apple-touch-icon-57x57.png" />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
          href="/apple-touch-icon-114x114.png"
        />
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
          href="/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="120x120"
          href="/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="152x152"
          href="/apple-touch-icon-152x152.png"
        />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <meta name="application-name" content="&nbsp;" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="theme-color" content="#222955" />
      </Head>
      <Header title={rootPage} />
      <Styled.main>
        <Component {...pageProps} />
      </Styled.main>
      <Footer />
    </div>
  );
};
export default MyApp;
