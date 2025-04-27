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
  const [managerName, setManagerName] = useState('');
  const [myRestaurants, setMyRestaurants] = useState([]);
  const [restaurantsDropdown, setRestaurantsDropdown] = useState(false);
  const [employeesDropdown, setEmployeesDropdown] = useState(false);
  const [tasksDropdown, setTasksDropdown] = useState(false);
  const [activeTasksDropdown, setActiveTasksDropdown] = useState(false);
  const [completedTasksDropdown, setCompletedTasksDropdown] = useState(false);

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
        const res = await API.get('/restaurants/my-restaurants', {
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
          API.get(`/restaurants/${restaurantId}`, { headers }),
          API.get('/auth/employees', { headers }),
          API.get(`/tasks/restaurant/${restaurantId}`, { headers }),
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
        await API.delete(`/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Delete this employee?')) {
      try {
        await API.delete(`/auth/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees((prev) => prev.filter((e) => e._id !== employeeId));
      } catch (err) {
        console.error('Failed to delete employee:', err);
      }
    }
  };

  const handleDeleteRestaurant = async () => {
    if (window.confirm('Delete this restaurant?')) {
      try {
        await API.delete(`/restaurants/${restaurantId}`, {
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
        ? emp.restaurant?._id?.toString()
        : emp.restaurant?.toString();
    return empRestaurantId === restaurantId;
  });

  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const shownTasks = view === 'active' ? activeTasks : completedTasks;

  const scrollToTask = (taskId) => {
    const element = document.getElementById(`task-${taskId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <Header />
      <Nav />

      {/* Manager name button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          className="bg-blue-600 text-white font-bold text-sm flex items-center justify-center rounded-full px-4 py-2 md:px-6 md:py-2 md:rounded-md md:text-base"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="block md:hidden">
            {managerName.split(' ').map((n) => n[0]).join('')}
          </span>
          <span className="hidden md:block">
            {managerName}
          </span>
        </button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64 space-y-4 z-50 max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-center text-gray-800">{managerName}</h3>

          {/* My Restaurants Dropdown */}
          <div>
            <button
              onClick={() => setRestaurantsDropdown(!restaurantsDropdown)}
              className="text-blue-600 font-semibold w-full text-left"
            >
              My Restaurants {restaurantsDropdown ? '▲' : '▼'}
            </button>
            {restaurantsDropdown && (
              <ul className="ml-4 mt-2 space-y-1">
                {myRestaurants.map((r) => (
                  <li key={r._id}>
                    <button
                      onClick={() => {
                        navigate(`/restaurant/${r._id}/dashboard`);
                        setSidebarOpen(false);
                      }}
                      className="text-sm text-gray-700 hover:underline"
                    >
                      {r.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Employees Dropdown */}
          <div>
            <button
              onClick={() => setEmployeesDropdown(!employeesDropdown)}
              className="text-green-600 font-semibold w-full text-left"
            >
              Employees {employeesDropdown ? '▲' : '▼'}
            </button>
            {employeesDropdown && (
              <ul className="ml-4 mt-2 space-y-1">
                {filteredEmployees.map((emp) => (
                  <li key={emp._id} className="text-sm text-gray-700">
                    {emp.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tasks Dropdown */}
          <div>
            <button
              onClick={() => setTasksDropdown(!tasksDropdown)}
              className="text-purple-600 font-semibold w-full text-left"
            >
              Tasks {tasksDropdown ? '▲' : '▼'}
            </button>
            {tasksDropdown && (
              <div className="ml-4 mt-2 space-y-2">
                {/* Active Tasks */}
                <div>
                  <button
                    onClick={() => setActiveTasksDropdown(!activeTasksDropdown)}
                    className="text-blue-500 font-semibold w-full text-left"
                  >
                    Active Tasks {activeTasksDropdown ? '▲' : '▼'}
                  </button>
                  {activeTasksDropdown && (
                    <ul className="ml-4 mt-1 space-y-1">
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
                    onClick={() => setCompletedTasksDropdown(!completedTasksDropdown)}
                    className="text-green-500 font-semibold w-full text-left"
                  >
                    Completed Tasks {completedTasksDropdown ? '▲' : '▼'}
                  </button>
                  {completedTasksDropdown && (
                    <ul className="ml-4 mt-1 space-y-1">
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
              </div>
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

      {/* MAIN CONTENT */}
      <main className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-6">Manager Dashboard</h2>

        {loading ? (
          <p>Loading data...</p>
        ) : restaurant ? (
          <>
            {/* Restaurant Info */}
            <div className="mx-auto max-w-md bg-gray-100 p-6 rounded-md shadow-md">
              <img
                src={`${BASE_IMAGE_URL}/${restaurant.logo}`}
                alt="Restaurant Logo"
                className="w-24 h-24 mx-auto object-contain mb-3"
              />
              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
              <p>{restaurant.address}</p>
              <div className="flex justify-center items-center gap-3 mt-3">
                <span className="text-sm text-gray-700"><strong>ID:</strong> {restaurantId}</span>
                <button onClick={copyToClipboard} className="text-sm bg-blue-500 text-white px-2 py-1 rounded">
                  Copy ID
                </button>
                {copySuccess && <small className="text-green-600">{copySuccess}</small>}
              </div>
              <button
                onClick={handleDeleteRestaurant}
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded"
              >
                Remove Restaurant
              </button>
            </div>

            {/* Employees */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4">Employees</h3>
              <ul className="space-y-3">
                {filteredEmployees.map((emp) => (
                  <li
                    key={emp._id}
                    className="bg-gray-200 flex justify-between items-center px-4 py-2 rounded-md"
                  >
                    <span>{emp.name}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => navigate(`/restaurant/${restaurantId}/employee/${emp._id}/add-task`)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                      >
                        + Add Task
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tasks */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4">Tasks</h3>
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => setView('active')}
                  className={`px-4 py-2 rounded ${view === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                  Active Tasks
                </button>
                <button
                  onClick={() => setView('completed')}
                  className={`px-4 py-2 rounded ${view === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                  Completed Tasks
                </button>
              </div>

              {shownTasks.length === 0 ? (
                <p>No tasks in this view.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shownTasks.map((task) => (
                    <div key={task._id} id={`task-${task._id}`} className="bg-white border p-4 rounded shadow-sm text-left">
                      <h4 className="font-bold">{task.title}</h4>
                      <p><strong>Status:</strong> {task.status}</p>
                      <p><strong>Assigned:</strong> {task.assignedTo?.name || 'N/A'}</p>
                      <p><strong>Due:</strong> {task.dueDate?.slice(0, 10) || '—'}</p>
                      <p><strong>Description:</strong> {task.description || 'None'}</p>
                      {/* Photos */}
                      {task.status === 'completed' ? (
                        <div className="flex gap-3 mt-2">
                          {task.photoBefore && (
                            <div>
                              <p className="font-medium">Before:</p>
                              <img src={`${BASE_IMAGE_URL}/${task.photoBefore}`} alt="Before" className="rounded w-full" />
                            </div>
                          )}
                          {task.photoAfter && (
                            <div>
                              <p className="font-medium">After:</p>
                              <img src={`${BASE_IMAGE_URL}/${task.photoAfter}`} alt="After" className="rounded w-full" />
                            </div>
                          )}
                        </div>
                      ) : (
                        task.photoBefore && (
                          <div className="mt-2">
                            <p className="font-medium">Task Image:</p>
                            <img src={`${BASE_IMAGE_URL}/${task.photoBefore}`} alt="Before" className="rounded w-full" />
                          </div>
                        )
                      )}
                      {/* Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                        <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
                          Archive
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p>Restaurant not found.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ManagerDashboard;