import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let role = null;
  let restaurantId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      restaurantId = decoded.restaurant;
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const homePath = token
    ? role === 'manager'
      ? '/my-restaurants'
      : `/restaurant/${restaurantId}/employee-dashboard`
    : '/';

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={homePath} className="text-xl font-bold">
              ReTaskMan
            </Link>
          </div>
          {/* Hamburger Menu (Mobile) */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon: Hamburger */}
              <svg
                className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon: Close */}
              <svg
                className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Navigation Links (Desktop) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to={homePath} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Home
              </Link>
              {!token && (
                <>
                  <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Login
                  </Link>
                  <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Register
                  </Link>
                </>
              )}
              {token && role === 'manager' && (
                <>
                  <Link to="/my-restaurants" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    My Restaurants
                  </Link>
                  <Link to="/add-restaurant" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Add Restaurant
                  </Link>
                </>
              )}
              {token && role === 'employee' && (
                <Link to={`/restaurant/${restaurantId}/employee-dashboard`} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Dashboard
                </Link>
              )}
              {token && (
                <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to={homePath} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              Home
            </Link>
            {!token && (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                  Register
                </Link>
              </>
            )}
            {token && role === 'manager' && (
              <>
                <Link to="/my-restaurants" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                  My Restaurants
                </Link>
                <Link to="/add-restaurant" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                  Add Restaurant
                </Link>
              </>
            )}
            {token && role === 'employee' && (
              <Link to={`/restaurant/${restaurantId}/employee-dashboard`} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                Dashboard
              </Link>
            )}
            {token && (
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;