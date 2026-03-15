import axios from 'axios';

const api = axios.create({
  // http://localhost:3000/api
  // https://api-spotify-clone.onrender.com/api
  baseURL: 'https://api-spotify-clone.onrender.com/api', // Make sure backend runs on 3000
  withCredentials: true, // Send cookies if backend uses them
});



export default api;
