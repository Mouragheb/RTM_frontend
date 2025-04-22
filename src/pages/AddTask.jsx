import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/api';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const AddTask = () => {
  const { id: restaurantId, empId: employeeId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    frequency: 'once',
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('dueDate', form.dueDate);
      formData.append('frequency', form.frequency);
      formData.append('assignedTo', employeeId);
      formData.append('restaurant', restaurantId);
      if (photo) formData.append('photo', photo);

      await axios.post('/tasks/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Task assigned successfully');
      setTimeout(() => navigate(`/restaurant/${restaurantId}/dashboard`), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Task creation failed');
    }
  };

  return (
    <div>
      <Header />
      <Nav />

      <main style={styles.container}>
        <h2>Assign Task</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="title"
            type="text"
            placeholder="Task Title"
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Task Description"
            rows="4"
            onChange={handleChange}
          />
          <input
            name="dueDate"
            type="date"
            onChange={handleChange}
            required
          />
          <select name="frequency" value={form.frequency} onChange={handleChange}>
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>

          <input type="file" accept="image/*" onChange={handleFileChange} />

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit">Assign Task</button>
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

export default AddTask;