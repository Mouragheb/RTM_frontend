import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Restaurant Task Manager. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    marginTop: '40px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f1f1f1',
    color: '#333',
    fontSize: '14px',
    borderTop: '1px solid #ccc',
  },
};

export default Footer;