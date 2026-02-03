import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, TrendingUp, AlertCircle, Award, Calendar, PlayCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  PieChart, Pie, Cell 
} from 'recharts';
import { useCourse } from '../context/CourseContext';

export const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { courses, activityLog } = useCourse();

  // --- Real-time Data Calculation ---
  const stats = useMemo(() => {
      let totalMinutes = 0;
      let totalProgressSum = 0;
      let startedCoursesCount = 0;
      
      const categoryData: Record<string, { scoreSum: number, count: number }> = {
          'Academic': { scoreSum: 0, count: 0 },
          'Higher Ed': { scoreSum: 0, count: 0 },
          'Skills': { scoreSum: 0, count: 0 },
          'Business': { scoreSum: 0, count: 0 },
      };

      const focusList: { id: string, title: string, category: string, progress: number, imageColor: string }[] = [];

      courses.forEach(course => {
          // Progress & Avg Score Logic
          if (course.progress > 0) {
              totalProgressSum += course.progress;
              startedCoursesCount++;

              // Identify Focus Areas (Started but less than 100% complete)
              if (course.progress < 100) {
                  focusList.push({
                      id: course.id,
                      title: course.title,
                      category: course.category,
                      progress: course.progress,
                      imageColor: course.imageColor
                  });
              }
          }

          // Category Logic
          if (categoryData[course.category]) {
              categoryData[course.category].scoreSum += course.progress;
              categoryData[course.category].count += 1;
          }

          // Total Time Logic (Based on completions)
          if (course.lessons && course.lessons.length > 0) {
              course.lessons.forEach(l => {
                  if (l.isCompleted) {
                      // Parse duration logic duplicated here for Total Time summary
                      // Ideally we'd just sum the activityLog but that's daily-based and might expire or be different context. 
                      // Keeping this for "All Time" total based on course state.
                      const parts = l.duration.split(':').map(Number);
                      let durationInMinutes = 0;
                      if (parts.length === 2) {
                          durationInMinutes = parts[0] + parts[1] / 60;
                      } else if (parts.length === 3) {
                          durationInMinutes = parts[0] * 60 + parts[1] + parts[2] / 60;
                      } else {
                          durationInMinutes = parseFloat(l.duration) || 0;
                      }
                      totalMinutes += durationInMinutes;
                  }
              });
          } else if (course.progress > 0) {
              const estHours = parseInt(course.duration.replace(/\D/g, '')) || 0;
              totalMinutes += (estHours * 60) * (course.progress / 100);
          }
      });

      const avgScore = startedCoursesCount > 0 ? Math.round(totalProgressSum / startedCoursesCount) : 0;
      const totalHours = (totalMinutes / 60).toFixed(1);

      // Radar Data
      const radarData = Object.keys(categoryData).map(cat => ({
          subject: cat,
          score: categoryData[cat].count > 0 ? Math.round(categoryData[cat].scoreSum / categoryData[cat].count) : 0,
          fullMark: 100
      }));

      return { totalHours, avgScore, radarData, focusList };
  }, [courses]);

  // Generate Weekly Activity Data (Last 7 Days) from activityLog
  const weeklyActivityData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    // Loop for the last 7 days including today
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Fetch minutes from log, default to 0
        const minutes = activityLog[dateStr] || 0;
        const hours = parseFloat((minutes / 60).toFixed(1));
        
        data.push({
            day: dayLabel,
            hours: hours
        });
    }
    return data;
  }, [activityLog]);

  const timeDistributionData = [
    { name: 'Video Lectures', value: 60, color: '#8b5cf6' }, // Violet
    { name: 'Practice Quiz', value: 25, color: '#06b6d4' },  // Cyan
    { name: 'Projects', value: 15, color: '#f43f5e' },      // Rose
  ];

  return (
    <div className="bg-gray-50 min-h-full pb-8">
      {/* Header */}
      <div className="p-6 pt-8 bg-white shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Analytics Overview</h1>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-violet-50 p-3 rounded-xl border border-violet-100">
            <div className="flex items-center gap-1.5 mb-1 text-violet-600">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold">Total Time</span>
            </div>
            <p className="text-lg font-bold text-slate-800">{stats.totalHours}h</p>
            <p className="text-[10px] text-slate-500">All Time</p>
          </div>
          <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-100">
             <div className="flex items-center gap-1.5 mb-1 text-cyan-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold">Avg Prog.</span>
            </div>
            <p className="text-lg font-bold text-slate-800">{stats.avgScore}%</p>
            <p className="text-[10px] text-slate-500">Across Courses</p>
          </div>
           <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
             <div className="flex items-center gap-1.5 mb-1 text-orange-600">
              <Award className="w-4 h-4" />
              <span className="text-xs font-semibold">Active</span>
            </div>
            <p className="text-lg font-bold text-slate-800">{stats.focusList.length}</p>
            <p className="text-[10px] text-slate-500">Courses</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        
        {/* Weekly Activity Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Weekly Activity</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>Last 7 Days</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}}
                />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -5px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`${value} hrs`, 'Time Spent']}
                />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 4, 4]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strength Radar Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-2">Category Performance</h3>
          <p className="text-xs text-slate-500 mb-4">Your progress by category</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={stats.radarData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 11, fill: '#64748b', fontWeight: 500}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -5px rgb(0 0 0 / 0.1)'}}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Distribution Pie Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-2">Learning Style</h3>
          <p className="text-xs text-slate-500 mb-4">How you spend your time</p>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={4}
                >
                  {timeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -5px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{color: '#1e293b', fontWeight: 600, fontSize: '12px'}}
                  formatter={(value: number) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-2xl font-bold text-slate-800">100%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Effort</span>
            </div>
            
            {/* Custom Legend */}
            <div className="flex justify-center gap-4 flex-wrap mt-[-20px]">
              {timeDistributionData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-xs font-medium text-slate-600">{entry.name}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* Focus Areas (In Progress) - Redesigned to be proper */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Focus Areas (In Progress)</h3>
          <div className="space-y-3">
            {stats.focusList.length > 0 ? (
                stats.focusList.slice(0, 3).map((area) => (
                  <div key={area.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className={`w-12 h-12 rounded-lg ${area.imageColor} flex items-center justify-center text-white shrink-0`}>
                       <PlayCircle className="w-6 h-6 opacity-90" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-800 truncate">{area.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${area.imageColor}`} style={{ width: `${area.progress}%` }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">{area.progress}%</span>
                      </div>
                    </div>
                    <button 
                        onClick={() => navigate(`/course/${area.id}`)}
                        className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Resume
                    </button>
                  </div>
                ))
            ) : (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                        <Award className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No active courses.</p>
                    <button onClick={() => navigate('/courses')} className="text-xs text-purple-600 font-bold mt-1">Start Learning</button>
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};