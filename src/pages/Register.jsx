import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import API from '../api/api';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'manager',
    restaurantId: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const payload = { ...form };
    delete payload.confirmPassword;

    try {
      await API.post('/auth/register', payload);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <Header />
      <Nav />

      <main className="max-w-md mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2"
          />

          {/* Password Field */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 text-lg"
            >
              {showPassword ? '🚫' : '👁️'}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 text-lg"
            >
              {showConfirm ? '🚫' : '👁️'}
            </span>
          </div>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
            required
          >
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
              className="border border-gray-300 rounded px-4 py-2"
            />
          )}

          {error && <p className="text-red-600 font-semibold">{error}</p>}
          {success && (
            <p className="text-green-600 font-semibold">
              Registration successful! Redirecting...
            </p>
          )}

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Register
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Register;