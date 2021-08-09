import '../styles/globals.css';
import { AppProps } from 'next/app';
import GlobalFonts from '../globals/fonts';
import Head from 'next/head';

import Header from '../components/Header';
import Footer from '../components/Footer';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div data-test={'page-app'}>
      <Head>
        <link rel="preload" href="/fonts/LibreBaskerville-Regular.ttf" as="font" crossOrigin="" />
        <link rel="preload" href="/fonts/OpenSans-Regular.ttf" as="font" crossOrigin="" />
        <link rel="preload" href="/fonts/OpenSans-Bold.ttf" as="font" crossOrigin="" />
      </Head>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
};
export default MyApp;
