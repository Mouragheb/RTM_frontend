import { useState } from 'react';
import API from '../api/api';
import { BASE_IMAGE_URL } from '../utils/constants';

const TaskCard = ({ task, employeeView = false, onComplete }) => {
  const [completionPhoto, setCompletionPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setCompletionPhoto(e.target.files[0]);
  };

  const handleMarkComplete = async () => {
    if (!completionPhoto) {
      alert('Please upload a photo before marking complete.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', completionPhoto);

    try {
      setSubmitting(true);
      await API.put(`/tasks/${task._id}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      onComplete(task._id);
    } catch (err) {
      console.error('Error marking task complete:', err);
      alert('Failed to mark task complete. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="font-bold">{task.title}</h3>
      <p>{task.description}</p>
      <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      <p>Frequency: {task.frequency}</p>
      <p>Status: {task.status}</p>

      {employeeView && (
        <>
          <div className="my-2">
            {task.photoBefore && (
              <div>
                <span className="font-semibold">Before:</span>
                <img
                  src={`${BASE_IMAGE_URL}/${task.photoBefore}`}
                  alt="Before"
                  className="w-24 h-24 object-cover mt-1"
                />
              </div>
            )}
            {task.photoAfter && (
              <div className="mt-2">
                <span className="font-semibold">After:</span>
                <img
                  src={`${BASE_IMAGE_URL}/${task.photoAfter}`}
                  alt="After"
                  className="w-24 h-24 object-cover mt-1"
                />
              </div>
            )}
          </div>

          {!task.completed && (
            <div className="mt-2">
              <input type="file" onChange={handleFileChange} />
              <button
                onClick={handleMarkComplete}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded mt-2"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Mark as Completed'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskCard;