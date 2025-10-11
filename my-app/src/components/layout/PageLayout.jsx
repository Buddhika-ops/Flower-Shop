import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const PageLayout = ({ 
  children, 
  showNavbar = true, 
  showFooter = true,
  className = "" 
}) => {
  return (
    <>
      {showNavbar && <Navbar />}
      <div className={`min-h-screen ${className}`}>
        {children}
      </div>
      {showFooter && <Footer />}
    </>
  );
};

export default PageLayout;