import '../styles/globals.css';
import { AppProps } from 'next/app';

import Header from '../components/Header';
import Footer from '../components/Footer';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div data-test={'page-app'}>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
};
export default MyApp;
