import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);
    const res = await login(email, password);
    if (res.success) navigate('/dashboard');
    else setLocalError(res.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Smart Child</h1>
        {(localError || error) && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{localError || error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded-lg" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 px-4 py-2 border rounded-lg" required />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Login</button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="text-sm text-blue-600">Forgot password?</Link>
          <p className="mt-4">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;