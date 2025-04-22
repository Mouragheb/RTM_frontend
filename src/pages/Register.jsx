import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/api';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'manager',
    restaurantId: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await axios.post('/auth/register', form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <Header />
      <Nav />

      <main style={styles.container}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            onChange={handleChange}
            required
          />
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
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>

          {form.role === 'employee' && (
            <input
              name="restaurantId"
              type="text"
              placeholder="Restaurant ID (ask your manager)"
              onChange={handleChange}
              required
            />
          )}

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>Registration successful! Redirecting...</p>}

          <button type="submit">Register</button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '450px',
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
  success: {
    color: 'green',
    fontWeight: 'bold',
  },
};

export default Register;