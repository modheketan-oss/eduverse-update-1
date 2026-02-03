import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, BookOpen, Briefcase, Award, User } from 'lucide-react';
import { AIStudyBuddy } from './AIStudyBuddy';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Routes where we don't show the main app chrome (bottom nav)
  const isAuthScreen = ['/', '/persona', '/login'].includes(location.pathname);
  
  // Helper to determine active state
  const isActive = (path: string) => location.pathname === path ? 'text-purple-600' : 'text-slate-400';

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      {/* Mobile App Container Max Width Constraint */}
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        
        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto ${!isAuthScreen ? 'pb-20' : ''} no-scrollbar`}>
          {children}
        </main>

        {/* Bottom Navigation - Only for main app pages */}
        {!isAuthScreen && (
          <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-40 pb-safe">
            <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/dashboard')}`}>
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link to="/courses" className={`flex flex-col items-center gap-1 ${isActive('/courses')}`}>
              <BookOpen className="w-6 h-6" />
              <span className="text-[10px] font-medium">Courses</span>
            </Link>
            {/* Center FAB Placeholder - visually creates space for a center button if needed, or just standard spacing */}
             <Link to="/internships" className={`flex flex-col items-center gap-1 ${isActive('/internships')}`}>
              <Briefcase className="w-6 h-6" />
              <span className="text-[10px] font-medium">Intern</span>
            </Link>
            <Link to="/certificates" className={`flex flex-col items-center gap-1 ${isActive('/certificates')}`}>
              <Award className="w-6 h-6" />
              <span className="text-[10px] font-medium">Certs</span>
            </Link>
             <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile')}`}>
              <User className="w-6 h-6" />
              <span className="text-[10px] font-medium">Profile</span>
            </Link>
          </nav>
        )}

        {/* Global Components */}
        {!isAuthScreen && <AIStudyBuddy />}
      </div>
    </div>
  );
};