import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockUsers';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Key, 
  School, 
  CheckCircle2, 
  X, 
  LogIn, 
  User, 
  Building2,
  AlertCircle,
  Users
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  currentUser: UserAccount | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'form'>('accounts');
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [usersList] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('antigravity_users_list');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  if (!isOpen) return null;

  const handleSelectAccount = (user: UserAccount) => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(user);
      setIsLoading(false);
      onClose();
    }, 300);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanInput = identifier.trim().toLowerCase();
      const matched = usersList.find((u) => {
        if (selectedRole !== u.role) return false;
        return (
          u.nip.toLowerCase().includes(cleanInput) ||
          u.email.toLowerCase() === cleanInput ||
          u.name.toLowerCase().includes(cleanInput)
        );
      });

      if (matched) {
        onLoginSuccess(matched);
        setIsLoading(false);
        onClose();
      } else {
        // If user typed custom NIP/Name
        if (identifier.trim().length > 3) {
          const isAdm = selectedRole === 'admin';
          const dynamicUser: UserAccount = {
            id: `user_${Date.now()}`,
            name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
            email: identifier.includes('@') ? identifier : `${identifier.replace(/\s+/g, '')}@sekolah.sch.id`,
            nip: identifier.includes('@') ? '19880000 201500 1 001' : identifier,
            role: selectedRole,
            avatarInitials: isAdm ? 'AD' : 'GR',
            title: isAdm ? 'Administrator Kurikulum' : 'Guru Pengajar',
            assignedClasses: isAdm ? [] : ['Kelas 12-A']
          };
          onLoginSuccess(dynamicUser);
          setIsLoading(false);
          onClose();
        } else {
          setErrorMessage('NIP atau email tidak ditemukan. Masukkan NIP atau nama yang valid.');
          setIsLoading(false);
        }
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#4C4B7C] via-[#5B598E] to-[#4C4B7C] text-white p-4 sm:p-5 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-amber-300 shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-lg text-white leading-tight">Masuk Sistem Informasi Akademik</h3>
              <p className="text-[11px] sm:text-xs text-indigo-200 mt-0.5 leading-tight">Otentikasi Akun Guru Pengajar & Administrator Kurikulum</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currently Logged In Banner */}
        {currentUser && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-2.5 sm:p-3 px-4 sm:px-6 flex items-center justify-between text-xs text-emerald-900 shrink-0">
            <div className="flex items-center gap-2 truncate pr-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">
                Aktif: <strong className="font-bold">{currentUser.name}</strong> ({currentUser.role === 'admin' ? 'Admin' : 'Guru'})
              </span>
            </div>
            <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase shrink-0">
              {currentUser.role}
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-3 gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin shrink-0">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'accounts'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pilih Akun Pengguna</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'form'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-slate-600" />
            <span>Login NIP & Password</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'accounts' ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 bg-slate-100/80 border border-slate-200 p-3 rounded-xl leading-relaxed">
                <p className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  Daftar Akun Pengguna Terdaftar
                </p>
                Pilih profil pengguna di bawah untuk masuk ke sistem. Akun guru otomatis disesuaikan dengan data kelas yang menjadi wewenangnya.
              </div>

              {/* Account Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {usersList.map((user) => {
                  const isAdmin = user.role === 'admin';
                  const isSelected = currentUser?.id === user.id;

                  return (
                    <button
                      key={user.id}
                      onClick={() => handleSelectAccount(user)}
                      disabled={isLoading}
                      className={`p-4 rounded-xl border text-left transition-all hover:shadow-md cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                          : isAdmin
                          ? 'border-purple-200 bg-purple-50/30 hover:bg-purple-50/70'
                          : 'border-teal-200 bg-teal-50/30 hover:bg-teal-50/70'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              isAdmin
                                ? 'bg-purple-700 text-white'
                                : 'bg-teal-700 text-white'
                            }`}
                          >
                            {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <School className="w-3 h-3" />}
                            {isAdmin ? 'ADMINISTRATOR' : 'GURU PENGAJAR'}
                          </span>

                          {isSelected && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              AKTIF
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm leading-snug">{user.name}</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{user.title}</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">NIP: {user.nip}</p>

                        {!isAdmin && user.assignedClasses && user.assignedClasses.length > 0 && (
                          <div className="mt-2 text-[10px] font-bold text-teal-800 bg-teal-100/80 px-2 py-1 rounded-md inline-block">
                            🏫 Hak Akses Kelas: {user.assignedClasses.join(', ')}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          {isAdmin ? 'Akses: Seluruh Kelas & Sistem' : `Khusus: Data Siswa ${user.assignedClasses?.join(', ')}`}
                        </span>
                        <span className={`font-bold ${isAdmin ? 'text-purple-700' : 'text-teal-700'}`}>
                          Masuk &rarr;
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 max-w-md mx-auto">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Peran Pengguna
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('teacher');
                      setIdentifier('');
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedRole === 'teacher'
                        ? 'border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <School className="w-4 h-4 text-teal-600" />
                    <span>Guru Pengajar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('admin');
                      setIdentifier('');
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedRole === 'admin'
                        ? 'border-purple-500 bg-purple-50 text-purple-800 ring-2 ring-purple-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Administrator</span>
                  </button>
                </div>
              </div>

              {/* NIP / Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {selectedRole === 'teacher' ? 'NIP Guru atau Email Resmi' : 'Email Administrator / NIP'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={selectedRole === 'teacher' ? 'Masukkan NIP (Contoh: 19850315...)' : 'admin@sekolah.sch.id'}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-purple-700 hover:bg-purple-800'
                    : 'bg-teal-700 hover:bg-teal-800'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Memproses Otentikasi...' : `Masuk Sebagai ${selectedRole === 'admin' ? 'Administrator' : 'Guru Pengajar'}`}</span>
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            Sistem Informasi Manajemen Nilai Akademik
          </span>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
