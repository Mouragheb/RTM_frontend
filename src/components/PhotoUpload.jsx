import React, { useState } from 'react';
import API from '../api/api';

const PhotoUpload = ({ taskId, token, onCompleted }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a photo');

    const formData = new FormData();
    formData.append('photo', file);

    try {
      await API.put(`/tasks/${taskId}/complete`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Task marked as completed!');
      onCompleted && onCompleted();
      setFile(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        className="border p-2 rounded"
        onChange={handleFileChange}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Upload & Complete
      </button>
    </form>
  );
};

export default PhotoUpload;