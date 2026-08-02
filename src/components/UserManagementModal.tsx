import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockUsers';
import { ShieldCheck, School, Plus, Trash2, Edit2, X, Check, Users, Key, AlertCircle } from 'lucide-react';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  webAppUrl?: string;
  onSyncData?: (mode?: 'pull' | 'push' | 'both') => Promise<void>;
  isSyncing?: boolean;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  webAppUrl = '',
  onSyncData,
  isSyncing = false
}) => {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('antigravity_users_list');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNip, setNewNip] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('teacher');
  const [newTitle, setNewTitle] = useState('Guru Pengajar');

  if (!isOpen) return null;

  const saveUsersToStorage = (updated: UserAccount[]) => {
    setUsers(updated);
    localStorage.setItem('antigravity_users_list', JSON.stringify(updated));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newNip.trim()) return;

    const isAdm = newRole === 'admin';
    const initials = newName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || (isAdm ? 'AD' : 'GR');

    const newUser: UserAccount = {
      id: `user_${Date.now()}`,
      name: newName.trim(),
      nip: newNip.trim(),
      email: newEmail.trim() || `${newNip.trim().replace(/\s+/g, '')}@sekolah.sch.id`,
      role: newRole,
      avatarInitials: initials,
      title: newTitle.trim() || (isAdm ? 'Admin Kurikulum' : 'Guru Pengajar'),
      assignedClasses: isAdm ? [] : ['Kelas 12-A']
    };

    saveUsersToStorage([newUser, ...users]);
    setIsAdding(false);
    setNewName('');
    setNewNip('');
    setNewEmail('');
  };

  const handleDeleteUser = (userId: string) => {
    if (users.length <= 1) {
      alert('Tidak dapat menghapus pengguna terakhir.');
      return;
    }
    const updated = users.filter((u) => u.id !== userId);
    saveUsersToStorage(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 text-white p-4 sm:p-5 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-purple-200 shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-lg text-white leading-tight">Kelola Pengguna & Peran Akses</h3>
              <p className="text-[11px] sm:text-xs text-purple-200 mt-0.5 leading-tight">Manajemen Akun Guru & Administrator Sekolah</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 min-h-0">
          {/* Google Sheets User Accounts Sync Card */}
          {webAppUrl && (
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-3.5 px-4 rounded-xl shadow-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white leading-tight">Terintegrasi Sheet 'Akun Guru' Spreadsheet</p>
                  <p className="text-[11px] text-indigo-200">User login & NIP tersinkronisasi otomatis dengan Google Sheets.</p>
                </div>
              </div>

              {onSyncData && (
                <button
                  type="button"
                  onClick={() => onSyncData('both')}
                  disabled={isSyncing}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isSyncing ? 'Menyinkronkan...' : '🔄 Sync User Spreadsheet'}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Daftar Pengguna Terdaftar ({users.length})</h4>
              <p className="text-xs text-slate-500">Administrator memiliki akses penuh, sedangkan Guru mengakses kelas yang ditugaskan.</p>
            </div>

            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengguna</span>
              </button>
            )}
          </div>

          {/* Add User Form */}
          {isAdding && (
            <form onSubmit={handleAddUser} className="bg-purple-50/60 border border-purple-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-purple-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-purple-700" />
                  Form Tambah Guru / Admin Baru
                </h5>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Rina Wijaya, S.Pd"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    required
                    value={newNip}
                    onChange={(e) => setNewNip(e.target.value)}
                    placeholder="Contoh: 19920310 201801 2 005"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Peran Akses (Role)</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                  >
                    <option value="teacher">Guru Pengajar / Wali Kelas</option>
                    <option value="admin">Administrator / Kurikulum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan / Catatan</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Wali Kelas 10-A"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg cursor-pointer shadow-xs"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          )}

          {/* User List Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Pengguna</th>
                  <th className="p-3">NIP / Email</th>
                  <th className="p-3">Peran (Role)</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const isCurrent = currentUser?.id === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {u.avatarInitials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{u.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                                  ANDA
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block">{u.title}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-mono text-[11px] text-slate-600">
                        <div>{u.nip}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{u.email}</div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isAdmin ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-teal-100 text-teal-800 border border-teal-200'
                          }`}
                        >
                          {isAdmin ? <ShieldCheck className="w-3 h-3 text-purple-600" /> : <School className="w-3 h-3 text-teal-600" />}
                          {isAdmin ? 'ADMIN' : 'GURU'}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={isCurrent}
                          title={isCurrent ? 'Tidak bisa menghapus akun yang sedang dipakai' : 'Hapus Pengguna'}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between text-xs text-slate-500">
          <span>Hanya Administrator yang memiliki akses mengubah hak sistem ini.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg cursor-pointer transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
