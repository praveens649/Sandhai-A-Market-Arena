import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('sandhai_token');
      const savedUser = localStorage.getItem('sandhai_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Failed to parse saved auth data:', err);
      localStorage.removeItem('sandhai_token');
      localStorage.removeItem('sandhai_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAuthData = (tokenValue, userValue) => {
    setToken(tokenValue);
    setUser(userValue);
    localStorage.setItem('sandhai_token', tokenValue);
    localStorage.setItem('sandhai_user', JSON.stringify(userValue));
  };

  const loginCustomer = async (email, password) => {
    const res = await api.post('/api/users/login', { email, password });
    if (res.data.success && res.data.token) {
      saveAuthData(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const loginAdmin = async (email, password) => {
    const res = await api.post('/api/admin/login', { email, password });
    if (res.data.success && res.data.token) {
      saveAuthData(res.data.token, res.data.admin);
      return res.data;
    }
    throw new Error(res.data.message || 'Admin login failed');
  };

  const signup = async ({ name, email, password, phone }) => {
    const res = await api.post('/api/users/signup', { name, email, password, phone });
    if (res.data.success && res.data.token) {
      saveAuthData(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Signup failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sandhai_token');
    localStorage.removeItem('sandhai_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'admin',
    loading,
    loginCustomer,
    loginAdmin,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

