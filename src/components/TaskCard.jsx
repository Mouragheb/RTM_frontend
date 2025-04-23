import React, { useState } from 'react';
import API from '../api/api';

const TaskCard = ({ task, onComplete, baseUrl }) => {
  const [completionImage, setCompletionImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setCompletionImage(e.target.files[0]);
  };

  const handleComplete = async () => {
    if (!completionImage) return alert('Please upload an image before marking complete.');

    const formData = new FormData();
    formData.append('photo', completionImage);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      await API.put(`/api/tasks/${task._id}/complete`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      onComplete?.(); // Refresh task list
    } catch (err) {
      console.error('Error marking task complete:', err);
      alert('Failed to complete task.');
    } finally {
      setUploading(false);
    }
  };

  // Helper to build the full image URL
  const getImageUrl = (path) => {
    if (!path) return '';
    if (baseUrl) return `${baseUrl}/${path}`;
    return `http://localhost:8080/${path}`;
  };

  return (
    <div style={styles.card}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
      <p><strong>Frequency:</strong> {task.frequency}</p>
      <p><strong>Status:</strong> {task.status}</p>

      <div style={styles.imagesContainer}>
        {task.status === 'completed' ? (
          <>
            {task.photoBefore && (
              <div>
                <p><strong>Before:</strong></p>
                <img
                  src={getImageUrl(task.photoBefore)}
                  alt="Before"
                  style={styles.image}
                />
              </div>
            )}
            {task.photoAfter && (
              <div>
                <p><strong>After:</strong></p>
                <img
                  src={getImageUrl(task.photoAfter)}
                  alt="After"
                  style={styles.image}
                />
              </div>
            )}
          </>
        ) : (
          task.photoBefore && (
            <div>
              <p><strong>Task Image:</strong></p>
              <img
                src={getImageUrl(task.photoBefore)}
                alt="Task"
                style={styles.image}
              />
            </div>
          )
        )}
      </div>

      {!task.completed && (
        <div style={styles.uploadSection}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button
            onClick={handleComplete}
            disabled={!completionImage || uploading}
          >
            {uploading ? 'Uploading...' : 'Mark as Completed'}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    width: '300px',
    boxShadow: '0 0 4px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  uploadSection: {
    marginTop: '10px',
  },
  imagesContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
};

export default TaskCard;