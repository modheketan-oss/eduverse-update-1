import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Settings, LogOut, 
  ChevronRight, Bell, Moon, HelpCircle, ShieldCheck, CreditCard, Edit2, X, Camera
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Button } from '../components/Button';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
        setFormData({
            name: user.name,
            email: user.email
        });
        setAvatarPreview(user.avatar || null);
    }
  }, [user, showEditModal]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
        ...formData,
        avatar: avatarPreview || undefined
    });
    setShowEditModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
      return name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
  };

  return (
    <div className="bg-gray-50 min-h-full pb-8">
      {/* Header */}
      <div className="bg-white p-6 pt-8 pb-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
        </div>
      </div>

      <div className="px-6 space-y-6 mt-2">
        {/* User Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
           {/* Background Decoration */}
           <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10"></div>
           
           <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-1 mb-3 relative z-10">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-2xl">
                        {user?.name ? getInitials(user.name) : <User className="w-10 h-10" />}
                    </div>
                )}
              </div>
           </div>

           <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Learner'}</h2>
           
           <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
             <Mail className="w-3 h-3" /> {user?.email || 'student@eduverse.com'}
           </p>

           <div className="flex gap-2 w-full">
             <button 
                onClick={() => setShowEditModal(true)}
                className="flex-1 py-2 px-4 rounded-xl bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center gap-1"
             >
               <Edit2 className="w-3 h-3" />
               Edit Profile
             </button>
             <button className="flex-1 py-2 px-4 rounded-xl bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 hover:bg-slate-100 transition">
               Share Profile
             </button>
           </div>
        </div>

        {/* Settings Menu */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 ml-1">App Settings</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <MenuItem icon={<Bell className="w-5 h-5" />} label="Notifications" />
            <MenuItem icon={<Moon className="w-5 h-5" />} label="Dark Mode" value="Off" />
            <MenuItem icon={<ShieldCheck className="w-5 h-5" />} label="Security & Privacy" />
            <MenuItem icon={<CreditCard className="w-5 h-5" />} label="Payment Methods" />
          </div>

          <h3 className="font-bold text-slate-800 ml-1">Support</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <MenuItem icon={<HelpCircle className="w-5 h-5" />} label="Help Center" />
            <MenuItem icon={<Settings className="w-5 h-5" />} label="Preferences" />
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-4 text-red-500 font-bold text-sm bg-red-50 rounded-2xl hover:bg-red-100 transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
        
        <p className="text-center text-xs text-slate-400 pb-4">Version 1.0.0 • EduVerse Inc.</p>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in">
           <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Edit Profile</h3>
                  <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                      <X className="w-5 h-5 text-slate-400" />
                  </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                  <div className="flex justify-center mb-6">
                      <div className="relative">
                          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 overflow-hidden">
                              {avatarPreview ? (
                                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-2xl">
                                      {formData.name ? getInitials(formData.name) : <User className="w-12 h-12" />}
                                  </div>
                              )}
                          </div>
                          <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleFileChange}
                          />
                          <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-colors"
                          >
                              <Camera className="w-4 h-4" />
                          </button>
                      </div>
                  </div>

                  <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 ml-1">Full Name</label>
                      <input 
                          type="text" 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                  </div>

                  <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 ml-1">Email Address</label>
                      <input 
                          type="email" 
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                  </div>

                  <div className="pt-2 flex gap-3">
                      <Button type="button" variant="ghost" fullWidth onClick={() => setShowEditModal(false)}>
                          Cancel
                      </Button>
                      <Button type="submit" variant="gradient" fullWidth>
                          Save Changes
                      </Button>
                  </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, label, value, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition border-b border-slate-50 last:border-none group"
  >
    <div className="flex items-center gap-3">
      <div className="text-slate-400 group-hover:text-purple-600 transition-colors">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-xs text-slate-400 font-medium">{value}</span>}
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </div>
  </button>
);