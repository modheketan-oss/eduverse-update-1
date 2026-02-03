import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, PlayCircle, Trophy, Target, Atom, Calculator, Microscope, ArrowRight, Brain, Zap, CheckCircle, Lock } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { useUser } from '../context/UserContext';

export const SchoolLanding: React.FC = () => {
  const navigate = useNavigate();
  const { courses } = useCourse();
  const { user } = useUser();
  
  // Challenge Configuration
  const totalChallenge = 5;

  // Filter for Academic (K-12) content
  const academicCourses = courses.filter(c => c.category === 'Academic');
  
  // Highlight courses by subject keywords for quick access
  const mathCourse = academicCourses.find(c => c.title.includes('Mathematics'));
  const physicsCourse = academicCourses.find(c => c.title.includes('Physics'));
  const bioCourse = academicCourses.find(c => c.title.includes('Biology'));

  // Logic for Weekly Challenge (Linked to Physics)
  const challengeCourse = physicsCourse;
  const completedChallengeLessons = challengeCourse?.lessons?.filter(l => l.isCompleted).length || 0;
  const challengeProgress = Math.min(completedChallengeLessons, totalChallenge);

  // Logic for Continue Learning Block
  const inProgressCourses = academicCourses.filter(c => c.progress > 0).sort((a, b) => b.progress - a.progress);
  const hasActiveLearning = inProgressCourses.length > 0;
  const coursesToDisplay = hasActiveLearning ? inProgressCourses : academicCourses.slice(0, 3);
  const learningTitle = hasActiveLearning ? "Continue Watching" : "Start Learning";

  const handlePlayLesson = (courseId: string | undefined, lessonIndex: number) => {
    if (!courseId) return;
    
    // Find the course to get the specific lesson ID
    const course = courses.find(c => c.id === courseId);
    const lessonId = course?.lessons?.[lessonIndex]?.id;

    if (lessonId) {
        navigate(`/course/${courseId}`, { state: { lessonId: lessonId } });
    } else {
        // Fallback to course overview if specific lesson not found
        navigate(`/course/${courseId}`);
    }
  };

  const handleContinueChallenge = () => {
      if (!challengeCourse) return;
      // Find the first uncompleted lesson
      const nextUnfinishedLessonIndex = challengeCourse.lessons?.findIndex(l => !l.isCompleted);
      const targetIndex = (nextUnfinishedLessonIndex !== -1 && nextUnfinishedLessonIndex !== undefined) 
        ? nextUnfinishedLessonIndex 
        : 0; // If all done, maybe go to start or stay on last
      
      handlePlayLesson(challengeCourse.id, targetIndex);
  };

  return (
    <div className="pb-8 bg-sky-50 min-h-full">
      {/* Hero Section for Kids */}
      <div className="bg-gradient-to-b from-sky-400 to-blue-500 text-white rounded-b-[2.5rem] p-8 pt-12 shadow-xl relative overflow-hidden">
        {/* Fun Background Patterns */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute -bottom-8 right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-300" />
                    Class 10
                </span>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                    CBSE Board
                </span>
            </div>
            
            <h1 className="text-3xl font-extrabold leading-tight mb-2">Hello, {user?.name || 'Superstar'}! 🚀</h1>
            <p className="text-blue-50 font-medium text-sm mb-6 max-w-xs">
                Ready to ace your exams? Let's learn something new today!
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                     <Target className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <p className="text-xs text-blue-100 font-bold uppercase">Daily Goal</p>
                    <p className="font-bold text-lg">Complete 2 Lessons</p>
                </div>
            </div>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-8">
        
        {/* Weekly Challenge Section */}
        <div>
           <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500 fill-current" />
                    Weekly Challenge
                </h2>
                <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">Ends in 2 days</span>
            </div>

            <div className="bg-white rounded-3xl p-1 shadow-lg border border-indigo-50/50">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[1.3rem] p-5 text-white relative overflow-hidden">
                     {/* Confetti/Star decoration */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                     <Star className="absolute top-4 right-4 w-6 h-6 text-yellow-300 fill-current opacity-50 animate-pulse" />
                     
                     <div className="relative z-10">
                        <div className="flex items-start gap-4 mb-6">
                             <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                                <Trophy className="w-7 h-7 text-yellow-300 drop-shadow-sm" />
                             </div>
                             <div>
                                <h3 className="font-bold text-lg leading-tight mb-1">Science Whiz</h3>
                                <p className="text-indigo-100 text-xs leading-relaxed opacity-90">Complete 5 Physics lessons this week to unlock the Einstein Badge!</p>
                             </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-2">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-indigo-200">Your Progress</span>
                                <span className="text-white">{challengeProgress}/{totalChallenge} Lessons</span>
                            </div>
                            <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                                <div 
                                    className="h-full bg-gradient-to-r from-yellow-300 to-amber-500 rounded-full shadow-[0_0_10px_rgba(252,211,77,0.5)] transition-all duration-1000" 
                                    style={{ width: `${(challengeProgress / totalChallenge) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                     </div>
                </div>

                {/* Challenge Tasks */}
                <div className="p-4 bg-white rounded-b-[1.3rem]">
                    <div className="space-y-3 mb-4">
                        {Array.from({ length: totalChallenge }, (_, i) => i + 1).map((step) => {
                            const isCompleted = step <= challengeProgress;
                            const isCurrent = step === challengeProgress + 1;
                            const lessonTitle = challengeCourse?.lessons?.[step-1]?.title || `Lesson ${step}`;

                            return (
                                <div 
                                    key={step} 
                                    onClick={() => handlePlayLesson(challengeCourse?.id, step - 1)}
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer group ${
                                        isCompleted ? 'hover:bg-green-50' : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                                        isCompleted 
                                            ? 'bg-green-100 text-green-600 border-green-200' 
                                            : isCurrent 
                                                ? 'bg-amber-100 text-amber-600 border-amber-200'
                                                : 'bg-slate-100 text-slate-400 border-slate-200'
                                    }`}>
                                        {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : step}
                                    </div>
                                    <div className="flex-1 flex justify-between items-center overflow-hidden">
                                        <div className="flex flex-col min-w-0">
                                            <span className={`text-sm truncate pr-2 ${isCompleted ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700 font-medium'}`}>
                                                {lessonTitle}
                                            </span>
                                            {isCurrent && <span className="text-[10px] text-amber-500 font-bold">Up Next</span>}
                                        </div>
                                        {(!isCompleted) && (
                                            <PlayCircle className={`w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity ${isCurrent ? 'opacity-100' : ''}`} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button 
                        onClick={handleContinueChallenge}
                        className="w-full py-3 bg-slate-50 text-slate-900 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center gap-2 group"
                    >
                        <PlayCircle className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                        {challengeProgress === totalChallenge ? "Review Challenge" : "Continue Challenge"}
                    </button>
                </div>
            </div>
        </div>
        
        {/* My Subjects Grid */}
        <div>
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    My Subjects
                </h2>
                <button 
                    onClick={() => navigate('/courses', { state: { category: 'Academic' } })}
                    className="text-blue-600 text-xs font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm"
                >
                    View All <ArrowRight className="w-3 h-3" />
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {/* Subject Cards */}
                <SubjectCard 
                    title="Maths" 
                    icon={<Calculator className="w-6 h-6 text-white" />} 
                    color="bg-blue-500"
                    onClick={() => mathCourse && navigate(`/course/${mathCourse.id}`)}
                />
                <SubjectCard 
                    title="Physics" 
                    icon={<Atom className="w-6 h-6 text-white" />} 
                    color="bg-cyan-500"
                    onClick={() => physicsCourse && navigate(`/course/${physicsCourse.id}`)}
                />
                <SubjectCard 
                    title="Biology" 
                    icon={<Microscope className="w-6 h-6 text-white" />} 
                    color="bg-emerald-500"
                    onClick={() => bioCourse && navigate(`/course/${bioCourse.id}`)}
                />
                 <SubjectCard 
                    title="Quiz Zone" 
                    icon={<Brain className="w-6 h-6 text-white" />} 
                    color="bg-fuchsia-500"
                    onClick={() => navigate('/quiz-zone')}
                />
            </div>
        </div>

        {/* Real Continue Learning Block */}
        <div>
             <h2 className="text-xl font-bold text-slate-800 mb-4">{learningTitle}</h2>
             <div className="flex flex-col gap-3">
                {coursesToDisplay.map(course => (
                    <div 
                        key={course.id}
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:shadow-md transition group"
                    >
                         <div className={`w-14 h-14 rounded-xl ${course.imageColor} shrink-0 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                            <PlayCircle className="w-7 h-7 opacity-90" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h3 className="font-bold text-slate-900 truncate mb-1">{course.title}</h3>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className={`h-full ${course.imageColor}`} style={{ width: `${course.progress > 0 ? course.progress : 0}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center mt-1.5">
                                <p className="text-xs text-slate-400 font-medium">{course.lessonsCount} Lessons • {course.duration}</p>
                                {course.progress > 0 && (
                                    <span className="text-[10px] font-bold text-slate-500">{course.progress}%</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>

      </div>
    </div>
  );
};

const SubjectCard = ({ title, icon, color, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`${color} p-4 rounded-2xl shadow-lg shadow-slate-200/50 flex flex-col items-center justify-center gap-3 h-32 hover:scale-[1.02] transition-transform active:scale-95`}
    >
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            {icon}
        </div>
        <span className="font-bold text-white tracking-wide">{title}</span>
    </button>
);