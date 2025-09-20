import axios from 'axios';

// Create a custom Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use Vite's env variable
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Sanctum's CSRF cookie
});

// Request Interceptor: Add the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token expiration/invalidity
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: If 401 Unauthorized, automatically log out
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Optionally, redirect to login page if user is currently on a protected route
      // window.location.href = '/login'; // Or use react-router-dom's navigate
      // For now, let AuthContext handle navigation
    }
    return Promise.reject(error);
  }
);

export default api;