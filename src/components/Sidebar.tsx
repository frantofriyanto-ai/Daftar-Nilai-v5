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
  ChevronDown,
  ShieldCheck,
  LogOut,
  UserCheck,
  LogIn,
  Settings
} from 'lucide-react';
import { AppView, UserAccount } from '../types';

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
  currentUser: UserAccount | null;
  onOpenLoginModal: () => void;
  onOpenUserManagementModal: () => void;
  onLogout: () => void;
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
  onCloseMobile,
  currentUser,
  onOpenLoginModal,
  onOpenUserManagementModal,
  onLogout
}) => {
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [inputTeacherName, setInputTeacherName] = useState(teacherName);

  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';

  const teacherAssigned = currentUser?.assignedClasses || [];
  const availableClasses = (isTeacher && teacherAssigned.length > 0)
    ? classList.filter(c => teacherAssigned.includes(c))
    : classList;

  const finalClassList = availableClasses.length > 0 
    ? availableClasses 
    : (teacherAssigned.length > 0 ? teacherAssigned : classList);

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
        <div className="flex-1 overflow-y-auto min-h-0">
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
              {isAdmin && (
                <button
                  onClick={onOpenClassModal}
                  className="text-[10px] text-indigo-300 hover:text-white underline font-semibold cursor-pointer"
                >
                  Kelola
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={activeClass}
                onChange={(e) => {
                  if (e.target.value === '__MANAGE__') {
                    if (!isAdmin) {
                      alert('Akses Terbatas: Hanya Administrator Kurikulum yang dapat menambah/mengubah kelas.');
                      return;
                    }
                    onOpenClassModal();
                  } else {
                    onSelectClass(e.target.value);
                  }
                }}
                className="w-full text-xs font-bold text-white bg-[#535085] hover:bg-[#5B5894] border border-indigo-300/30 rounded-lg py-1.5 pl-2.5 pr-7 focus:outline-hidden cursor-pointer appearance-none transition-colors"
              >
                {finalClassList.map((cls) => (
                  <option key={cls} value={cls} className="bg-[#4B497B] text-white">
                    {cls} {isTeacher ? '(Kelas Pengampu)' : ''}
                  </option>
                ))}
                {isAdmin && (
                  <option value="__MANAGE__" className="bg-[#3E3C67] text-amber-300 font-bold">
                    + Ubah / Kelola Kelas...
                  </option>
                )}
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
      <div className="p-3.5 border-t border-indigo-300/15 bg-[#444272] flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className={`w-9 h-9 rounded-full overflow-hidden border border-white/20 shrink-0 flex items-center justify-center font-bold text-xs ${
              isAdmin ? 'bg-purple-200 text-purple-900' : 'bg-amber-200 text-amber-900'
            }`}>
              {currentUser ? currentUser.avatarInitials : getInitials(teacherName)}
            </div>
            
            {isEditingTeacher ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={inputTeacherName}
                  onChange={(e) => setInputTeacherName(e.target.value)}
                  className="w-24 text-xs p-1 bg-white text-slate-900 font-semibold rounded border border-indigo-300 focus:outline-hidden"
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
                <p className="text-xs font-bold text-white truncate" title={currentUser ? currentUser.name : teacherName}>
                  {currentUser ? currentUser.name : teacherName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                    isAdmin ? 'bg-purple-900/80 text-purple-200' : 'bg-teal-900/80 text-teal-200'
                  }`}>
                    {isAdmin ? <ShieldCheck className="w-2.5 h-2.5 text-purple-300" /> : <School className="w-2.5 h-2.5 text-teal-300" />}
                    {isAdmin ? 'ADMINISTRATOR' : 'GURU KELAS'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {!isEditingTeacher && (
              <button 
                onClick={() => {
                  setInputTeacherName(currentUser ? currentUser.name : teacherName);
                  setIsEditingTeacher(true);
                }} 
                className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                title="Ubah Nama Tampilan"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Login Role Action Buttons */}
        <div className="pt-2 border-t border-indigo-300/10 flex items-center justify-between gap-1.5 text-[11px]">
          <button
            onClick={onOpenLoginModal}
            className="flex-1 py-1 px-2 bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-100 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer text-[10px]"
            title="Ganti Peran / Login Akun Guru & Admin"
          >
            <LogIn className="w-3 h-3 text-amber-300" />
            <span>Ganti Akun</span>
          </button>

          {isAdmin && (
            <button
              onClick={onOpenUserManagementModal}
              className="py-1 px-2 bg-purple-500/40 hover:bg-purple-500/60 text-purple-100 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer text-[10px]"
              title="Kelola Pengguna Pengajar & Admin"
            >
              <Settings className="w-3 h-3 text-purple-200" />
              <span>Kelola User</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="p-1 text-indigo-200 hover:text-rose-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Keluar (Logout)"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};
