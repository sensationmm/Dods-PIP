import '../styles/globals.css';

import { AppProps } from 'next/app';
import Head from 'next/head';

import Footer from '../components/Footer';
import Header from '../components/Header';
import * as Styled from './_app.styles';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <div data-test={'page-app'}>
      <Head>
        <link rel="preload" href="/fonts/LibreBaskerville-Regular.ttf" as="font" crossOrigin="" />
        <link rel="preload" href="/fonts/OpenSans-Regular.ttf" as="font" crossOrigin="" />
        <link rel="preload" href="/fonts/OpenSans-Bold.ttf" as="font" crossOrigin="" />
      </Head>
      <Header />
      <Styled.main>
        <Component {...pageProps} />
      </Styled.main>
      <Footer />
    </div>
  );
};
export default MyApp;
