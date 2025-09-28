import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container mt-4">{children}</main>
    </>
  );
}