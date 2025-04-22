import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api'; // Adjust the path as needed
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
      // Debug: Log selected file info
      console.log('Selected file:', e.target.files[0]);
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
    } else {
      console.log("No file selected for logo.");
    }
    
    // Debug: Log the formData keys
    for (let key of formData.keys()) {
      console.log(key, formData.get(key));
    }

    try {
      const response = await API.post('/api/restaurants/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Response from createRestaurant:', response.data);
      setSuccess(`Restaurant created. Your ID: ${response.data.restaurantId}`);
      // After a short delay, redirect to the manager's restaurant list
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
      <main style={styles.container}>
        <h2>Add New Restaurant</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            type="text"
            placeholder="Restaurant Name"
            onChange={handleChange}
            required
          />
          <input
            name="address"
            type="text"
            placeholder="Restaurant Address"
            onChange={handleChange}
            required
          />
          <input
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <button type="submit">Add Restaurant</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
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

export default AddRestaurant;