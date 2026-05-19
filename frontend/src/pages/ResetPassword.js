import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { confirmPasswordReset, error, setError } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);
    if (newPassword !== confirmPassword) return setLocalError('Passwords do not match');
    if (newPassword.length < 6) return setLocalError('Password must be at least 6 characters');
    setLoading(true);
    const res = await confirmPasswordReset(token, newPassword, confirmPassword);
    if (res.success) {
      alert('Password reset successful! Please login.');
      navigate('/login');
    } else {
      setLocalError(res.error);
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Reset Link</h1>
          <p className="mt-4">No token provided. Please request a new password reset.</p>
          <Link to="/forgot-password" className="mt-4 inline-block text-blue-600">Go to Forgot Password</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Create New Password</h1>
        {(localError || error) && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{localError || error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded-lg" required />
          <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mb-6 px-4 py-2 border rounded-lg" required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg">{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
        <p className="mt-4 text-center"><Link to="/login" className="text-blue-600">Back to Login</Link></p>
      </div>
    </div>
  );
};

export default ResetPassword;
