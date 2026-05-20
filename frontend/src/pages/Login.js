import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Heart, Shield, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Alert } from '../components/ui';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get message from location state if redirected from register
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);
    
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setLocalError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"></div>
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
            Empowering Parents,<br />
            Protecting Children
          </h1>
          <p className="text-xl text-white/80 mb-12">
            The comprehensive platform for managing your child's activities, schedules, and safety.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span>Trusted by 10,000+ families worldwide</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span>Real-time activity monitoring</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-white/60 text-sm">
          © 2024 Smart Child. All rights reserved.
        </div>
      </div>
      
      {/* Right Side - Login Form */}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Enter your credentials to access your account</p>
          </div>
          
          {/* Success Message */}
          {message && (
            <Alert type="success" message={message} className="mb-6" />
          )}
          
          {/* Error Alert */}
          {(localError || error) && (
            <Alert 
              type="error" 
              title="Login Failed"
              message={localError || error} 
              onClose={() => { setLocalError(''); setError(null); }}
              className="mb-6" 
            />
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
              autoComplete="email"
            />
            
            <div>
              <Input
                label="Password"
type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
                autoComplete="current-password"
              />
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Remember me for 30 days
              </label>
            </div>
            
            <Button 
              type="submit" 
              fullWidth 
              size="lg"
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.413c0-3.008 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.971H17.336c-1.426 0-1.871.887-1.871 1.796v2.313h3.164l-.467 3.47h-2.697v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-gray-700 font-medium">Facebook</span>
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
