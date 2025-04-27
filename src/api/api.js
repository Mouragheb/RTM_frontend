import axios from 'axios';

const API = axios.create({
  baseURL: 'https://rtm-backend-m2j6.onrender.com/api', // <-- updated to Render URL
});

// Automatically attach Authorization header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;