import axios from 'axios';

const API = axios.create({
  baseURL: 'https://rtm-backend-m2j6.onrender.com', // make sure this is correct!
});

export default API;