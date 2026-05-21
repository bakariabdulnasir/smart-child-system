import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';

import { apiFetch } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate token with backend
  const validateToken = async (token) => {
    try {
      const res = await apiFetch('/auth/validate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        return { valid: true, data: data.data };
      } else {
        return { valid: false, data: null };
      }
    } catch (err) {
      console.error('Token validation error:', err);
      return { valid: false, data: null };
    }
  };

  // Restore auth on refresh with validation
  useEffect(() => {
    const restoreAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken) {
        // Validate token with backend
        const validation = await validateToken(storedToken);
        
if (validation.valid && validation.data) {
          setUser({
            authenticated: true,
            role: validation.data.role,
            full_name: validation.data.full_name,
            email: validation.data.email,
            id: validation.data.id,
            profile_image: validation.data.profile_image || null
          });
          localStorage.setItem('user', JSON.stringify({...validation.data, profile_image: validation.data.profile_image || null}));
} else if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({
            authenticated: true,
            role: userData.role,
            full_name: userData.full_name,
            email: userData.email,
            id: userData.id,
            profile_image: userData.profile_image || null,
            sessionExpired: true
          });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }

      setLoading(false);
    };

    restoreAuth();
  }, []);


  // LOGIN
const login = async (email, password) => {

    setError(null);

    try {
      const res = await apiFetch(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Save JWT token
        localStorage.setItem('token', data.data.access_token);
        
        // Also store user info for session restoration
        const userInfo = {
          ...data.data.user,
          profile_image: data.data.user.profile_image || null
        };
        localStorage.setItem('user', JSON.stringify(userInfo));

        // Save user session with role and full info
        setUser({
          authenticated: true,
          role: data.data.user.role,
          full_name: data.data.user.full_name,
          email: data.data.user.email,
          id: data.data.user.id,
          profile_image: data.data.user.profile_image || null
        });

        return { success: true };
      }

      setError(data.message || 'Login failed');
      return { success: false, error: data.message };

    } catch (err) {
      console.error(err);
      setError('Network error');
      return { success: false, error: 'Network error' };
    }
  };


  // LOGOUT - Enhanced to properly clear all session data
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };


  // REGISTER
  const register = async (userData) => {

    setError(null);

    try {
      const res = await apiFetch(
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(userData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        return { success: true };
      }

      setError(data.message || 'Registration failed');
      return { success: false, error: data.message };

    } catch (err) {
      console.error(err);
      setError('Network error');
      return { success: false, error: 'Network error' };
    }
  };


  // PASSWORD RESET REQUEST
  const requestPasswordReset = async (email) => {

    setError(null);

    try {
      const res = await apiFetch(
        '/auth/forgot-password',
        {
          method: 'POST',
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        return {
          success: true,
          message: data.message || 'Password reset link has been sent to your email'
        };
      }

      setError(data.message || 'Request failed');
      return { success: false, error: data.message };

    } catch (err) {
      console.error(err);
      setError('Network error');
      return { success: false, error: 'Network error' };
    }
  };


  // PASSWORD RESET CONFIRM
  const confirmPasswordReset = async (token, newPassword, confirmPassword) => {

    setError(null);

    try {
      const res = await apiFetch(
        '/auth/reset-password',
        {
          method: 'POST',
          body: JSON.stringify({
            token: token,
            password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        return {
          success: true,
          message: data.message || 'Password reset successful'
        };
      }

      setError(data.message || 'Reset failed');
      return { success: false, error: data.message };

    } catch (err) {
      console.error(err);
      setError('Network error');
      return { success: false, error: 'Network error' };
    }
  };


const value = {
    user,
    loading,
    error,
    setError,
    login,
    logout,
    register,
    requestPasswordReset,
    confirmPasswordReset,
    setUser,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
