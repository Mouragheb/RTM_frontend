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
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <Header />
      <Nav />

      <main className="max-w-md mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2"
          />
          {error && <p className="text-red-600 font-semibold">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Login;