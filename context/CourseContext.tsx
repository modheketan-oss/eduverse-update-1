import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, Lesson } from '../types';
import { MOCK_COURSES } from '../constants';
import { useUser } from './UserContext';

interface CourseContextType {
  courses: Course[];
  activityLog: Record<string, number>;
  getCourse: (id: string) => Course | undefined;
  uploadLessonVideo: (courseId: string, lessonId: string, file: File) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  toggleLessonLock: (courseId: string, lessonId: string) => void;
  toggleCourseLock: (courseId: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Helper to parse duration string to minutes
const parseLessonDuration = (duration: string): number => {
    if (!duration) return 0;
    if (duration.includes(':')) {
        const parts = duration.split(':').map(Number);
        if (parts.length === 2) return parts[0] + parts[1] / 60; // MM:SS
        if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60; // HH:MM:SS
        return 0;
    }
    // Fallback for '15m', '1h' etc
    const val = parseFloat(duration.replace(/[^\d.]/g, ''));
    if (duration.includes('h')) return val * 60;
    return val; // assume minutes
};

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [activityLog, setActivityLog] = useState<Record<string, number>>({});
  const [dataLoadedForEmail, setDataLoadedForEmail] = useState<string | null>(null);

  // Load courses and activity log based on current user
  useEffect(() => {
    const email = user?.email || 'guest';
    const courseKey = `eduverse_courses_v2_${email}`;
    const activityKey = `eduverse_activity_v2_${email}`;
    
    const savedCourses = localStorage.getItem(courseKey);
    const savedActivity = localStorage.getItem(activityKey);
    
    let initialCourses = MOCK_COURSES;
    
    if (savedCourses) {
       try {
         const parsed = JSON.parse(savedCourses);
         // Merge logic: Map over MOCK_COURSES and apply saved progress/locks
         initialCourses = MOCK_COURSES.map(mock => {
            const savedCourse = parsed.find((c: Course) => c.id === mock.id);
            if (savedCourse) {
                return {
                    ...mock,
                    progress: savedCourse.progress,
                    isLocked: savedCourse.isLocked,
                    // Merge lessons
                    lessons: mock.lessons?.map(l => {
                        const savedLesson = savedCourse.lessons?.find((sl: Lesson) => sl.id === l.id);
                        return savedLesson ? {
                            ...l,
                            isLocked: savedLesson.isLocked,
                            isCompleted: savedLesson.isCompleted,
                            // videoUrl: l.videoUrl // keep mock url, don't persist blob urls across sessions
                        } : l;
                    })
                };
            }
            return mock;
         });
       } catch(e) {
         console.error("Failed to parse course data", e);
       }
    }

    let initialActivity = {};
    if (savedActivity) {
        try {
            initialActivity = JSON.parse(savedActivity);
        } catch(e) {
            console.error("Failed to parse activity data", e);
        }
    }
    
    setCourses(initialCourses);
    setActivityLog(initialActivity);
    setDataLoadedForEmail(email);
  }, [user?.email]);

  // Persist courses whenever they change
  useEffect(() => {
    const email = user?.email || 'guest';
    if (dataLoadedForEmail === email) {
        const key = `eduverse_courses_v2_${email}`;
        localStorage.setItem(key, JSON.stringify(courses));
    }
  }, [courses, user?.email, dataLoadedForEmail]);

  // Persist activity log
  useEffect(() => {
    const email = user?.email || 'guest';
    if (dataLoadedForEmail === email) {
        const key = `eduverse_activity_v2_${email}`;
        localStorage.setItem(key, JSON.stringify(activityLog));
    }
  }, [activityLog, user?.email, dataLoadedForEmail]);

  const getCourse = (id: string) => {
    return courses.find(c => c.id === id);
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, progress } : c));
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setCourses(prevCourses => {
      // Find course and lesson to calculate duration first
      const courseIndex = prevCourses.findIndex(c => c.id === courseId);
      if (courseIndex === -1) return prevCourses;

      const course = prevCourses[courseIndex];
      const lesson = course.lessons?.find(l => l.id === lessonId);

      // Only log activity if it wasn't already completed
      if (lesson && !lesson.isCompleted) {
          const duration = parseLessonDuration(lesson.duration);
          const today = new Date().toISOString().split('T')[0];
          
          setActivityLog(prevLog => ({
              ...prevLog,
              [today]: (prevLog[today] || 0) + duration
          }));
      }

      const updatedCourses = [...prevCourses];
      const updatedCourse = { ...course };
      
      const updatedLessons = updatedCourse.lessons?.map(l => {
        if (l.id !== lessonId) return l;
        return { ...l, isCompleted: true };
      }) || [];

      // Calculate new progress
      const totalLessons = updatedLessons.length;
      const completedCount = updatedLessons.filter(l => l.isCompleted).length;
      const newProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      updatedCourse.lessons = updatedLessons;
      updatedCourse.progress = newProgress;
      updatedCourses[courseIndex] = updatedCourse;

      return updatedCourses;
    });
  };

  const uploadLessonVideo = (courseId: string, lessonId: string, file: File) => {
    const videoUrl = URL.createObjectURL(file);

    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== courseId) return course;

      // Update the specific lesson in the course
      const updatedLessons = course.lessons?.map(lesson => {
        if (lesson.id !== lessonId) return lesson;
        return { ...lesson, videoUrl: videoUrl };
      });

      return { ...course, lessons: updatedLessons };
    }));
  };

  const toggleLessonLock = (courseId: string, lessonId: string) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== courseId) return course;

      const updatedLessons = course.lessons?.map(lesson => {
        if (lesson.id !== lessonId) return lesson;
        return { ...lesson, isLocked: !lesson.isLocked };
      });

      return { ...course, lessons: updatedLessons };
    }));
  };

  const toggleCourseLock = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, isLocked: !course.isLocked } : course
    ));
  };

  return (
    <CourseContext.Provider value={{ courses, activityLog, getCourse, uploadLessonVideo, updateCourseProgress, markLessonComplete, toggleLessonLock, toggleCourseLock }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};