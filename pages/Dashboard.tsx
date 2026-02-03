import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserCircle, Search, BookOpen, Award, Briefcase, ChevronRight, TrendingUp, GraduationCap, LayoutDashboard, Crown, Lock, PlayCircle } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { useUser } from '../context/UserContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { courses } = useCourse();
  const { user } = useUser();
  
  const isPremium = user?.isPremium;

  // Filter courses that have started but are not complete
  const activeCourses = courses.filter(c => c.progress > 0 && c.progress < 100).sort((a, b) => b.progress - a.progress).slice(0, 3);

  return (
    <div className="pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-6 pt-10 rounded-b-[2.5rem] shadow-xl pb-12">
        <div className="flex justify-between items-center mb-6">
          {/* Logo / Symbol Section */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-inner">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
               <h1 className="text-xl font-bold text-white tracking-tight leading-none">EduVerse</h1>
               {isPremium && (
                 <div className="flex items-center gap-1 mt-1">
                   <Crown className="w-3 h-3 text-yellow-300 fill-current" />
                   <span className="text-[10px] font-bold text-yellow-200 uppercase tracking-wider">Premium</span>
                 </div>
               )}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="p-2 bg-white/10 rounded-full backdrop-blur-sm text-white hover:bg-white/20 transition">
              <Bell className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/profile')} className="p-2 bg-white/10 rounded-full backdrop-blur-sm text-white hover:bg-white/20 transition">
              <UserCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 text-white placeholder-white/60 mb-2">
          <Search className="w-5 h-5 opacity-70" />
          <input 
            type="text" 
            placeholder="Search courses, skills, internships" 
            className="bg-transparent border-none outline-none w-full text-sm placeholder-white/60"
          />
        </div>
      </div>

      {/* Dashboard Entry Point */}
      <div className="px-6 -mt-7 relative z-10 mb-6">
         <button 
            onClick={() => navigate('/analytics')}
            className="w-full bg-white p-4 rounded-2xl shadow-lg shadow-indigo-900/5 border border-slate-100 flex items-center justify-between group hover:scale-[1.02] transition-all"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-indigo-500/30 transition-shadow">
                    <LayoutDashboard className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-slate-800 text-sm">My Learning Dashboard</h3>
                    <p className="text-xs text-slate-500 font-medium">Track progress & stats</p>
                </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                 <ChevronRight className="w-4 h-4" />
            </div>
        </button>
      </div>

      <div className="px-6">
        
        {/* Real Continue Learning Block (Conditional) */}
        {activeCourses.length > 0 && (
          <div className="mb-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-end mb-3">
               <h2 className="text-lg font-bold text-slate-800">Jump Back In</h2>
             </div>
             <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
               {activeCourses.map(course => (
                 <div 
                    key={course.id}
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="min-w-[260px] bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-purple-100 hover:shadow-md transition"
                 >
                    <div className={`w-12 h-12 rounded-xl ${course.imageColor} shrink-0 flex items-center justify-center text-white`}>
                        <PlayCircle className="w-6 h-6 opacity-90" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h3 className="font-bold text-slate-800 text-sm truncate mb-1">{course.title}</h3>
                       <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full ${course.imageColor}`} style={{ width: `${course.progress}%` }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{course.progress}%</span>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Explore Modules */}
        <h2 className="text-lg font-bold text-slate-800 mb-4">Explore Modules</h2>
        <div className="flex flex-col gap-4">
          <ModuleCard 
            title="Academic Excellence" 
            subtitle="K-12 Syllabus"
            icon={<BookOpen className="w-6 h-6 text-white" />}
            gradient="from-cyan-500 to-blue-500"
            onClick={() => navigate('/school')}
          />
           <ModuleCard 
            title="Higher Education" 
            subtitle="Degree & Diploma"
            icon={<GraduationCap className="w-6 h-6 text-white" />}
            gradient="from-blue-600 to-indigo-600"
            onClick={() => navigate('/higher-ed')}
          />
          <ModuleCard 
            title="Certified Skills" 
            subtitle="AI, EV & Software"
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            gradient="from-fuchsia-500 to-pink-500"
            onClick={() => navigate('/courses', { state: { category: 'Skills' } })}
          />
           <ModuleCard 
            title="Business School" 
            subtitle="Leadership & Startup"
            icon={<Award className="w-6 h-6 text-white" />}
            gradient="from-indigo-500 to-purple-600"
            onClick={() => navigate('/courses', { state: { category: 'Business' } })}
          />
          
          {/* Advanced Section (Gated but visible) */}
          <ModuleCard 
            title="Advanced Masterclass" 
            subtitle={isPremium ? "Unlocked" : "Try Free Preview"}
            icon={<Crown className="w-6 h-6 text-white" />}
            gradient="from-amber-500 to-yellow-600"
            onClick={() => navigate('/courses', { state: { category: 'Advanced' } })}
            isLocked={!isPremium}
          />

          <ModuleCard 
            title="Professional Internships" 
            subtitle="Live Projects"
            icon={<Briefcase className="w-6 h-6 text-white" />}
            gradient="from-orange-500 to-red-500"
            onClick={() => navigate('/internships')}
          />
        </div>
      </div>
    </div>
  );
};

const ModuleCard = ({ title, subtitle, icon, gradient, onClick, isLocked }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 rounded-2xl bg-gradient-to-r ${gradient} text-white flex items-center justify-between shadow-lg shadow-purple-900/5 transition-transform active:scale-95`}
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm relative">
        {icon}
        {isLocked && (
            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <Lock className="w-3 h-3 text-red-500" />
            </div>
        )}
      </div>
      <div className="text-left">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-white/80 text-sm">{subtitle}</p>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-white/70" />
  </button>
);