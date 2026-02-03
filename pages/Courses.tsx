import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Clock, BookOpen, Bookmark, SlidersHorizontal, X, Check, RotateCcw } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { useUser } from '../context/UserContext';
import { UserRole } from '../types';

// Helper to parse duration string (e.g., "32h") to number
const parseDuration = (duration: string): number => {
  const num = parseInt(duration.replace(/\D/g, ''));
  return isNaN(num) ? 0 : num;
};

interface FilterState {
  categories: string[];
  duration: 'all' | 'short' | 'medium' | 'long';
}

export const Courses: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courses } = useCourse();
  const { user } = useUser();
  
  const isStudent = user?.role === UserRole.Student;
  const isProfessional = user?.role === UserRole.Professional;

  // Initial Setup Logic
  const initialCategory = location.state?.category;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Complex Filter State
  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategory ? [initialCategory] : [],
    duration: 'all'
  });

  // Effect to set defaults based on Role if no state was passed
  useEffect(() => {
    if (!initialCategory && filters.categories.length === 0) {
      if (isStudent) setFilters(prev => ({ ...prev, categories: ['Academic'] }));
      else if (isProfessional) setFilters(prev => ({ ...prev, categories: ['Skills', 'Business'] }));
    }
  }, [isStudent, isProfessional, initialCategory]);

  const allCategories = ['Academic', 'Higher Ed', 'Skills', 'Business', 'Advanced'];

  // Handle Quick Tab Click
  const handleTabClick = (cat: string) => {
    if (cat === 'All') {
      setFilters(prev => ({ ...prev, categories: [] }));
    } else {
      setFilters(prev => ({ ...prev, categories: [cat] }));
    }
  };

  // Toggle Category in Filter Modal
  const toggleCategoryFilter = (cat: string) => {
    setFilters(prev => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        return { ...prev, categories: prev.categories.filter(c => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      duration: 'all'
    });
    setSearchQuery('');
    setShowFilters(false);
  };

  // --- Filtering Logic ---
  const filteredCourses = courses.filter(course => {
    // 1. Search Query
    const query = searchQuery.toLowerCase();
    const matchesSearch = course.title.toLowerCase().includes(query) || 
                          course.description?.toLowerCase().includes(query) ||
                          course.category.toLowerCase().includes(query);

    // 2. Categories (Empty array means 'All')
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(course.category);

    // 3. Duration
    const hours = parseDuration(course.duration);
    let matchesDuration = true;
    if (filters.duration === 'short') matchesDuration = hours < 10;
    else if (filters.duration === 'medium') matchesDuration = hours >= 10 && hours <= 40;
    else if (filters.duration === 'long') matchesDuration = hours > 40;

    return matchesSearch && matchesCategory && matchesDuration;
  });

  const activeFiltersCount = 
    (filters.categories.length > 0 ? 1 : 0) + 
    (filters.duration !== 'all' ? 1 : 0);

  // Helper to determine active state of tabs for visual consistency
  const isTabActive = (tabName: string) => {
    if (tabName === 'All' && filters.categories.length === 0) return true;
    return filters.categories.length === 1 && filters.categories[0] === tabName;
  };

  return (
    <div className="p-6 pt-8 pb-20 relative">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Explore Library</h1>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, skills..." 
            className="w-full bg-slate-100 py-3 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          {searchQuery && (
             <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
             </button>
          )}
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border transition-all flex items-center justify-center relative ${
            showFilters || activeFiltersCount > 0
              ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {activeFiltersCount > 0 && !showFilters && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 mb-6 animate-in slide-in-from-top-2 duration-200">
           <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
             <h3 className="font-bold text-slate-800">Filters</h3>
             <button onClick={resetFilters} className="text-xs font-medium text-slate-500 hover:text-red-500 flex items-center gap-1">
               <RotateCcw className="w-3 h-3" /> Reset
             </button>
           </div>
           
           <div className="space-y-5">
              {/* Category Filter */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
                        filters.categories.includes(cat)
                          ? 'bg-purple-100 border-purple-200 text-purple-700'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {filters.categories.includes(cat) && <Check className="w-3 h-3" />}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Duration</label>
                <div className="bg-slate-50 p-1 rounded-lg flex">
                   {(['all', 'short', 'medium', 'long'] as const).map((d) => (
                     <button
                        key={d}
                        onClick={() => setFilters(prev => ({...prev, duration: d}))}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                          filters.duration === d 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                     >
                        {d === 'all' ? 'Any' : d === 'short' ? '< 10h' : d === 'medium' ? '10-40h' : '40h+'}
                     </button>
                   ))}
                </div>
              </div>
           </div>
           
           <div className="mt-6 pt-4 border-t border-slate-50">
             <button 
                onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition"
             >
               Show {filteredCourses.length} Courses
             </button>
           </div>
        </div>
      )}

      {/* Quick Category Tabs (Visible if filter panel closed) */}
      {!showFilters && (
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {['All', ...allCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => handleTabClick(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                isTabActive(cat)
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Course List */}
      <div className="space-y-6">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No courses found</h3>
            <p className="text-slate-500 text-sm max-w-[200px]">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={resetFilters}
              className="mt-4 text-purple-600 font-bold text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-3xl p-5 shadow-lg border border-slate-50 shadow-slate-200/50 transition-all hover:shadow-xl relative overflow-hidden">

              <div className={`h-32 rounded-2xl ${course.imageColor} mb-4 flex items-center justify-center relative overflow-hidden`}>
                {/* Abstract decorative circles */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -mr-8 -mt-8 blur-lg"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/5 rounded-full -ml-8 -mb-8"></div>
                
                <Bookmark className="w-12 h-12 text-white opacity-90" />
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-800 leading-tight flex-1 mr-2">{course.title}</h3>
                <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md uppercase tracking-wider">
                  {course.category}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessonsCount} Lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {course.progress > 0 && (
                <div className="mb-4">
                   <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${course.imageColor} opacity-80`} style={{ width: `${course.progress}%` }}></div>
                   </div>
                </div>
              )}

              <button 
                onClick={() => navigate(`/course/${course.id}`)}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition shadow-lg bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20"
              >
                {course.progress > 0 ? 'Continue Learning' : 'Start Learning'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};