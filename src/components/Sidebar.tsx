import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Sigma, 
  BookOpen, 
  FlaskConical, 
  Landmark, 
  Palette, 
  Languages, 
  Puzzle, 
  FileText,
  Globe,
  Edit2,
  Check,
  X,
  School,
  ChevronDown
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  studentCount: number;
  teacherName: string;
  onUpdateTeacherName: (newName: string) => void;
  activeClass: string;
  classList: string[];
  onSelectClass: (clsName: string) => void;
  onOpenClassModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  studentCount,
  teacherName,
  onUpdateTeacherName,
  activeClass,
  classList,
  onSelectClass,
  onOpenClassModal,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [inputTeacherName, setInputTeacherName] = useState(teacherName);

  const menuItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students' as AppView, label: 'Data Siswa', icon: Users, badge: studentCount },
    { id: 'mathematics' as AppView, label: 'Matematika', icon: Sigma },
    { id: 'indonesian' as AppView, label: 'Bahasa Indonesia', icon: BookOpen },
    { id: 'english' as AppView, label: 'Bahasa Inggris', icon: Globe },
    { id: 'science' as AppView, label: 'IPAS (Sains)', icon: FlaskConical },
    { id: 'pancasila' as AppView, label: 'Pendidikan Pancasila', icon: Landmark },
    { id: 'arts' as AppView, label: 'Seni Budaya', icon: Palette },
    { id: 'sundanese' as AppView, label: 'Bahasa Sunda', icon: Languages },
    { id: 'cocurricular' as AppView, label: 'Kokurikuler', icon: Puzzle },
    { id: 'notes' as AppView, label: 'Catatan Guru', icon: FileText },
  ];

  const handleSaveTeacher = () => {
    if (inputTeacherName.trim()) {
      onUpdateTeacherName(inputTeacherName.trim());
    }
    setIsEditingTeacher(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'GR';
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed md:static top-0 bottom-0 left-0 z-50 md:z-auto
        w-64 bg-[#4B497B] text-slate-100 flex flex-col justify-between shrink-0 select-none border-r border-[#3E3C67]
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Brand Logo Header */}
          <div className="p-5 flex items-center justify-between border-b border-indigo-300/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md font-extrabold text-lg tracking-wider">
                <span className="text-xl">❖</span>
              </div>
              <div>
                <h1 className="font-bold text-white text-base tracking-tight leading-snug">DAFTAR NILAI V3</h1>
                <p className="text-[11px] text-indigo-200/80 font-medium tracking-wide uppercase">Manajemen Akademik</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-indigo-200 hover:text-white rounded-lg hover:bg-white/10"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Active Class Switcher Widget */}
        <div className="px-3 pt-3 pb-2">
          <div className="bg-[#413F6B] rounded-xl p-2.5 border border-indigo-300/20 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-200">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <School className="w-3.5 h-3.5 text-indigo-300" />
                <span>Kelas Aktif</span>
              </span>
              <button
                onClick={onOpenClassModal}
                className="text-[10px] text-indigo-300 hover:text-white underline font-semibold cursor-pointer"
              >
                Kelola
              </button>
            </div>

            <div className="relative">
              <select
                value={activeClass}
                onChange={(e) => {
                  if (e.target.value === '__MANAGE__') {
                    onOpenClassModal();
                  } else {
                    onSelectClass(e.target.value);
                  }
                }}
                className="w-full text-xs font-bold text-white bg-[#535085] hover:bg-[#5B5894] border border-indigo-300/30 rounded-lg py-1.5 pl-2.5 pr-7 focus:outline-hidden cursor-pointer appearance-none transition-colors"
              >
                {classList.map((cls) => (
                  <option key={cls} value={cls} className="bg-[#4B497B] text-white">
                    {cls}
                  </option>
                ))}
                <option value="__MANAGE__" className="bg-[#3E3C67] text-amber-300 font-bold">
                  + Ubah / Kelola Kelas...
                </option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-200 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#5B598E] text-white shadow-xs'
                    : 'text-indigo-100/80 hover:bg-[#535183] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-200/80'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-bold bg-indigo-900/40 text-indigo-200 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>


      {/* User Profile Footer */}
      <div className="p-4 border-t border-indigo-300/15 bg-[#444272] flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-amber-200 text-amber-900 overflow-hidden border border-white/20 shrink-0 flex items-center justify-center font-bold text-xs">
            {getInitials(teacherName)}
          </div>
          
          {isEditingTeacher ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={inputTeacherName}
                onChange={(e) => setInputTeacherName(e.target.value)}
                className="w-28 text-xs p-1 bg-white text-slate-900 font-semibold rounded border border-indigo-300 focus:outline-hidden"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTeacher()}
              />
              <button onClick={handleSaveTeacher} className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
                <Check className="w-3 h-3" />
              </button>
              <button onClick={() => setIsEditingTeacher(false)} className="p-1 bg-slate-600 hover:bg-slate-700 text-white rounded">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate" title={teacherName}>{teacherName}</p>
              <p className="text-[10px] text-indigo-200 font-medium tracking-wider">GURU KELAS</p>
            </div>
          )}
        </div>

        {!isEditingTeacher && (
          <button 
            onClick={() => {
              setInputTeacherName(teacherName);
              setIsEditingTeacher(true);
            }} 
            className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
            title="Ubah Nama Guru"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
    </>
  );
};
