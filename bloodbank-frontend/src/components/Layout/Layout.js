import React from 'react';
import Head from 'next/head';
import { ProtectedRoute } from '../ProtectedRoute';

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Blood Bank Management System</title>
      </Head>
      <div>
        <ProtectedRoute>{children}</ProtectedRoute>
      </div>
    </>
  )
}

export default Layout