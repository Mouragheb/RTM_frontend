import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/logo.png'; // Update the path if needed

function Header() {
  return (
    <header className="flex items-center px-4 py-3">
      <Link to="/">
        <img 
          src={logo} 
          alt="Restaurant Task Manager Logo" 
          className="h-12 w-auto cursor-pointer"
        />
      </Link>
    </header>
  );
}

export default Header;