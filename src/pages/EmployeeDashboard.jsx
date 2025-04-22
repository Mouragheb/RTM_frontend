import { useEffect, useState } from 'react';
import API from '../api/api'; // Fixed import line
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { jwtDecode } from 'jwt-decode';
import TaskCard from '../components/TaskCard';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('active');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/employee/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Error fetching employee tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token, userId]);

  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const shownTasks = view === 'active' ? activeTasks : completedTasks;

  return (
    <div>
      <Header />
      <Nav />
      <main style={styles.container}>
        <h2>Employee Dashboard</h2>

        <div style={styles.toggleButtons}>
          <button
            onClick={() => setView('active')}
            style={view === 'active' ? styles.activeToggle : styles.inactiveToggle}
          >
            Active Tasks
          </button>
          <button
            onClick={() => setView('completed')}
            style={view === 'completed' ? styles.activeToggle : styles.inactiveToggle}
          >
            Completed Tasks
          </button>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : shownTasks.length === 0 ? (
          <p>No tasks in this view.</p>
        ) : (
          <div style={styles.taskGrid}>
            {shownTasks.map((task) => (
              <TaskCard key={task._id} task={task} onComplete={fetchTasks} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    textAlign: 'center',
  },
  toggleButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  activeToggle: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  inactiveToggle: {
    backgroundColor: '#ddd',
    color: '#333',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
  },
  taskGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
};

export default EmployeeDashboard;