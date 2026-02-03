import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Briefcase, PlayCircle, Star } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { MOCK_INTERNSHIPS } from '../constants';

export const HigherEdLanding: React.FC = () => {
  const navigate = useNavigate();
  const { courses } = useCourse();

  // Filter for Higher Education content
  const higherEdCourses = courses.filter(c => c.category === 'Higher Ed');
  // Include specific skill courses relevant to college students
  const skillCourses = courses.filter(c => c.category === 'Skills').slice(0, 2);

  const availableInternships = MOCK_INTERNSHIPS.filter(i => i.status === 'Available').slice(0, 3);

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
      {/* specialized Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 text-white rounded-b-[2.5rem] p-8 pt-12 shadow-xl relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

        <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/10 mb-4">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Higher Education Track</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight mb-2">Elevate Your Degree</h1>
            <p className="text-blue-100 text-sm mb-6 max-w-xs">
                Specialized courses for Engineering, Medical, and Management students tailored to your semester syllabus.
            </p>
            
            <div className="flex gap-3">
                <button 
                    onClick={() => navigate('/courses', { state: { category: 'Higher Ed' } })}
                    className="flex-1 bg-white text-blue-700 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-50 transition"
                >
                    Browse Syllabus
                </button>
                 <button 
                    onClick={() => navigate('/internships')}
                    className="flex-1 bg-blue-600 border border-blue-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-500 transition"
                >
                    Find Internships
                </button>
            </div>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-8">
        
        {/* Semester Courses Section */}
        <div>
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-slate-800">Semester Focus</h2>
                <button 
                    onClick={() => navigate('/courses', { state: { category: 'Higher Ed' } })}
                    className="text-blue-600 text-xs font-bold flex items-center gap-1"
                >
                    View All <ArrowRight className="w-3 h-3" />
                </button>
            </div>
            
            <div className="grid gap-4">
                {higherEdCourses.map(course => (
                    <div 
                        key={course.id}
                        onClick={() => navigate(`/course/${course.id}`)} 
                        className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:shadow-md transition"
                    >
                        <div className={`w-16 h-16 rounded-xl ${course.imageColor} shrink-0 flex items-center justify-center text-white`}>
                            <BookOpen className="w-8 h-8 opacity-80" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 truncate">{course.title}</h3>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {course.lessonsCount} Lessons</span>
                                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-current" /> 4.8</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Industry Ready Skills */}
        <div>
             <h2 className="text-xl font-bold text-slate-800 mb-4">Industry Ready Skills</h2>
             <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {skillCourses.map(course => (
                    <div 
                        key={course.id}
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="min-w-[240px] bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden cursor-pointer"
                    >
                         <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                         <div className="relative z-10">
                            <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3`}>
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg leading-tight mb-1">{course.title}</h3>
                            <p className="text-slate-400 text-xs">{course.duration} • Certification</p>
                         </div>
                    </div>
                ))}
             </div>
        </div>

        {/* Internship Spotlight */}
        <div>
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-slate-800">Launch Your Career</h2>
                <button 
                    onClick={() => navigate('/internships')}
                    className="text-blue-600 text-xs font-bold flex items-center gap-1"
                >
                    All Jobs <ArrowRight className="w-3 h-3" />
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
                {availableInternships.map(internship => (
                    <div key={internship.id} className="p-4 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-slate-800">{internship.title}</h4>
                            <p className="text-xs text-slate-500">{internship.company} • {internship.totalWeeks} Weeks</p>
                        </div>
                        <button 
                            onClick={() => handleApply(internship.linkedinUrl, internship.title)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100"
                        >
                            Apply
                        </button>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};