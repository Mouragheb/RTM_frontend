import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { BASE_IMAGE_URL } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';

const ManagerDashboard = () => {
  const { id: restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('active');
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [managerName, setManagerName] = useState('Manager');
  const [myRestaurants, setMyRestaurants] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setManagerName(decoded.name || 'Manager');
    }
  }, [token]);

  useEffect(() => {
    const fetchMyRestaurants = async () => {
      try {
        const res = await API.get('/api/restaurants/my-restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyRestaurants(res.data.restaurants || []);
      } catch (err) {
        console.error('Failed to fetch manager restaurants:', err);
      }
    };
    fetchMyRestaurants();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [resRestaurant, resEmployees, resTasks] = await Promise.all([
          API.get(`/api/restaurants/${restaurantId}`, { headers }),
          API.get('/api/auth/employees', { headers }),
          API.get(`/api/tasks/restaurant/${restaurantId}`, { headers }),
        ]);
        setRestaurant(resRestaurant.data);
        setEmployees(resEmployees.data.employees || []);
        setTasks(resTasks.data.tasks || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId, token]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(restaurantId).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await API.delete(`/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleDeleteRestaurant = async () => {
    if (window.confirm('Delete this restaurant?')) {
      try {
        await API.delete(`/api/restaurants/${restaurantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate('/my-restaurants');
      } catch (err) {
        console.error('Failed to delete restaurant:', err);
      }
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const empRestaurantId =
      typeof emp.restaurant === 'object'
        ? emp.restaurant._id?.toString()
        : emp.restaurant?.toString();
    return empRestaurantId === restaurantId;
  });

  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const shownTasks = view === 'active' ? activeTasks : completedTasks;

  return (
    <div>
      <Header />
      <Nav />

      <div style={styles.topRight}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={styles.nameButton}
        >
          {managerName.length > 10 ? managerName.slice(0, 1) : managerName}
        </button>
      </div>

      {sidebarOpen && (
        <div style={styles.sidebar}>
          <h3>My Restaurants</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {myRestaurants.map((r) => (
              <li
                key={r._id}
                onClick={() => {
                  navigate(`/restaurant/${r._id}/dashboard`);
                  setSidebarOpen(false);
                }}
                style={styles.sidebarLink}
              >
                {r.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <main style={styles.container}>
        <h2>Manager Dashboard</h2>
        {/* ...rest unchanged */}
      </main>

      <Footer />
    </div>
  );
};

const styles = {
  container: { padding: '40px', textAlign: 'center' },
  card: { border: '1px solid #ccc', borderRadius: '8px', padding: '20px', maxWidth: '400px', margin: '0 auto', backgroundColor: '#f9f9f9' },
  logo: { width: '100px', height: '100px', objectFit: 'contain', marginBottom: '10px' },
  idBox: { marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
  copyBtn: { padding: '5px 10px', fontSize: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  copiedText: { color: 'green', fontSize: '12px' },
  deleteRestaurantBtn: { marginTop: '15px', padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', fontSize: '14px', cursor: 'pointer' },
  employeeList: { listStyleType: 'none', padding: 0, marginTop: '20px' },
  employeeItem: { padding: '10px', backgroundColor: '#eee', borderRadius: '5px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  taskButton: { padding: '5px 10px', marginRight: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
  deleteButton: { padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', marginTop: '8px' },
  archiveBtn: { padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', marginTop: '5px' },
  toggleButtons: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' },
  activeToggle: { backgroundColor: '#007bff', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', fontWeight: 'bold' },
  inactiveToggle: { backgroundColor: '#ddd', color: '#333', padding: '8px 12px', border: 'none', borderRadius: '4px' },
  taskGrid: { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' },
  taskCard: { width: '280px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '15px', textAlign: 'left' },
  taskPhoto: { width: '100%', marginTop: '10px', borderRadius: '4px' },
  topRight: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 999,
  },
  nameButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '260px',
    height: '100vh',
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '2px 0 6px rgba(0,0,0,0.2)',
    zIndex: 999,
  },
  sidebarLink: {
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
    cursor: 'pointer',
    color: '#007bff',
    fontWeight: 'bold',
  }
};

export default ManagerDashboard;