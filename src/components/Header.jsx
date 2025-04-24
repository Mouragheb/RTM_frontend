import React from 'react';

import logo from '/logo.png'; // adjust path if needed

const Header = () => {
  return (
    
    <header style={styles.headerContainer}>
      <h1 className="text-3xl font-bold text-blue-600">Hello Tailwind</h1>
      <img src={logo} alt="RTM Logo" style={styles.logo} />
      <h1 style={styles.title}>Restaurant Task Manager</h1>
    </header>
  );
};

const styles = {
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#282c34',
    padding: '10px 20px',
    color: 'white',
    borderBottom: '3px solid #ff6347',
  },
  logo: {
    width: '50px',
    height: '50px',
    marginRight: '15px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  }
};

export default Header;