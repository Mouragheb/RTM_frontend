import axios from 'axios';

const API = axios.create({
  baseURL: 'https://rtm-backend-m2j6.onrender.com',
});

export default API;