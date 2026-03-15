import axios from 'axios';

const api = axios.create({
  // http://localhost:3000/api
  // https://api-spotify-clone.onrender.com/api
  baseURL: 'https://api-spotify-clone.onrender.com/api', // Make sure backend runs on 3000
  withCredentials: true, // Send cookies if backend uses them
});

// Request interceptor to add token from localStorage if any
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adjust if backend uses Bearer token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
