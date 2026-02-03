import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, GraduationCap, Briefcase } from 'lucide-react';
import { PERSONA_OPTIONS } from '../constants';
import { UserRole } from '../types';
import { useUser } from '../context/UserContext';

export const PersonaSelection: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const getIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.Student: return <Book className="w-8 h-8 text-white" />;
      case UserRole.College: return <GraduationCap className="w-8 h-8 text-white" />;
      case UserRole.Professional: return <Briefcase className="w-8 h-8 text-white" />;
    }
  };

  const handleSelect = (role: string) => {
    updateUser({ role: role as UserRole });
    
    // Customized Routing based on Persona
    if (role === UserRole.College) {
        navigate('/higher-ed');
    } else if (role === UserRole.Student) {
        navigate('/school');
    } else if (role === UserRole.Professional) {
        navigate('/professional');
    } else {
        navigate('/dashboard');
    }
  };

  return (
    <div className="h-full p-6 pt-12 flex flex-col bg-white">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Who are you?</h2>
        <p className="text-slate-500">Let's personalize your learning journey</p>
      </div>

      <div className="flex flex-col gap-5">
        {PERSONA_OPTIONS.map((persona) => (
          <button
            key={persona.id}
            onClick={() => handleSelect(persona.id)}
            className={`relative overflow-hidden group p-6 rounded-2xl text-left transition-transform hover:scale-[1.02] active:scale-95 shadow-lg bg-gradient-to-r ${persona.gradient}`}
          >
            <div className="relative z-10">
              <div className="mb-4">
                {getIcon(persona.id as UserRole)}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{persona.title}</h3>
              <p className="text-white/80 text-sm font-medium">{persona.subtitle}</p>
            </div>
            
            {/* Decorative background circle */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};