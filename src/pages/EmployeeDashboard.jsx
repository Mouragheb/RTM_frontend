import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api/api';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import TaskCard from '../components/TaskCard';
import { BASE_IMAGE_URL } from '../utils/constants';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('active');
  const [loading, setLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const [restaurant, setRestaurant] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdownOpen, setActiveDropdownOpen] = useState(false);
  const [completedDropdownOpen, setCompletedDropdownOpen] = useState(false);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.userId;
  const restaurantId = decoded.restaurant;

  const pingBackend = async () => {
    try {
      await API.get('/ping');
    } catch (err) {
      console.error('Backend ping failed (safe to ignore if backend wakes)', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/employee/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantInfo = async () => {
    if (!restaurantId) return;
    try {
      const res = await API.get(`/restaurants/by-id/${restaurantId.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurant(res.data);
    } catch (err) {
      console.error('Error fetching restaurant info:', err);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (restaurantId && token) {
        try {
          await pingBackend();
          await fetchTasks();
          await fetchRestaurantInfo();
          setEmployeeName(decoded.name || 'Employee');
        } catch (error) {
          console.error('Initialization error:', error);
        }
      }
    };
    initialize();
  }, [restaurantId, token]);

  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const shownTasks = view === 'active' ? activeTasks : completedTasks;

  const scrollToTask = (taskId) => {
    const element = document.getElementById(`task-${taskId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSidebarOpen(false); // Close sidebar after clicking
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="relative">
      <Header />
      <Nav />
      
      {/* Employee Name Button */}
      <div className="absolute top-4 right-4">
        <button
          className="bg-green-600 text-white font-bold text-sm flex items-center justify-center rounded-full px-4 py-2 md:px-6 md:py-2 md:rounded-md md:text-base"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="block md:hidden">
            {employeeName.split(' ').map((n) => n[0]).join('')}
          </span>
          <span className="hidden md:block">
            {employeeName}
          </span>
        </button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64 space-y-4 z-50 max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-center text-gray-800">{employeeName}</h3>

          {/* Active Tasks */}
          <div>
            <button
              onClick={() => setActiveDropdownOpen(!activeDropdownOpen)}
              className="text-blue-600 font-semibold w-full text-left"
            >
              Active Tasks {activeDropdownOpen ? '▲' : '▼'}
            </button>
            {activeDropdownOpen && (
              <ul className="ml-4 mt-2 space-y-1">
                {activeTasks.map((task) => (
                  <li key={task._id}>
                    <button
                      onClick={() => scrollToTask(task._id)}
                      className="text-sm text-gray-700 hover:underline"
                    >
                      {task.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Completed Tasks */}
          <div>
            <button
              onClick={() => setCompletedDropdownOpen(!completedDropdownOpen)}
              className="text-green-600 font-semibold w-full text-left"
            >
              Completed Tasks {completedDropdownOpen ? '▲' : '▼'}
            </button>
            {completedDropdownOpen && (
              <ul className="ml-4 mt-2 space-y-1">
                {completedTasks.map((task) => (
                  <li key={task._id}>
                    <button
                      onClick={() => scrollToTask(task._id)}
                      className="text-sm text-gray-700 hover:underline"
                    >
                      {task.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Logout */}
          <div className="pt-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="p-4">
        {/* Restaurant Info */}
        {restaurant && (
          <div className="mb-6 text-center">
            <img
              src={`${BASE_IMAGE_URL}/${restaurant.logo}`}
              alt="Restaurant Logo"
              className="h-16 mx-auto mb-2"
            />
            <h2 className="text-2xl font-bold">{restaurant.name}</h2>
            <p className="text-gray-600">{restaurant.address}</p>
          </div>
        )}

        {/* Task Filters */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setView('active')}
            className={`py-2 px-4 rounded ${view === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Active Tasks
          </button>
          <button
            onClick={() => setView('completed')}
            className={`py-2 px-4 rounded ${view === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Completed Tasks
          </button>
        </div>

        {/* Task Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shownTasks.map((task) => (
            <div id={`task-${task._id}`} key={task._id}>
              <TaskCard 
                task={task} 
                employeeView 
                onComplete={(completedTaskId) => {
                  setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                      t._id === completedTaskId ? { ...t, status: 'completed' } : t
                    )
                  );
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmployeeDashboard;