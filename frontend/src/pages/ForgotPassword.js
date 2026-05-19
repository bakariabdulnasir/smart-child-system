import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState('');
  const { requestPasswordReset, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setMessage('');
    setError(null);
    const res = await requestPasswordReset(email);
    if (res.success) setMessage(res.message);
    else setLocalError(res.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{message}</div>}
        {(localError || error) && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{localError || error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-6 px-4 py-2 border rounded-lg" required />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Send Reset Link</button>
        </form>
        <p className="mt-4 text-center"><Link to="/login" className="text-blue-600">Back to Login</Link></p>
      </div>
    </div>
  );
};

export default ForgotPassword;
