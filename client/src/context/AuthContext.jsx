import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

/**
 * Safely decodes base64url-encoded payload of a standard JWT token.
 * Extracts { id, email, role, name, iat, exp }.
 */
export const decodeJwtPayload = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.warn('Failed to parse JWT payload:', err);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('sandhai_token');
      const savedUser = localStorage.getItem('sandhai_user');

      if (savedToken) {
        const payload = decodeJwtPayload(savedToken);

        // Check if token has expired
        if (payload?.exp && payload.exp * 1000 < Date.now()) {
          console.warn('[Auth] JWT token expired. Clearing authentication session.');
          localStorage.removeItem('sandhai_token');
          localStorage.removeItem('sandhai_user');
          setToken(null);
          setUser(null);
        } else {
          setToken(savedToken);
          const parsedUser = savedUser ? JSON.parse(savedUser) : {};
          // Merge with authoritative claims from signed JWT payload
          setUser({
            ...parsedUser,
            ...(payload?.role ? { role: payload.role } : {}),
            ...(payload?.email ? { email: payload.email } : {}),
            ...(payload?.name ? { name: payload.name } : {}),
            ...(payload?.id ? { id: payload.id, _id: payload.id } : {}),
          });
        }
      }
    } catch (err) {
      console.error('Failed to parse saved auth data:', err);
      localStorage.removeItem('sandhai_token');
      localStorage.removeItem('sandhai_user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAuthData = (tokenValue, userValue) => {
    const payload = decodeJwtPayload(tokenValue);
    const finalUser = {
      ...(userValue || {}),
      ...(payload?.role ? { role: payload.role } : {}),
      ...(payload?.email ? { email: payload.email } : {}),
      ...(payload?.name ? { name: payload.name } : {}),
      ...(payload?.id ? { id: payload.id, _id: payload.id } : {}),
    };
    setToken(tokenValue);
    setUser(finalUser);
    localStorage.setItem('sandhai_token', tokenValue);
    localStorage.setItem('sandhai_user', JSON.stringify(finalUser));
    return { token: tokenValue, user: finalUser, payload };
  };

  const loginCustomer = async (email, password) => {
    const res = await api.post('/api/users/login', { email, password });
    if (res.data.success && res.data.token) {
      const saved = saveAuthData(res.data.token, res.data.user);
      const role = saved.payload?.role || saved.user?.role || 'user';
      return { ...res.data, role, user: saved.user };
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const loginAdmin = async (email, password) => {
    const res = await api.post('/api/admin/login', { email, password });
    if (res.data.success && res.data.token) {
      const saved = saveAuthData(res.data.token, res.data.admin);
      const role = saved.payload?.role || saved.user?.role || 'admin';
      return { ...res.data, role, user: saved.user };
    }
    throw new Error(res.data.message || 'Admin login failed');
  };

  const signup = async ({ name, email, password, phone }) => {
    const res = await api.post('/api/users/signup', { name, email, password, phone });
    if (res.data.success && res.data.token) {
      const saved = saveAuthData(res.data.token, res.data.user);
      const role = saved.payload?.role || saved.user?.role || 'user';
      return { ...res.data, role, user: saved.user };
    }
    throw new Error(res.data.message || 'Signup failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sandhai_token');
    localStorage.removeItem('sandhai_user');
  };

  // Derive role and properties directly from the active JWT payload
  const activePayload = decodeJwtPayload(token);
  const isExpired = activePayload?.exp ? activePayload.exp * 1000 < Date.now() : false;
  const role = !isExpired ? (activePayload?.role || user?.role || null) : null;
  const isAuthenticated = Boolean(token && user && role && !isExpired);
  const isAdmin = role === 'admin';
  const isCustomer = role === 'user';

  const value = {
    user,
    token,
    jwtPayload: activePayload,
    role,
    isAuthenticated,
    isAdmin,
    isCustomer,
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
