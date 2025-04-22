import React, { useState } from 'react';
import API from '../api/api'; // Adjust the path as needed

const TaskForm = ({ token, onTaskCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    frequency: 'once',
    dueDate: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/tasks/create', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Task created');
      onTaskCreated && onTaskCreated(); // optional callback
      setForm({ title: '', description: '', assignedTo: '', frequency: 'once', dueDate: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Create New Task</h3>
      <input name="title" placeholder="Task Title" value={form.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="assignedTo" placeholder="Employee ID" value={form.assignedTo} onChange={handleChange} required />
      <select name="frequency" value={form.frequency} onChange={handleChange}>
        <option value="once">Once</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
      <button type="submit">Create Task</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  }
};

export default TaskForm;