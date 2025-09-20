import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast'; // <--- Import toast

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const response = await api.get('/user');
          if (response.data) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
            toast.error('Session expired. Please log in again.'); // <--- Toast
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          toast.error('Could not verify session. Please log in again.'); // <--- Toast
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const getCsrfToken = async () => {
    try {
      await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { withCredentials: true });
      return true;
    } catch (error) {
      console.error('Failed to get CSRF cookie:', error.response?.data || error.message);
      toast.error('Connection issue. Please refresh and try again.'); // <--- Toast
      return false;
    }
  };

  const login = async (email, password) => {
    const csrfSuccess = await getCsrfToken();
    if (!csrfSuccess) {
      return { success: false, message: 'Could not prepare for login. Please try again.' };
    }

    try {
      const response = await api.post('/login', { email, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      navigate('/todos');
      toast.success(`Welcome back, ${userData.name}!`); // <--- Toast
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage); // <--- Toast
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
      toast.success('Logged out successfully.'); // <--- Toast
      return { success: true, message: 'Logged out successfully.' };
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
      toast.error('Logout failed, but you have been logged out locally.'); // <--- Toast
      return { success: false, message: 'Logout failed, but you have been logged out locally.' };
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    const csrfSuccess = await getCsrfToken();
    if (!csrfSuccess) {
      return { success: false, message: 'Could not prepare for registration. Please try again.' };
    }

    try {
      const response = await api.post('/register', { name, email, password, password_confirmation });
      const { access_token, user: userData } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      navigate('/todos');
      toast.success(`Welcome, ${userData.name}! Your account is ready.`); // <--- Toast
      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(' ') : (error.response?.data?.message || 'Registration failed.');
      toast.error(errorMessage); // <--- Toast
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};