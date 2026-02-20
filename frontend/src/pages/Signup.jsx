import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const user = await signup(name, email, password);
      if (user) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex" data-testid="signup-page">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-950 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative z-10">
          <Link to="/">
            <Logo size={48} />
          </Link>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            Start building today
          </h1>
          <p className="text-gray-400 text-lg">
            Join thousands of creators using AI to build their dream applications without writing code.
          </p>
        </div>
        
        <div className="relative z-10 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Blue Lotus. All rights reserved.
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/">
              <Logo size={40} />
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2" data-testid="signup-title">Create your account</h2>
          <p className="text-gray-400 mb-8">Start your free trial - no credit card required</p>

          {error && (
            <div 
              className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
              data-testid="signup-error"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="signup-form">
            <div>
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10 h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500"
                  required
                  disabled={loading}
                  data-testid="signup-name-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500"
                  required
                  disabled={loading}
                  data-testid="signup-email-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="pl-10 pr-10 h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500"
                  required
                  disabled={loading}
                  data-testid="signup-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms"
                className="w-4 h-4 mt-1 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-gray-400 text-sm">
                I agree to the{' '}
                <Link to="/legal/terms" className="text-blue-400 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/legal/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all hover:shadow-lg hover:shadow-blue-600/25"
              data-testid="signup-submit-button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline font-medium" data-testid="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
