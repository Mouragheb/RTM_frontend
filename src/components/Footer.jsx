import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-10 py-5 text-center bg-gray-100 text-gray-700 text-sm border-t border-gray-300">
      <p>&copy; {new Date().getFullYear()} ReTaskMan. Developed By Moustafa Ragheb. All rights reserved.</p>
    </footer>
  );
};

export default Footer;