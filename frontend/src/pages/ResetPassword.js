import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Heart, ArrowLeft, Check, KeyRound, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Alert } from '../components/ui';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
const { confirmPasswordReset, setError } = useAuth();
  const navigate = useNavigate();

const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getPasswordStrength = () => {
    if (!newPassword) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (newPassword.length >= 6) strength += 25;
    if (newPassword.length >= 8) strength += 25;
    if (/[A-Z]/.test(newPassword)) strength += 25;
    if (/[0-9]/.test(newPassword)) strength += 15;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 10;
    
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
    
    if (!newPassword || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    const res = await confirmPasswordReset(token, newPassword, confirmPassword);
    setLoading(false);
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setLocalError(res.error);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl p-8 shadow-soft">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <KeyRound className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h1>
            <p className="text-gray-500 mb-6">No token provided. Please request a new password reset.</p>
            <Link 
              to="/forgot-password" 
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Forgot Password
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl p-8 shadow-soft">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful!</h1>
            <p className="text-gray-500 mb-6">Your password has been reset. Redirecting to login...</p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -left-20 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl"></div>
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
            Create New<br />
            Password
          </h1>
          <p className="text-xl text-white/80 mb-12">
            Enter a strong password to secure your account. Make sure it's different from previous passwords.
          </p>
          
          <div className="space-y-4">
            {[
              'Use at least 8 characters',
              'Mix uppercase and lowercase letters',
              'Include numbers and special characters'
            ].map((tip, index) => (
              <div key={index} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-white/60 text-sm">
          © 2024 Smart Child. All rights reserved.
        </div>
      </div>
      
      {/* Right Side - Reset Password Form */}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create new password</h2>
            <p className="text-gray-500">Your new password must be different from previous passwords</p>
          </div>
          
          {/* Error Alert */}
          {localError && (
            <Alert 
              type="error" 
              title="Reset Failed"
              message={localError} 
              onClose={() => setLocalError('')}
              className="mb-6" 
            />
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                label="New Password"
type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={Lock}
                required
                autoComplete="new-password"
              />
              {newPassword && (
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
                </div>
              )}
            </div>
            
            <Input
              label="Confirm Password"
type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={Lock}
              required
              autoComplete="new-password"
            />
            
            {confirmPassword && newPassword === confirmPassword && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Passwords match</span>
              </div>
            )}
            
            <Button 
              type="submit" 
              fullWidth 
              size="lg"
              loading={loading}
            >
              Reset Password
            </Button>
          </form>
          
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

export default ResetPassword;
