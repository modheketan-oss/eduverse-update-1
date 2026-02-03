import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useUser } from '../context/UserContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
        setError('Please fill in all fields');
        return;
    }
    
    setIsLoading(true);
    // Simulate API call and network delay
    setTimeout(() => {
      setIsLoading(false);
      login(email);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600">
      {/* Branding Header */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-white">
        <div className="bg-white/20 p-5 rounded-3xl backdrop-blur-sm mb-6 shadow-xl">
          <GraduationCap className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">EduVerse</h1>
        <p className="text-lg opacity-90 font-medium text-center max-w-xs">
          Learn • Skill • Build • Grow
        </p>
      </div>

      {/* Login Form Container */}
      <div className="bg-white rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8"></div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Login to resume your learning journey.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                placeholder="student@eduverse.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-xs font-bold text-purple-600 hover:text-purple-700">
                Forgot Password?
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="gradient" fullWidth disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center pb-safe">
          <p className="text-slate-500 text-sm">
            New to EduVerse?{' '}
            <button onClick={() => navigate('/register')} className="font-bold text-purple-600 hover:text-purple-700">
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};