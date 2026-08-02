import React, { useState } from 'react';
import { School, Check, Plus, Edit2, Trash2, X, Calendar, Download, Upload, Database, FileJson, CheckCircle2 } from 'lucide-react';
import { Student } from '../types';
import { getInitialStudentsForClass } from '../data/mockData';

interface ClassManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeClass: string;
  classList: string[];
  academicPeriod: string;
  kkm?: number;
  students: Student[];
  onSelectClass: (className: string) => void;
  onAddClass: (className: string) => void;
  onRenameClass: (oldName: string, newName: string) => void;
  onDeleteClass: (className: string) => void;
  onUpdateAcademicPeriod: (period: string) => void;
  onUpdateKKM?: (kkm: number) => void;
  onRestoreData: (backupPayload: any) => void;
}

export const ClassManagerModal: React.FC<ClassManagerModalProps> = ({
  isOpen,
  onClose,
  activeClass,
  classList,
  academicPeriod,
  kkm = 75,
  students,
  onSelectClass,
  onAddClass,
  onRenameClass,
  onDeleteClass,
  onUpdateAcademicPeriod,
  onUpdateKKM,
  onRestoreData,
}) => {
  const [newClassName, setNewClassName] = useState('');
  const [editingClassName, setEditingClassName] = useState<string | null>(null);
  const [editInputValue, setEditInputValue] = useState('');
  const [editingPeriod, setEditingPeriod] = useState(false);
  const [inputPeriodValue, setInputPeriodValue] = useState(academicPeriod);
  const [inputKkmValue, setInputKkmValue] = useState(kkm);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim()) {
      onAddClass(newClassName.trim());
      setNewClassName('');
    }
  };

  const handleStartRename = (clsName: string) => {
    setEditingClassName(clsName);
    setEditInputValue(clsName);
  };

  const handleSaveRename = (oldName: string) => {
    if (editInputValue.trim() && editInputValue.trim() !== oldName) {
      onRenameClass(oldName, editInputValue.trim());
    }
    setEditingClassName(null);
  };

  const handleSavePeriod = () => {
    if (inputPeriodValue.trim()) {
      onUpdateAcademicPeriod(inputPeriodValue.trim());
    }
    setEditingPeriod(false);
  };

  const handleExportBackup = () => {
    const studentsPerClass: Record<string, Student[]> = {};
    classList.forEach((cls) => {
      const raw = localStorage.getItem(`antigravity_students_${cls}`);
      if (raw) {
        try {
          studentsPerClass[cls] = JSON.parse(raw);
        } catch {
          studentsPerClass[cls] = [];
        }
      } else if (cls === activeClass) {
        studentsPerClass[cls] = students;
      } else {
        studentsPerClass[cls] = getInitialStudentsForClass(cls);
      }
    });

    const backupPayload = {
      appName: 'NilaiKarakterSD',
      version: '1.0',
      exportDate: new Date().toISOString(),
      teacherName: localStorage.getItem('antigravity_teacher_name') || 'Budi Santoso, M.Pd',
      academicPeriod,
      activeClass,
      classList,
      studentsPerClass,
      logs: JSON.parse(localStorage.getItem('antigravity_logs') || '[]'),
      logos: {
        dinas: localStorage.getItem('antigravity_logo_dinas') || null,
        sekolah: localStorage.getItem('antigravity_logo_sekolah') || null,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Backup_NilaiKarakterSD_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed || typeof parsed !== 'object') {
          alert('Format file JSON tidak valid!');
          return;
        }
        if (!parsed.classList || !parsed.studentsPerClass) {
          alert('File JSON tidak memiliki struktur data nilai yang sesuai.');
          return;
        }

        if (
          confirm(
            `Apakah Anda yakin ingin memulihkan (restore) data dari file "${file.name}"?\nSemua data kelas dan nilai saat ini akan diperbarui sesuai file cadangan.`
          )
        ) {
          onRestoreData(parsed);
          setRestoreMessage('Data berhasil dipulihkan dari file backup!');
          setTimeout(() => setRestoreMessage(null), 4000);
        }
      } catch (err) {
        alert('Gagal membaca file backup JSON: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#4B497B] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-white/10 rounded-xl shrink-0">
              <School className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Kelola & Ubah Kelas</h3>
              <p className="text-[11px] sm:text-xs text-indigo-200 mt-0.5">Pilih, tambah, atau perbarui daftar kelas akademik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
          {/* Active Class Highlight Card */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-indigo-700 uppercase">Kelas Aktif Saat Ini</span>
              <h4 className="text-lg font-extrabold text-indigo-950 mt-0.5">{activeClass}</h4>
              <p className="text-xs text-indigo-700 font-medium mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{academicPeriod}</span>
              </p>
            </div>
            <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-2xs">
              Aktif
            </span>
          </div>

          {/* Academic Period & KKM Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Semester & Tahun Ajaran</span>
                {!editingPeriod && (
                  <button
                    onClick={() => { setInputPeriodValue(academicPeriod); setEditingPeriod(true); }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Ubah
                  </button>
                )}
              </label>
              {editingPeriod ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={inputPeriodValue}
                    onChange={(e) => setInputPeriodValue(e.target.value)}
                    placeholder="Semester 1 (2024/2025)"
                    className="flex-1 text-xs px-2.5 py-1.5 bg-slate-50 border border-indigo-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 font-semibold text-slate-800"
                  />
                  <button
                    onClick={handleSavePeriod}
                    className="px-2.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div className="text-xs font-semibold text-slate-700 bg-slate-100/70 px-3 py-2 rounded-lg border border-slate-200">
                  {academicPeriod}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Standar KKM Sekolah</span>
                <span className="text-[10px] text-emerald-600 font-bold">Ketuntasan Minimal</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={inputKkmValue}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setInputKkmValue(val);
                    if (onUpdateKKM) onUpdateKKM(val);
                  }}
                  className="w-full text-xs font-bold text-slate-800 px-3 py-1.5 bg-emerald-50/60 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* Class List & Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Daftar Kelas Tersedia ({classList.length})
            </label>

            <div className="space-y-2">
              {classList.map((cls) => {
                const isActive = cls === activeClass;
                const isEditingThis = editingClassName === cls;

                return (
                  <div
                    key={cls}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-indigo-50/90 border-indigo-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {isEditingThis ? (
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={editInputValue}
                          onChange={(e) => setEditInputValue(e.target.value)}
                          className="flex-1 text-xs px-3 py-1.5 bg-white border border-indigo-400 rounded-lg font-bold text-slate-900 focus:outline-hidden"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(cls)}
                        />
                        <button
                          onClick={() => handleSaveRename(cls)}
                          className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                          title="Simpan nama kelas"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingClassName(null)}
                          className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
                          title="Batal"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          onSelectClass(cls);
                        }}
                        className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {cls.replace(/Kelas\s*/i, '').substring(0, 3) || 'KL'}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>{cls}</span>
                            {isActive && (
                              <span className="text-[10px] text-indigo-700 font-extrabold bg-indigo-100 px-2 py-0.5 rounded-full">
                                Terpilih
                              </span>
                            )}
                          </h5>
                          <p className="text-[11px] text-slate-500">Klik untuk beralih ke kelas ini</p>
                        </div>
                      </div>
                    )}

                    {!isEditingThis && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartRename(cls)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Ubah Nama Kelas"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {classList.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus "${cls}" dari daftar kelas?`)) {
                                onDeleteClass(cls);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Kelas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add New Class Form */}
          <form onSubmit={handleAddSubmit} className="space-y-2 pt-2 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Tambah Kelas Baru
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Contoh: Kelas 10-IPA 2, Kelas 11-B"
                className="flex-1 text-xs px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800"
              />
              <button
                type="submit"
                disabled={!newClassName.trim()}
                className="px-4 py-2 bg-[#0B63E5] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </div>
          </form>

          {/* Backup & Restore Data Section */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>Cadangkan & Pulihkan Data (Backup & Restore)</span>
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Simpan semua data nilai, kelas, dan riwayat ke file JSON atau pulihkan dari cadangan sebelumnya.
              </p>
            </div>

            {restoreMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{restoreMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Backup / Download JSON */}
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-indigo-50 border border-slate-300 hover:border-indigo-300 text-slate-800 hover:text-indigo-900 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer group"
              >
                <Download className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                <span>Backup Data (JSON)</span>
              </button>

              {/* Restore / Upload JSON */}
              <label className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Restore Data (JSON)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileRestore}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Perubahan kelas akan menyesuaikan data & rekap nilai.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
