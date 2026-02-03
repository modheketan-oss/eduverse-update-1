import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Zap, Globe, Trophy, PlayCircle } from 'lucide-react';
import { useCourse } from '../context/CourseContext';

export const QuizZone: React.FC = () => {
  const navigate = useNavigate();
  const { courses } = useCourse();
  
  // Filter for Quiz category
  const quizCourses = courses.filter(c => c.category === 'Quiz');

  const getIcon = (id: string) => {
    if (id === 'quiz_1') return <Globe className="w-8 h-8 text-indigo-100" />;
    if (id === 'quiz_2') return <Brain className="w-8 h-8 text-emerald-100" />;
    return <Zap className="w-8 h-8 text-white" />;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-b-[2.5rem] p-8 pt-10 shadow-xl relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/30 rounded-full -ml-10 -mb-10 blur-2xl"></div>

         <div className="relative z-10">
            <button 
                onClick={() => navigate('/school')} 
                className="mb-6 p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition inline-flex items-center"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-400 rounded-lg text-indigo-900 shadow-lg">
                    <Brain className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quiz Zone</h1>
            </div>
            <p className="text-indigo-100 text-sm max-w-xs leading-relaxed">
                Challenge yourself with our curated quizzes. Level up your knowledge and earn badges!
            </p>
         </div>
      </div>

      <div className="px-6 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Featured Challenges
        </h2>
        
        <div className="space-y-4">
            {quizCourses.map(quiz => (
                <div 
                    key={quiz.id}
                    onClick={() => navigate(`/course/${quiz.id}`)}
                    className="group bg-white rounded-3xl p-1 shadow-md hover:shadow-xl transition-all cursor-pointer border border-slate-100"
                >
                    <div className={`rounded-[1.3rem] p-6 ${quiz.imageColor} text-white relative overflow-hidden`}>
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                {getIcon(quiz.id)}
                            </div>
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                                {quiz.lessons?.length} Levels
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-1 relative z-10">{quiz.title}</h3>
                        <p className="text-white/80 text-sm mb-4 relative z-10">{quiz.description}</p>
                        
                        <div className="flex items-center gap-2 text-xs font-bold bg-white/20 backdrop-blur-md w-fit px-3 py-1.5 rounded-lg border border-white/10 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                            <PlayCircle className="w-4 h-4" />
                            Start Quiz
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-8 p-6 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 text-center opacity-70">
            <p className="font-bold text-slate-500 mb-1">More Quizzes Coming Soon!</p>
            <p className="text-xs text-slate-400">Math Olympiad • Space Trivia • Coding Basics</p>
        </div>
      </div>
    </div>
  );
};