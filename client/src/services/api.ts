import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.31.44:3000/api', // Make sure this matches your backend port
});

// Add Token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;