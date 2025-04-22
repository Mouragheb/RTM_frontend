import React, { useState } from 'react';
import API from '../api/api'; // Adjust the path as needed
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
    <form onSubmit={handleSubmit} style={styles.form}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit">Upload & Complete</button>
    </form>
  );
};

const styles = {
  form: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
};

export default PhotoUpload;