import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, TrendingUp, Award, PlayCircle, ArrowRight, Zap, Target, Linkedin, ArrowLeft } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { useUser } from '../context/UserContext';
import { MOCK_INTERNSHIPS } from '../constants';

export const ProfessionalLanding: React.FC = () => {
  const navigate = useNavigate();
  const { courses } = useCourse();
  const { user } = useUser();

  // Filter for Professional content (Skills & Business)
  const professionalCourses = courses.filter(c => c.category === 'Skills' || c.category === 'Business');
  
  // Get in-progress items
  const inProgress = professionalCourses.filter(c => c.progress > 0 && c.progress < 100);

  // Get internships/jobs
  const jobs = MOCK_INTERNSHIPS.slice(0, 3);

  const handleApply = (url?: string, title?: string) => {
    if (url) {
        window.open(url, '_blank');
    } else {
        const query = encodeURIComponent(title || 'Internships');
        window.open(`https://www.linkedin.com/jobs/search/?keywords=${query}`, '_blank');
    }
  };

  return (
    <div className="pb-8 bg-slate-50 min-h-full">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white rounded-b-[2.5rem] p-8 pt-12 shadow-xl relative overflow-hidden">
        {/* Abstract Corporate Art */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-600 to-transparent opacity-20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600 opacity-10 rounded-full -ml-20 -mb-20 blur-3xl"></div>

        <div className="relative z-10">
            {/* Back Button */}
            <button 
                onClick={() => navigate('/persona')} 
                className="absolute top-0 left-0 p-2 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition mb-4 -ml-2"
                style={{ marginTop: '-1rem' }} 
            >
                <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6 mt-8">
                <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                    Professional Suite
                </span>
            </div>
            
            <h1 className="text-3xl font-bold leading-tight mb-3">
              Grow with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
                Industry Skills
              </span>
            </h1>
            <p className="text-slate-400 text-sm mb-8 max-w-xs leading-relaxed">
                Upskill in Emerging Tech and Business Leadership to accelerate your career trajectory.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                    <Target className="w-6 h-6 text-fuchsia-400 mb-2" />
                    <p className="text-xs text-slate-400">Career Goal</p>
                    <p className="font-semibold text-sm">Sr. Developer</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                    <Zap className="w-6 h-6 text-amber-400 mb-2" />
                    <p className="text-xs text-slate-400">Skill Focus</p>
                    <p className="font-semibold text-sm">GenAI & Cloud</p>
                </div>
            </div>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-8">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => navigate('/courses', { state: { category: 'Skills' } })}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group hover:border-indigo-100 transition"
            >
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-slate-800">Tech Skills</h3>
                    <p className="text-xs text-slate-500">AI, Web, Cloud</p>
                </div>
            </button>

            <button 
                onClick={() => navigate('/courses', { state: { category: 'Business' } })}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group hover:border-fuchsia-100 transition"
            >
                <div className="w-10 h-10 bg-fuchsia-50 rounded-lg flex items-center justify-center text-fuchsia-600 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-slate-800">Business</h3>
                    <p className="text-xs text-slate-500">MBA & Startup</p>
                </div>
            </button>
        </div>

        {/* Continue Learning or Recommended */}
        <div>
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                    {inProgress.length > 0 ? 'Resume Progress' : 'Recommended for You'}
                </h2>
                <button 
                     onClick={() => navigate('/courses', { state: { category: 'Skills' } })}
                     className="text-indigo-600 text-xs font-bold"
                >
                    View Library
                </button>
             </div>

             <div className="flex flex-col gap-4">
                {(inProgress.length > 0 ? inProgress : professionalCourses.slice(0, 3)).map(course => (
                    <div 
                        key={course.id}
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:shadow-md transition"
                    >
                         <div className={`w-16 h-16 rounded-lg ${course.imageColor} shrink-0 flex items-center justify-center text-white`}>
                            <PlayCircle className="w-8 h-8 opacity-80" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-slate-900 truncate mb-1">{course.title}</h3>
                            </div>
                            
                            {course.progress > 0 ? (
                                <div className="mt-2">
                                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                        <span>Progress</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className={`h-full ${course.imageColor} w-[${course.progress}%]`}></div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 mt-1">{course.lessonsCount} Lessons • {course.duration}</p>
                            )}
                        </div>
                    </div>
                ))}
             </div>
        </div>

        {/* Open Opportunities (Internships/Jobs) */}
        <div>
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                    Open Positions
                </h2>
                <button 
                     onClick={() => navigate('/internships')}
                     className="text-indigo-600 text-xs font-bold"
                >
                    View Board
                </button>
             </div>

             <div className="space-y-3">
                {jobs.map(job => (
                    <div 
                        key={job.id}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group"
                    >
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-700 font-bold text-xs border border-slate-200">
                                {job.company.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                                <p className="text-xs text-slate-500">{job.company} • {job.totalWeeks} Weeks</p>
                            </div>
                         </div>
                         <button 
                            onClick={() => handleApply(job.linkedinUrl, job.title)}
                            className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 flex items-center gap-1"
                        >
                            <Linkedin className="w-3 h-3" />
                            Apply
                         </button>
                    </div>
                ))}
             </div>
        </div>

        {/* Career Growth Banner */}
        <div className="bg-gradient-to-r from-slate-800 to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Get Certified</h3>
                <p className="text-slate-300 text-sm mb-4 max-w-[80%]">
                    Earn verified certificates to showcase on your LinkedIn profile.
                </p>
                <button 
                    onClick={() => navigate('/certificates')}
                    className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
                >
                    <Award className="w-4 h-4" />
                    View Certificates
                </button>
            </div>
             <Award className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
        </div>
      </div>
    </div>
  );
};