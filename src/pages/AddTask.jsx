import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
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
      formData.append('restaurantId', restaurantId); // <-- Corrected key
      if (photo) formData.append('photo', photo);

      await API.post('/tasks/create', formData, {
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
      <main className="max-w-xl mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-6">Assign Task</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white border rounded p-6 shadow"
        >
          <input
            name="title"
            type="text"
            placeholder="Task Title"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Task Description"
            rows="4"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="dueDate"
            type="date"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <select
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />

          {error && <p className="text-red-600 font-medium">{error}</p>}
          {success && <p className="text-green-600 font-medium">{success}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Assign Task
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default AddTask;