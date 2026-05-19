import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiFetch('/auth/me');
        if (res.ok) setUser(await res.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        return { success: true };
      }
      setError(data.error || 'Login failed');
      return { success: false, error: data.error };
    } catch (err) {
      setError('Network error');
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) return { success: true };
      setError(data.error || 'Registration failed');
      return { success: false, error: data.error };
    } catch (err) {
      setError('Network error');
      return { success: false, error: 'Network error' };
    }
  };

  const requestPasswordReset = async (email) => {
    setError(null);
    try {
      const res = await apiFetch('/auth/password-reset/request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) return { success: true, message: data.message };
      setError(data.error || 'Request failed');
      return { success: false, error: data.error };
    } catch (err) {
      setError('Network error');
      return { success: false, error: 'Network error' };
    }
  };

  const confirmPasswordReset = async (token, newPassword, confirmPassword) => {
    setError(null);
    try {
      const res = await apiFetch('/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Reset-Token': token },
        body: JSON.stringify({ new_password: newPassword, confirm_password: confirmPassword }),
      });
      const data = await res.json();
      if (res.ok) return { success: true };
      setError(data.error || 'Reset failed');
      return { success: false, error: data.error };
    } catch (err) {
      setError('Network error');
      return { success: false, error: 'Network error' };
    }
  };

  const value = {
    user, loading, error, setError,
    login, logout, register, requestPasswordReset, confirmPasswordReset,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
