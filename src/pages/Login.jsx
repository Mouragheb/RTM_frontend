import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import API from '../api/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/auth/login', form);
      const token = res.data.token;
      const role = res.data.user.role;
      const restaurantId = res.data.user.restaurant;

      localStorage.setItem('token', token);

      if (role === 'manager') {
        navigate('/my-restaurants');
      } else if (role === 'employee') {
        if (restaurantId) {
          navigate(`/restaurant/${restaurantId}/employee-dashboard`);
        } else {
          setError('This employee is not linked to any restaurant.');
        }
      } else {
        setError('Unknown user role.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <Header />
      <Nav />

      <main style={styles.container}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
};

export default Login;