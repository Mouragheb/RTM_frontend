import React, { useState } from 'react';
import API from '../api/api';

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
      await API.post('/tasks/create', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Task created');
      onTaskCreated && onTaskCreated();
      setForm({ title: '', description: '', assignedTo: '', frequency: 'once', dueDate: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border border-gray-300 rounded-lg bg-white w-full max-w-md">
      <h3 className="text-xl font-semibold mb-2">Create New Task</h3>
      <input name="title" placeholder="Task Title" value={form.title} onChange={handleChange} required className="border p-2 rounded" />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded" />
      <input name="assignedTo" placeholder="Employee ID" value={form.assignedTo} onChange={handleChange} required className="border p-2 rounded" />
      <select name="frequency" value={form.frequency} onChange={handleChange} className="border p-2 rounded">
        <option value="once">Once</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="border p-2 rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;