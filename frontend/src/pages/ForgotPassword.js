import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Alert } from '../components/ui';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestPasswordReset, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setMessage('');
    setError(null);
    
    if (!email) {
      setLocalError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    const res = await requestPasswordReset(email);
    setLoading(false);
    
    if (res.success) {
      setMessage(res.message || 'Password reset link has been sent to your email');
    } else {
      setLocalError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 via-accent-700 to-primary-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl"></div>
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
            Reset Your<br />
            Password
          </h1>
          <p className="text-xl text-white/80 mb-12">
            Don't worry, we'll help you get back into your account. Enter your email and we'll send you a reset link.
          </p>
          
          <div className="flex items-center gap-4 text-white/90">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Secure Reset</h3>
              <p className="text-sm text-white/70">We send a secure link to reset your password</p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-white/60 text-sm">
          © 2024 Smart Child. All rights reserved.
        </div>
      </div>
      
      {/* Right Side - Forgot Password Form */}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot password?</h2>
            <p className="text-gray-500">Enter your email and we'll send you a reset link</p>
          </div>
          
          {/* Success Message */}
          {message && (
            <Alert 
              type="success" 
              title="Email Sent!"
              message={message} 
              className="mb-6" 
            />
          )}
          
          {/* Error Alert */}
          {(localError || error) && (
            <Alert 
              type="error" 
              title="Reset Failed"
              message={localError || error} 
              onClose={() => { setLocalError(''); setError(null); }}
              className="mb-6" 
            />
          )}
          
          {!message ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
                autoComplete="email"
              />
              
              <Button 
                type="submit" 
                fullWidth 
                size="lg"
                loading={loading}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-gray-600 mb-6">
                Check your inbox and click the reset link to create a new password.
              </p>
              <Button 
                type="button"
                onClick={() => { setMessage(''); setEmail(''); }}
                variant="outline"
                fullWidth
              >
                Send Again
              </Button>
            </div>
          )}
          
          <div className="mt-8 flex items-center justify-center">
            <Link to="/login" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
