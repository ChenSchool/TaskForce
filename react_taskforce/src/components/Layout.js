/**
 * Layout component wrapper.
 * Provides consistent page structure with navigation bar and main content area for all pages.
 */
import React from 'react';
import Navbar from './Navbar';

/**
 * Main layout wrapper component that includes navigation and content area.
 */
export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}