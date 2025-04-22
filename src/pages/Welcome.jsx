import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div>
      <Header />
      <Nav />

      <main style={styles.container}>
        <h1>Welcome to Restaurant Task Manager</h1>
        <p style={styles.subText}>
          Organize, assign, and complete tasks efficiently — whether you're a manager or an employee.
        </p>

        <div style={styles.buttons}>
          <Link to="/login" style={styles.button}>Login</Link>
          <Link to="/register" style={styles.button}>Register</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto',
  },
  subText: {
    marginTop: '10px',
    fontSize: '16px',
    color: '#555',
  },
  buttons: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Welcome;