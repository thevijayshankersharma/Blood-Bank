import React from 'react';
import { Layout } from '@/components/Layout';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../style/style.css';
import '../style/landing.css';
import { GlobalProvider } from '@/context/GlobalContext';
import Head from 'next/head';
import Script from 'next/script';

const MyApp = ({ Component, pageProps }) => {
  return (
    <GlobalProvider>
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" 
        strategy="afterInteractive"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" 
        crossOrigin="anonymous"
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalProvider>
  )
}

export default MyApp;
