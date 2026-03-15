import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic verification: backend handles token via cookies
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Endpoint is /api/auth/login
      const res = await api.post('/auth/login', { email, password });
      
      const userData = res.data.user || res.data; // fallback if user obj is entire response minus token

      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Login error', err.response?.data || err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      return res.data;
    } catch (err) {
      console.error('Register error', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};
