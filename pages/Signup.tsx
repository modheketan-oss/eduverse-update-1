import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useUser } from '../context/UserContext';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
        setError('Please fill in all fields');
        return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      signup(name, email);
      navigate('/persona'); // Go to persona selection after signup
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-600">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-white">
        <div className="bg-white/20 p-5 rounded-3xl backdrop-blur-sm mb-6 shadow-xl">
          <GraduationCap className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Join EduVerse</h1>
        <p className="text-lg opacity-90 font-medium text-center">Start your journey today</p>
      </div>

      <div className="bg-white rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8"></div>
        
        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

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
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button variant="gradient" fullWidth disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center pb-safe">
          <p className="text-slate-500 text-sm">
            Already have an account?{' '}
            <button onClick={() => navigate('/')} className="font-bold text-purple-600 hover:text-purple-700">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};