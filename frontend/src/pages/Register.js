import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Heart, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Alert } from '../components/ui';

const Register = () => {
  const [form, setForm] = useState({ 
    full_name: '', 
    email: '', 
    password: '', 
    confirm_password: '',
    role: 'parent'
  });
const [acceptTerms, setAcceptTerms] = useState(false);
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const { password } = form;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    if (strength < 30) return { strength: Math.min(strength, 25), label: 'Weak', color: 'bg-red-500' };
    if (strength < 60) return { strength: Math.min(strength, 50), label: 'Fair', color: 'bg-amber-500' };
    if (strength < 80) return { strength: Math.min(strength, 75), label: 'Good', color: 'bg-blue-500' };
    return { strength: Math.min(strength, 100), label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);
    
    if (!form.full_name || !form.email || !form.password || !form.confirm_password) {
      setLocalError('Please fill in all fields');
      return;
    }
    
    if (!acceptTerms) {
      setLocalError('Please accept the terms and conditions');
      return;
    }
    
    if (form.password !== form.confirm_password) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    
setLoading(true);
    // Include role in registration data
    const registerData = {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      confirm_password: form.confirm_password,
      role: form.role
    };
    const res = await register(registerData);
    setLoading(false);
    
    if (res.success) {
      navigate('/login', { state: { message: 'Registration successful! Please login with your credentials.' } });
    } else {
      setLocalError(res.error);
    }
  };

  const passwordRequirements = [
    { label: 'At least 6 characters', met: form.password.length >= 6 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(form.password) },
    { label: 'Contains number', met: /[0-9]/.test(form.password) },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary-600 via-secondary-700 to-primary-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -left-20 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Smart Child</span>
          </div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Join Our Growing<br />
            Family Today
          </h1>
          <p className="text-xl text-white/80 mb-12">
            Create an account to start managing your child's activities and ensure their safety.
          </p>
          
          <div className="space-y-4">
            {[
              'Free to get started',
              'No credit card required',
              'Full access to all features',
              'Cancel anytime'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-white/60 text-sm">
          © 2024 Smart Child. All rights reserved.
        </div>
      </div>
      
      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary-600">Smart Child</span>
          </div>
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
            <p className="text-gray-500">Enter your details to get started</p>
          </div>
          
          {/* Error Alert */}
          {(localError || error) && (
            <Alert 
              type="error" 
              title="Registration Failed"
              message={localError || error} 
              onClose={() => { setLocalError(''); setError(null); }}
              className="mb-6" 
            />
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="full_name"
              placeholder="Enter your full name"
              value={form.full_name}
              onChange={handleChange}
              icon={User}
              required
              autoComplete="name"
            />
            
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              icon={Mail}
              required
              autoComplete="email"
            />
            
            <div>
              <Input
                label="Password"
type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                icon={Lock}
                required
                autoComplete="new-password"
              />
              {form.password && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                  </div>
                  <div className="space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-500' : 'bg-gray-200'}`}>
                          {req.met && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={req.met ? 'text-green-600' : 'text-gray-500'}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
<Input
              label="Confirm Password"
              type="password"
              name="confirm_password"
              placeholder="Confirm your password"
              value={form.confirm_password}
              onChange={handleChange}
              icon={Lock}
              required
              autoComplete="new-password"
            />
            
            {/* Role Selection - Hidden by default, show for admin registration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="parent">Parent</option>
                <option value="caregiver">Caregiver</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Select "Admin" to access admin dashboard</p>
            </div>
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
<a href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              fullWidth 
              size="lg"
              loading={loading}
              icon={ArrowRight}
            >
              Create Account
            </Button>
          </form>
          
          <p className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
