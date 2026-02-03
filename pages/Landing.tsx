import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '../components/Button';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col justify-between p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white">
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-sm mb-4">
          <GraduationCap className="w-20 h-20 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">EduVerse</h1>
        <p className="text-lg opacity-90 font-medium">Learn • Skill • Build • Grow</p>
        <p className="text-center text-sm opacity-80 max-w-xs font-light leading-relaxed">
          To empower learners of all ages by providing high-quality education.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <Button onClick={() => navigate('/persona')} className="text-purple-700">
          Get Started
        </Button>
        <Button variant="outline" onClick={() => navigate('/login')}>
          Login
        </Button>
      </div>
    </div>
  );
};