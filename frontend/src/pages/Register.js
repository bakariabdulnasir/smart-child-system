import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
  const [localError, setLocalError] = useState('');
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);
    if (form.password !== form.confirm_password) return setLocalError('Passwords do not match');
    if (form.password.length < 6) return setLocalError('Password must be at least 6 characters');
    const res = await register(form);
    if (res.success) navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    else setLocalError(res.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        {(localError || error) && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{localError || error}</div>}
        <form onSubmit={handleSubmit}>
          <input name="full_name" placeholder="Full Name" onChange={handleChange} className="w-full mb-4 px-4 py-2 border rounded-lg" required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full mb-4 px-4 py-2 border rounded-lg" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full mb-4 px-4 py-2 border rounded-lg" required />
          <input name="confirm_password" type="password" placeholder="Confirm Password" onChange={handleChange} className="w-full mb-6 px-4 py-2 border rounded-lg" required />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg">Register</button>
        </form>
        <p className="mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
