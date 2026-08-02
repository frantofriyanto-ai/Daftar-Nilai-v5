import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Plus, FileSpreadsheet, RefreshCw, Menu, UserCheck, ShieldCheck, LogOut, ChevronDown, User, Settings } from 'lucide-react';
import { UserAccount } from '../types';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenQuickAdd: () => void;
  onOpenAppsScriptModal: () => void;
  isSyncing?: boolean;
  webAppUrl?: string;
  lastSyncTime?: string;
  onOpenMobileSidebar?: () => void;
  currentUser: UserAccount | null;
  onOpenLoginModal: () => void;
  onOpenUserManagementModal: () => void;
  onLogout: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenQuickAdd,
  onOpenAppsScriptModal,
  isSyncing,
  webAppUrl = '',
  lastSyncTime = '',
  onOpenMobileSidebar,
  currentUser,
  onOpenLoginModal,
  onOpenUserManagementModal,
  onLogout
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-10 shrink-0">
      {/* Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-2 flex-1 sm:flex-initial">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full sm:w-64 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari siswa atau mata pelajaran..."
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Center Title / Role Badge */}
      <div className="hidden lg:flex items-center gap-3 shrink-0">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Daftar Nilai</h2>
        {currentUser && (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-2xs ${
            isAdmin ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-teal-100 text-teal-900 border border-teal-200'
          }`}>
            {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-purple-700" /> : <UserCheck className="w-3.5 h-3.5 text-teal-700" />}
            <span>{isAdmin ? 'ADMINISTRATOR KURIKULUM' : 'GURU PENGAKSI'}</span>
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Apps Script & Google Sheets Button */}
        <button
          onClick={onOpenAppsScriptModal}
          title={webAppUrl ? `Spreadsheet Real-time Terhubung ${lastSyncTime ? `(${lastSyncTime})` : ''}` : 'Hubungkan Google Sheets & Apps Script'}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
            webAppUrl
              ? 'text-emerald-800 bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
              : 'text-[#0F766E] bg-teal-50 border-teal-200 hover:bg-teal-100'
          }`}
        >
          <FileSpreadsheet className={`w-3.5 h-3.5 shrink-0 ${webAppUrl ? 'text-emerald-600' : 'text-teal-600'}`} />
          {webAppUrl ? (
            <>
              <span className="hidden xl:inline font-bold text-emerald-900">Sheets Real-time</span>
              <span className="xl:hidden text-[11px] font-bold text-emerald-900">Sheets</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
            </>
          ) : (
            <>
              <span className="hidden xl:inline">Google Sheets</span>
              <span className="xl:hidden text-[11px]">Sheets</span>
            </>
          )}
          {isSyncing && <RefreshCw className="w-3 h-3 text-teal-600 animate-spin ml-0.5" />}
        </button>

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white bg-[#0B63E5] rounded-lg hover:bg-blue-700 transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Tambah Cepat</span>
          <span className="sm:hidden text-[11px]">Tambah</span>
        </button>

        {/* User Account Login Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-xl border transition-all cursor-pointer ${
              isAdmin
                ? 'bg-purple-50/80 border-purple-200 hover:bg-purple-100/70 text-purple-950'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
              isAdmin ? 'bg-purple-700 text-white' : 'bg-teal-700 text-white'
            }`}>
              {currentUser ? currentUser.avatarInitials : 'U'}
            </div>
            
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold block truncate max-w-[120px] leading-tight">
                {currentUser ? currentUser.name : 'Belum Login'}
              </span>
              <span className={`text-[10px] font-extrabold tracking-wider block uppercase ${isAdmin ? 'text-purple-700' : 'text-teal-700'}`}>
                {isAdmin ? 'ADMIN' : 'GURU'}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              {/* Profile Card Header */}
              {currentUser && (
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white ${
                      isAdmin ? 'bg-purple-700' : 'bg-teal-700'
                    }`}>
                      {currentUser.avatarInitials}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-snug">{currentUser.name}</h4>
                      <p className="text-[11px] text-slate-500">{currentUser.title}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">NIP: {currentUser.nip}</p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">PERAN AKSES</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {isAdmin ? 'Administrator' : 'Guru Pengajar'}
                    </span>
                  </div>
                </div>
              )}

              {/* Menu Actions */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenLoginModal();
                  }}
                  className="w-full text-left px-4 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Ganti Akun / Log In Baru</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenUserManagementModal();
                    }}
                    className="w-full text-left px-4 py-2 text-purple-900 hover:bg-purple-50 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-purple-600" />
                    <span>Kelola Pengguna & Hak Akses</span>
                  </button>
                )}
              </div>

              {/* Logout Button */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

