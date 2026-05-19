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


  // Restore auth on refresh
  useEffect(() => {

    const token = localStorage.getItem('token');

    if (token) {

      setUser({
        authenticated: true
      });

    }

    setLoading(false);

  }, []);


  // LOGIN
  const login = async (email, password) => {

    setError(null);

    try {

      const res = await apiFetch(
        '/auth/login',
        {
          method: 'POST',

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      console.log(data);

      if (res.ok) {

        // Save JWT token
        localStorage.setItem(
          'token',
          data.data.access_token
        );

        // Save simple user session
        setUser({
          authenticated: true
        });

        return {
          success: true
        };
      }

      setError(
        data.message || 'Login failed'
      );

      return {
        success: false,
        error: data.message
      };

    } catch (err) {

      console.error(err);

      setError('Network error');

      return {
        success: false,
        error: 'Network error'
      };
    }
  };


  // LOGOUT
  const logout = () => {

    localStorage.removeItem('token');

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

        return {
          success: true
        };
      }

      setError(
        data.message || 'Registration failed'
      );

      return {
        success: false,
        error: data.message
      };

    } catch (err) {

      console.error(err);

      setError('Network error');

      return {
        success: false,
        error: 'Network error'
      };
    }
  };


  // PASSWORD RESET REQUEST
  const requestPasswordReset = async (email) => {

    setError(null);

    try {

      const res = await apiFetch(
        '/auth/password-reset/request',
        {
          method: 'POST',

          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {

        return {
          success: true,
          message: data.message
        };
      }

      setError(
        data.message || 'Request failed'
      );

      return {
        success: false,
        error: data.message
      };

    } catch (err) {

      console.error(err);

      setError('Network error');

      return {
        success: false,
        error: 'Network error'
      };
    }
  };


  // PASSWORD RESET CONFIRM
  const confirmPasswordReset = async (
    token,
    newPassword,
    confirmPassword
  ) => {

    setError(null);

    try {

      const res = await apiFetch(
        '/auth/password-reset/confirm',
        {
          method: 'POST',

          headers: {
            'Reset-Token': token
          },

          body: JSON.stringify({
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {

        return {
          success: true
        };
      }

      setError(
        data.message || 'Reset failed'
      );

      return {
        success: false,
        error: data.message
      };

    } catch (err) {

      console.error(err);

      setError('Network error');

      return {
        success: false,
        error: 'Network error'
      };
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
  };


  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>
  );
};

export default AuthContext;