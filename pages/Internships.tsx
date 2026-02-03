import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, MapPin, Banknote, Linkedin } from 'lucide-react';
import { MOCK_INTERNSHIPS } from '../constants';

export const Internships: React.FC = () => {
  const navigate = useNavigate();

  const availableInternships = MOCK_INTERNSHIPS.filter(i => i.status === 'Available');

  const handleApply = (url?: string, title?: string) => {
    if (url) {
        window.open(url, '_blank');
    } else {
        const query = encodeURIComponent(title || 'Internships');
        window.open(`https://www.linkedin.com/jobs/search/?keywords=${query}`, '_blank');
    }
  };

  return (
    <div className="bg-gray-50 min-h-full pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 pt-8 pb-8 rounded-b-[2rem] shadow-lg text-white">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/90 mb-6 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Internship Desk</span>
        </button>
        <h1 className="text-2xl font-bold mb-1">Gain real-world experience</h1>
        <p className="opacity-90 text-sm">Mentored projects & certifications</p>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Available Internships */}
        <div>
          <h3 className="font-bold text-slate-800 text-lg mb-4">Available Internships</h3>
          <div className="space-y-4">
            {availableInternships.map((internship) => (
              <div key={internship.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
                <div>
                  <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900 text-lg leading-tight">{internship.title}</h4>
                      {internship.type && (
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border ${
                             internship.type === 'Remote' 
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                                : 'bg-slate-50 text-slate-700 border-slate-100'
                         }`}>
                             {internship.type}
                         </span>
                      )}
                  </div>
                  <p className="text-slate-500 text-sm font-medium mb-2">{internship.company}</p>
                  
                  {internship.description && (
                      <p className="text-slate-600 text-xs leading-relaxed mb-3 line-clamp-2">{internship.description}</p>
                  )}
                  
                  {/* Tags */}
                  {internship.tags && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                          {internship.tags.map(tag => (
                              <span key={tag} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md font-medium border border-slate-100">
                                  {tag}
                              </span>
                          ))}
                      </div>
                  )}

                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{internship.totalWeeks} Weeks</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{internship.spotsLeft} Spots Left</span>
                      </div>
                       {internship.stipend && (
                          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                            <Banknote className="w-3.5 h-3.5" />
                            <span className="font-bold">{internship.stipend}</span>
                          </div>
                      )}
                      {internship.location && (
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{internship.location}</span>
                          </div>
                      )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleApply(internship.linkedinUrl, internship.title)}
                  className="w-full py-3 border-2 border-blue-600 text-blue-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
                >
                  <Linkedin className="w-4 h-4 group-hover:text-white transition-colors" />
                  Apply on LinkedIn
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};