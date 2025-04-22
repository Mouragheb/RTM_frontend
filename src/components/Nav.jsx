import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // FIXED import

const Nav = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Default role is null
  let role = null;

  // Decode the token if it exists
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Determine Home link destination
  let homePath = '/';
  if (token && role === 'manager') homePath = '/my-restaurants';
  if (token && role === 'employee') homePath = '/restaurant/${decoded.restaurant}/employee-dashboard';

  return (
    <nav style={styles.nav}>
      <Link to={homePath} style={styles.link}>Home</Link>

      {!token && (
        <>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/register" style={styles.link}>Register</Link>
        </>
      )}

      {token && role === 'manager' && (
        <>
          <Link to="/my-restaurants" style={styles.link}>My Restaurants</Link>
          <Link to="/add-restaurant" style={styles.link}>Add Restaurant</Link>
        </>
      )}

      {token && role === 'employee' && (
        <Link to="/restaurant/${decoded.restaurant}/employee-dashboard" style={styles.link}>Dashboard</Link>
      )}

      {token && (
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#444',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  logout: {
    background: 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};

export default Nav;