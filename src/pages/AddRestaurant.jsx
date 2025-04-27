import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const AddRestaurant = () => {
  const [form, setForm] = useState({ name: '', address: '', logo: null });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'logo') {
      setForm({ ...form, logo: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('address', form.address);
    if (form.logo) {
      formData.append('logo', form.logo);
    }

    try {
      const response = await API.post('/restaurants/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setSuccess(`Restaurant created. Your ID: ${response.data.restaurantId}`);
      setTimeout(() => {
        navigate('/my-restaurants');
      }, 1500);
    } catch (err) {
      console.error('Add restaurant error:', err.response?.data || err.message || err);
      setError(err.response?.data?.message || 'Failed to add restaurant');
    }
  };

  return (
    <div>
      <Header />
      <Nav />
      <main className="max-w-md mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-6">Add New Restaurant</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 border rounded shadow-sm">
          <input
            name="name"
            type="text"
            placeholder="Restaurant Name"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            name="address"
            type="text"
            placeholder="Restaurant Address"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          {error && <p className="text-red-600 font-medium">{error}</p>}
          {success && <p className="text-green-600 font-medium">{success}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Add Restaurant
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default AddRestaurant;