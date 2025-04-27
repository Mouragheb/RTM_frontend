import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AddRestaurant from './pages/AddRestaurant';
import MyRestaurants from './pages/MyRestaurants';
import AddTask from './pages/AddTask';
//import './index.css'; // Adjust the path if different

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/add-restaurant" element={<AddRestaurant />} />
      <Route path="/my-restaurants" element={<MyRestaurants />} />
      <Route path="/restaurant/:id/dashboard" element={<ManagerDashboard />} />
      <Route path="/restaurant/:id/employee/:empId/add-task" element={<AddTask />} />
      <Route path="/restaurant/:id/employee-dashboard" element={<EmployeeDashboard />} />
    </Routes>
  );
}

export default App;