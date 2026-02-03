import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Lock, CheckCircle, Info, Unlock, Upload, FileVideo, Brain, XCircle, RefreshCw, Award, ShieldAlert, Star, TrendingUp, Crown, Zap } from 'lucide-react';
import { Lesson } from '../types';
import { useCourse } from '../context/CourseContext';
import { useUser } from '../context/UserContext';
import { Button } from '../components/Button';

export const CoursePlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCourse, uploadLessonVideo, markLessonComplete, toggleLessonLock, toggleCourseLock } = useCourse();
  const { user } = useUser();
  const isPremium = user?.isPremium;
  
  const course = courseId ? getCourse(courseId) : undefined;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'lessons' | 'quiz'>('lessons');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showCompletionToast, setShowCompletionToast] = useState(false);
  const [showPremiumUnlockToast, setShowPremiumUnlockToast] = useState(false);

  useEffect(() => {
    // If we have a course and an active lesson hasn't been set yet
    if (course && course.lessons && course.lessons.length > 0) {
      
      const requestedLessonId = location.state?.lessonId;
      const requestedLesson = requestedLessonId ? course.lessons.find(l => l.id === requestedLessonId) : null;
      
      if (!activeLesson) {
        setActiveLesson(requestedLesson || course.lessons[0]);
      } else {
        // Find the currently active lesson in the updated course object to get the new URL
        const updatedLesson = course.lessons.find(l => l.id === activeLesson.id);
        if (updatedLesson) {
          setActiveLesson(updatedLesson);
        }
      }
      
      // Auto-switch to quiz tab for quiz courses
      if (course.category === 'Quiz') {
          setActiveTab('quiz');
      }
    }
  }, [course, activeLesson?.id, location.state]); 

  // Handle "Just Purchased" effect
  useEffect(() => {
      if (location.state?.justPurchased) {
          setShowPremiumUnlockToast(true);
          // Clear state so it doesn't show on refresh
          window.history.replaceState({}, document.title);
          setTimeout(() => setShowPremiumUnlockToast(false), 5000);
      }
  }, [location.state]);

  // Reset quiz state when lesson changes
  useEffect(() => {
    setQuizAnswers({});
    setIsQuizSubmitted(false);
    setQuizScore(0);
    // For normal courses reset to lessons, but for quiz courses stay on quiz
    if (course?.category !== 'Quiz') {
        setActiveTab('lessons');
    }
  }, [activeLesson?.id]);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <Info className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Course Not Found</h2>
        <button 
          onClick={() => navigate('/courses')}
          className="text-purple-600 font-semibold"
        >
          Return to Library
        </button>
      </div>
    );
  }

  // Locking Logic
  const isGlobalCourseLocked = course.isLocked; // Manual Instructor Lock
  
  // A lesson is locked if: 
  // 1. The Course is manually locked (Admin override)
  // 2. The lesson is specifically marked 'isLocked' AND user is NOT premium
  // We removed the blanket isAdvancedCourse check to allow for free teaser lessons in Premium courses
  const isLessonLocked = isGlobalCourseLocked || (!isPremium && activeLesson?.isLocked);
  
  const isCustomVideo = activeLesson?.videoUrl.startsWith('blob:');
  const isQuizCourse = course.category === 'Quiz';

  const handleLessonChange = (lesson: Lesson) => {
    // Prevent changing lessons if the entire course is locked by an admin/instructor
    if (isGlobalCourseLocked) return;
    setActiveLesson(lesson);
  };

  const triggerCompletionFeedback = () => {
    setShowCompletionToast(true);
    // Increased duration to allow user to click the stats button
    setTimeout(() => setShowCompletionToast(false), 5000);
  };

  const handleVideoEnded = () => {
    if (courseId && activeLesson && !isLessonLocked) {
      markLessonComplete(courseId, activeLesson.id);
      triggerCompletionFeedback();
    }
  };

  const handleMarkComplete = () => {
    if (courseId && activeLesson && !isLessonLocked) {
      markLessonComplete(courseId, activeLesson.id);
      triggerCompletionFeedback();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeLesson && courseId) {
      if (!file.type.startsWith('video/')) {
        alert('Please upload a valid video file.');
        return;
      }
      uploadLessonVideo(courseId, activeLesson.id, file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubscribeClick = () => {
      navigate('/premium', { 
          state: { 
              from: location.pathname, 
              lessonId: activeLesson?.id 
          } 
      });
  };

  // Quiz Handlers
  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    if (isQuizSubmitted) return;
    setQuizAnswers(prev => ({...prev, [questionId]: optionIndex}));
  };

  const submitQuiz = () => {
    if (!activeLesson?.quiz) return;
    
    let score = 0;
    activeLesson.quiz.forEach(q => {
        if (quizAnswers[q.id] === q.correctAnswer) {
            score++;
        }
    });
    setQuizScore(score);
    setIsQuizSubmitted(true);
    
    // Auto-complete lesson if perfect score or pass logic (for now just submit = complete for quiz courses)
    if (isQuizCourse) {
        handleMarkComplete();
    }
  };

  const retryQuiz = () => {
    setQuizAnswers({});
    setIsQuizSubmitted(false);
    setQuizScore(0);
    // Scroll to top of quiz area
    const quizArea = document.getElementById('quiz-area');
    if (quizArea) quizArea.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Video Player Area - Sticky on Mobile */}
      {/* If it's a quiz course, we hide the video player and show a header instead */}
      {!isQuizCourse ? (
        <div className="sticky top-0 z-30 bg-black w-full aspect-video shadow-lg group relative">
            <div className="relative w-full h-full">
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute top-4 left-4 z-50 p-2 bg-black/40 text-white rounded-full backdrop-blur-sm hover:bg-black/60 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                {activeLesson || isGlobalCourseLocked ? (
                    isLessonLocked ? (
                    /* Locked Overlay */
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-center p-6 text-white animate-in fade-in relative z-30">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                            {isGlobalCourseLocked ? (
                                <ShieldAlert className="w-8 h-8 text-red-400" />
                            ) : (
                                <Lock className="w-8 h-8 text-white/70" />
                            )}
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            {isGlobalCourseLocked 
                                ? 'Course Temporarily Locked' 
                                : 'Premium Content'}
                        </h3>
                        <p className="text-white/60 mb-6 max-w-sm text-sm">
                            {isGlobalCourseLocked
                                ? "The instructor has locked this course for updates. Please check back later."
                                : "Subscribe to EduVerse Premium to unlock this video and other advanced content."
                            }
                        </p>
                        {!isGlobalCourseLocked && (
                            <Button variant="gradient" onClick={handleSubscribeClick}>
                                <Crown className="w-4 h-4 mr-2" />
                                Subscribe to Unlock
                            </Button>
                        )}
                    </div>
                    ) : (
                    /* Video Player */
                    <div className="relative w-full h-full z-10">
                        <video 
                            key={activeLesson?.videoUrl} // Key forces reload when url changes
                            className="w-full h-full object-cover" 
                            controls 
                            autoPlay
                            poster="https://via.placeholder.com/640x360/1e293b/ffffff?text=EduVerse+Player"
                            onEnded={handleVideoEnded}
                        >
                            <source src={activeLesson?.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        {isCustomVideo && (
                        <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-lg border border-white/10 animate-in fade-in">
                            <FileVideo className="w-3 h-3 text-purple-400" />
                            Instructor Upload
                        </div>
                        )}
                    </div>
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                        <p>Select a lesson to start</p>
                    </div>
                )}
            </div>
        </div>
      ) : (
        // Quiz Header Mode
         <div className={`sticky top-0 z-30 w-full ${course.imageColor} text-white shadow-lg p-6 pt-8 pb-12 rounded-b-[2rem]`}>
            <div className="relative z-10">
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute top-0 left-0 p-2 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition -mt-2 -ml-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center text-center mt-2">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                        <Brain className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold mb-1">{course.title}</h1>
                    <p className="text-white/80 text-sm max-w-xs">{activeLesson?.title}</p>
                </div>
            </div>
             {/* Background decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>
         </div>
      )}

      {/* Tabs - Only show for normal courses. Quiz courses just show the quiz. */}
      {!isQuizCourse && (
        <div className="flex border-b border-slate-100 bg-white sticky top-[aspect-video] z-20">
            <button 
                onClick={() => setActiveTab('lessons')}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'lessons' 
                        ? 'border-purple-600 text-purple-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                Overview & Lessons
            </button>
            <button 
                onClick={() => setActiveTab('quiz')}
                disabled={isGlobalCourseLocked}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'quiz' 
                        ? 'border-purple-600 text-purple-600' 
                        : (isGlobalCourseLocked) ? 'text-slate-300' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Brain className="w-4 h-4" />
                Practice Quiz
                {activeLesson?.quiz && (
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{activeLesson.quiz.length}</span>
                )}
            </button>
        </div>
      )}

      {/* Content Area */}
      <div className="p-6">
        {activeTab === 'lessons' && !isQuizCourse ? (
            // Overview & Lesson List
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-1 bg-purple-50 text-purple-600 rounded-md uppercase tracking-wider">
                                {course.category}
                            </span>
                            {isGlobalCourseLocked && (
                                <span className="text-[10px] font-bold px-2 py-1 bg-red-500 text-white rounded-md uppercase tracking-wider flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3" /> Admin Locked
                                </span>
                            )}
                        </div>
                        
                        {/* Instructor Controls */}
                        <div className="flex gap-2">
                             {/* Toggle Course Lock Button */}
                             <button
                                onClick={() => toggleCourseLock(course.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    isGlobalCourseLocked 
                                        ? 'bg-red-100 text-red-700 border border-red-200' 
                                        : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                }`}
                                title={isGlobalCourseLocked ? "Unlock Course" : "Lock Course"}
                            >
                                {isGlobalCourseLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                <span>{isGlobalCourseLocked ? "Unlock Course" : "Lock Course"}</span>
                            </button>

                            {/* Only show lesson controls if course is active */}
                            {!isGlobalCourseLocked && activeLesson && (
                                <>
                                    {/* Active Lesson Lock Button */}
                                    <button
                                        onClick={() => toggleLessonLock(course.id, activeLesson.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                            activeLesson.isLocked
                                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                        title={activeLesson.isLocked ? "Unlock Lesson" : "Lock Lesson"}
                                    >
                                        {activeLesson.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                        <span>{activeLesson.isLocked ? "Locked" : "Unlocked"}</span>
                                    </button>

                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="video/*" 
                                        onChange={handleFileUpload} 
                                    />
                                    <button 
                                        onClick={triggerFileUpload}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                                    >
                                        <Upload className="w-3 h-3" />
                                        <span>Upload</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <h1 className="text-xl font-bold text-slate-900 leading-tight mb-2">{course.title}</h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        {course.description || "Master this subject with our comprehensive video curriculum designed by industry experts."}
                    </p>
                    
                    {/* Manual Complete Button */}
                    {activeLesson && !activeLesson.isCompleted && (!activeLesson.quiz || activeLesson.quiz.length === 0) && !isLessonLocked && (
                         <button
                            onClick={handleMarkComplete}
                            className="mt-4 w-full py-3 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200 hover:bg-green-100 transition flex items-center justify-center gap-2 text-sm"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Mark Lesson Complete
                        </button>
                    )}
                </div>

                <div>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        Course Content 
                        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{course.lessons?.length || 0} Lessons</span>
                    </h3>
                    
                    <div className="space-y-3">
                        {course.lessons && course.lessons.length > 0 ? (
                            course.lessons.map((lesson, index) => {
                                // Calculate individual lesson lock state based on premium status
                                const isItemLocked = isGlobalCourseLocked || (!isPremium && lesson.isLocked);
                                const isActive = activeLesson?.id === lesson.id;
                                const isCompleted = lesson.isCompleted;
                                
                                return (
                                <div
                                    key={lesson.id}
                                    className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left relative group ${
                                        isActive 
                                            ? 'bg-purple-50 border-purple-200' 
                                            : 'bg-white border-slate-100 hover:bg-slate-50'
                                    } ${(isGlobalCourseLocked) ? 'opacity-70' : ''}`}
                                >
                                    <div 
                                        className={`absolute inset-0 z-0 ${(isGlobalCourseLocked) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        onClick={() => !((isGlobalCourseLocked)) && handleLessonChange(lesson)}
                                    ></div>

                                    <div className="relative shrink-0 z-10 pointer-events-none">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            isActive 
                                                ? 'bg-purple-600 text-white' 
                                                : isItemLocked
                                                    ? 'bg-slate-100 text-slate-400'
                                                    : isCompleted
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-purple-100 text-purple-600'
                                        }`}>
                                            {isItemLocked ? (
                                                <Lock className="w-4 h-4" />
                                            ) : isActive ? (
                                                <PlayCircle className="w-5 h-5" />
                                            ) : isCompleted ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <span className="text-sm font-bold">{index + 1}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 z-10 pointer-events-none">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-sm font-semibold ${
                                                isActive ? 'text-purple-900' : isCompleted ? 'text-slate-500' : 'text-slate-700'
                                            }`}>
                                                {lesson.title}
                                            </h4>
                                        </div>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                        {lesson.duration} • 
                                        {lesson.videoUrl.startsWith('blob:') ? (
                                            <span className="text-purple-600 font-medium flex items-center gap-0.5"><FileVideo className="w-3 h-3"/> Custom</span>
                                        ) : 'Video'}
                                        </p>
                                    </div>

                                    {/* Instructor Lock Toggle (Visible on hover or if locked) */}
                                    {!isGlobalCourseLocked && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLessonLock(course.id, lesson.id);
                                            }}
                                            className={`relative z-20 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                                                lesson.isLocked 
                                                ? 'opacity-100 bg-red-50 text-red-500 hover:bg-red-100'
                                                : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                                            }`}
                                            title={lesson.isLocked ? "Unlock Lesson" : "Lock Lesson"}
                                        >
                                            {lesson.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                        </button>
                                    )}

                                    {isActive && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse z-10"></div>
                                    )}
                                </div>
                            )})
                        ) : (
                            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm">Course content is being uploaded.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            // Quiz Tab
            <div id="quiz-area" className="animate-in fade-in slide-in-from-right-2 duration-300">
                {/* For Quiz Courses, show a level selector if needed, or simple nav */}
                {isQuizCourse && course.lessons && course.lessons.length > 1 && (
                     <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                        {course.lessons.map((lesson, idx) => (
                            <button
                                key={lesson.id}
                                disabled={isGlobalCourseLocked || (!isPremium && lesson.isLocked)}
                                onClick={() => handleLessonChange(lesson)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                                    activeLesson?.id === lesson.id 
                                        ? 'bg-slate-900 text-white border-slate-900' 
                                        : (isGlobalCourseLocked || (!isPremium && lesson.isLocked)) 
                                            ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {lesson.isLocked && !isPremium && !isGlobalCourseLocked && <Lock className="w-3 h-3 inline mr-1" />}
                                {lesson.title}
                            </button>
                        ))}
                     </div>
                )}
                
                {(!activeLesson?.quiz || activeLesson.quiz.length === 0) ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Brain className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-1">No Quiz Available</h3>
                        <p className="text-slate-500 text-sm">There is no practice quiz for this lesson yet.</p>
                        {!isQuizCourse && (
                            <button 
                                onClick={() => setActiveTab('lessons')}
                                className="mt-4 text-purple-600 font-bold text-sm hover:underline"
                            >
                                Back to Lessons
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold text-slate-800">
                                {isQuizCourse ? 'Challenge Questions' : 'Lesson Quiz'}
                            </h2>
                            {isQuizCourse && (
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {activeLesson?.quiz?.length} Questions
                                </span>
                            )}
                        </div>

                        {/* Result Card */}
                        {isQuizSubmitted && (
                            <div className={`p-6 rounded-2xl text-center border-2 animate-in slide-in-from-top-4 ${
                                quizScore === activeLesson.quiz.length 
                                    ? 'bg-green-50 border-green-100' 
                                    : 'bg-white border-slate-100 shadow-sm'
                            }`}>
                                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                                    quizScore === activeLesson.quiz.length 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-purple-100 text-purple-600'
                                }`}>
                                    {quizScore === activeLesson.quiz.length ? <Star className="w-8 h-8 fill-current" /> : <Award className="w-8 h-8" />}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">
                                    {quizScore === activeLesson.quiz.length ? 'Perfect Score!' : 'Quiz Completed'}
                                </h3>
                                <p className="text-slate-600 mb-4">
                                    You scored <span className="font-bold text-slate-900 text-lg">{quizScore}/{activeLesson.quiz.length}</span> correct answers.
                                </p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {activeLesson.quiz.map((q, qIndex) => {
                                const isCorrect = quizAnswers[q.id] === q.correctAnswer;
                                const hasAnswered = quizAnswers[q.id] !== undefined;

                                return (
                                    <div key={q.id} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                        <h3 className="font-semibold text-slate-800 mb-4 flex gap-3">
                                            <span className="text-slate-400 font-bold">{qIndex + 1}.</span>
                                            {q.question}
                                        </h3>
                                        <div className="space-y-2.5">
                                            {q.options.map((option, oIndex) => {
                                                let buttonStyle = "bg-white border-slate-200 text-slate-600 hover:bg-slate-50";
                                                let icon = null;

                                                if (isQuizSubmitted) {
                                                    if (oIndex === q.correctAnswer) {
                                                        buttonStyle = "bg-green-100 border-green-300 text-green-800 font-medium";
                                                        icon = <CheckCircle className="w-4 h-4 text-green-600" />;
                                                    } else if (quizAnswers[q.id] === oIndex) {
                                                        buttonStyle = "bg-red-50 border-red-200 text-red-800";
                                                        icon = <XCircle className="w-4 h-4 text-red-500" />;
                                                    } else {
                                                        buttonStyle = "bg-white border-slate-100 text-slate-400 opacity-60";
                                                    }
                                                } else if (quizAnswers[q.id] === oIndex) {
                                                    buttonStyle = "bg-purple-100 border-purple-300 text-purple-800 font-medium ring-1 ring-purple-300";
                                                }

                                                return (
                                                    <button
                                                        key={oIndex}
                                                        onClick={() => handleOptionSelect(q.id, oIndex)}
                                                        disabled={isQuizSubmitted}
                                                        className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center justify-between ${buttonStyle}`}
                                                    >
                                                        <span>{option}</span>
                                                        {icon}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-4 pb-8">
                            {!isQuizSubmitted ? (
                                <button
                                    onClick={submitQuiz}
                                    disabled={Object.keys(quizAnswers).length !== activeLesson.quiz.length}
                                    className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Submit Answers
                                </button>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={retryQuiz}
                                        className="w-full py-3.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Retry Quiz
                                    </button>
                                    
                                    {isQuizCourse && activeLesson.id !== course.lessons?.[course.lessons.length-1].id && (
                                        <button
                                            onClick={() => {
                                                // Find next lesson
                                                const currentIdx = course.lessons?.findIndex(l => l.id === activeLesson.id) || 0;
                                                const nextLesson = course.lessons?.[currentIdx + 1];
                                                if (nextLesson && (!nextLesson.isLocked || isPremium)) {
                                                    handleLessonChange(nextLesson);
                                                    retryQuiz();
                                                } else {
                                                    navigate('/premium');
                                                }
                                            }}
                                            className="w-full py-3.5 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            Next Level
                                            <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>

       {/* Completion Toast */}
       {showCompletionToast && (
         <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 w-full max-w-xs px-4">
            <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-slate-700/50 flex flex-col gap-3">
               <div className="flex items-center gap-3">
                    <div className="bg-green-500 rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-sm block">Lesson Completed</span>
                        <span className="text-xs text-slate-400">Progress saved successfully</span>
                    </div>
               </div>
               
               <button 
                onClick={() => navigate('/analytics')}
                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
               >
                   <TrendingUp className="w-3 h-3" />
                   View Updated Stats
               </button>
            </div>
         </div>
      )}
      
      {/* Premium Unlocked Toast */}
       {showPremiumUnlockToast && (
         <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-500 w-full max-w-xs px-4">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-4 rounded-2xl shadow-xl border border-white/20 flex flex-col gap-2 text-center">
               <div className="mx-auto bg-white/20 p-2 rounded-full mb-1">
                   <Unlock className="w-6 h-6 text-white" />
               </div>
               <div>
                   <span className="font-bold text-lg block">Content Unlocked!</span>
                   <span className="text-xs text-white/90">Welcome to Premium. Enjoy your lesson.</span>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};