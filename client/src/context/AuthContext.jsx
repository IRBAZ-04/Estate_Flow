import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load user profile if token is present
  const loadUser = async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      setUser(res.data?.data || null);
      setAuthError(null);
    } catch (err) {
      console.warn('[AuthContext] Token verification failed:', err.message);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Register action
  const register = async ({ name, email, phone, password, role }) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role,
      });

      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true, user: receivedUser };
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Login action
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true, user: receivedUser };
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  // Update profile action
  const updateProfile = async (userData) => {
    try {
      const res = await api.put('/auth/profile', userData);
      setUser(res.data?.user || user);
      return { success: true, message: res.data?.message };
    } catch (err) {
      return { success: false, message: err.message || 'Update failed' };
    }
  };

  // Change password action
  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return { success: true, message: res.data?.message };
    } catch (err) {
      return { success: false, message: err.message || 'Password update failed' };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    role: user?.role || null,
    authError,
    setAuthError,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loadUser,
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

export default AuthContext;
