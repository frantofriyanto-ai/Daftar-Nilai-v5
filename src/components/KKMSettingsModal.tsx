import React, { useState } from 'react';
import { SubjectKKMMap, DEFAULT_SUBJECT_KKM, SUBJECT_NAMES } from '../types';
import { Target, X, Check, RefreshCw, Smartphone, Globe, Sparkles, BookOpen, Layers, ShieldCheck } from 'lucide-react';

interface KKMSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  kkmMap: SubjectKKMMap;
  onSaveKKMMap: (newMap: SubjectKKMMap) => void;
  globalKkm: number;
  onSaveGlobalKkm: (kkm: number) => void;
}

export const KKMSettingsModal: React.FC<KKMSettingsModalProps> = ({
  isOpen,
  onClose,
  kkmMap,
  onSaveKKMMap,
  globalKkm,
  onSaveGlobalKkm,
}) => {
  const [activeTab, setActiveTab] = useState<'subject' | 'vercel'>('subject');
  const [localMap, setLocalMap] = useState<SubjectKKMMap>({ ...kkmMap });
  const [localGlobal, setLocalGlobal] = useState<number>(globalKkm);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const subjectKeys = Object.keys(SUBJECT_NAMES) as (keyof SubjectKKMMap)[];

  const handleSubjectKkmChange = (key: keyof SubjectKKMMap, val: number) => {
    const clamped = Math.min(100, Math.max(40, val));
    setLocalMap((prev) => ({ ...prev, [key]: clamped }));
  };

  const handleApplyToAll = (value: number) => {
    const updated: SubjectKKMMap = {
      math: value,
      indonesian: value,
      english: value,
      science: value,
      pancasila: value,
      arts: value,
      sundanese: value,
      cocurricular: value,
    };
    setLocalMap(updated);
    setLocalGlobal(value);
  };

  const handleResetToDefault = () => {
    setLocalMap({ ...DEFAULT_SUBJECT_KKM });
    setLocalGlobal(75);
  };

  const handleSaveAll = () => {
    onSaveKKMMap(localMap);
    onSaveGlobalKkm(localGlobal);
    setSavedMessage('Pengaturan KKM Mata Pelajaran Berhasil Disimpan!');
    setTimeout(() => {
      setSavedMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white p-3.5 sm:p-5 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
              <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-lg text-white leading-tight">Pengaturan KKM Mata Pelajaran</h3>
              <p className="text-[11px] sm:text-xs text-indigo-100 mt-0.5 leading-tight">Kriteria Ketuntasan Minimal (KKM) SD & Petunjuk Publikasi Vercel</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-6 flex items-center gap-2 pt-2 overflow-x-auto whitespace-nowrap scrollbar-thin shrink-0">
          <button
            onClick={() => setActiveTab('subject')}
            className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 border-t border-x shrink-0 whitespace-nowrap ${
              activeTab === 'subject'
                ? 'bg-white text-blue-700 border-slate-200 shadow-2xs -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            <span>KKM per Mapel SD</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 border-t border-x shrink-0 whitespace-nowrap ${
              activeTab === 'vercel'
                ? 'bg-white text-emerald-700 border-slate-200 shadow-2xs -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>Cara Deploy Vercel & Akses HP</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {savedMessage && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{savedMessage}</span>
            </div>
          )}

          {activeTab === 'subject' ? (
            <>
              {/* Preset Buttons for Quick Mobile Adjustment */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Set KKM Sama untuk Semua Mapel:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Standar SD</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {[70, 75, 78, 80, 85].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleApplyToAll(preset)}
                      className="px-3 py-1.5 bg-white hover:bg-indigo-600 hover:text-white text-indigo-900 text-xs font-extrabold rounded-lg border border-indigo-200 transition-colors shadow-2xs cursor-pointer"
                    >
                      KKM {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject List Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Input Nilai KKM per Mata Pelajaran (Sekolah Dasar)</span>
                  <span className="text-[11px] text-slate-500 font-normal">Geser/Ketuk tombol di HP</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subjectKeys.map((key) => {
                    const info = SUBJECT_NAMES[key];
                    const val = localMap[key] ?? 75;

                    return (
                      <div
                        key={key}
                        className="p-3 bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-between gap-2 transition-all shadow-2xs"
                      >
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                              {info.code}
                            </span>
                            <span className="text-xs font-bold text-slate-800 truncate" title={info.name}>
                              {info.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-0.5 block">
                            Status: Nilai &ge; {val} = Tuntas
                          </span>
                        </div>

                        {/* Handphone Touch Controls */}
                        <div className="flex items-center gap-1 shrink-0 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleSubjectKkmChange(key, val - 1)}
                            className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center justify-center text-xs active:scale-95 cursor-pointer touch-manipulation"
                            title="Kurangi 1"
                          >
                            -
                          </button>
                          
                          <input
                            type="number"
                            min="40"
                            max="100"
                            value={val}
                            onChange={(e) => handleSubjectKkmChange(key, Number(e.target.value))}
                            className="w-11 text-center font-extrabold text-xs text-blue-900 focus:outline-hidden py-1"
                          />

                          <button
                            type="button"
                            onClick={() => handleSubjectKkmChange(key, val + 1)}
                            className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center justify-center text-xs active:scale-95 cursor-pointer touch-manipulation"
                            title="Tambah 1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Vercel & Mobile Deployment Guide Tab */
            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>Petunjuk Deploy Aplikasi ke Vercel (Gratis & Bisa Diedit di HP)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Aplikasi Wali Kelas ini menggunakan standar modern React + Vite + Tailwind CSS yang sangat ringan dan siap di-deploy publik secara gratis di Vercel dalam hitungan 2 menit.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                  <span>Langkah Upload ke GitHub & Vercel</span>
                </h4>
                <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl space-y-2 font-mono text-[11px]">
                  <p className="text-slate-700 font-sans">
                    <strong>A. Upload project ke Repository GitHub</strong> (Export ZIP/GitHub dari AI Studio).
                  </p>
                  <p className="text-slate-700 font-sans">
                    <strong>B. Buka Vercel Dashboard</strong> di browser (laptop/HP): <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">https://vercel.com</a>
                  </p>
                  <p className="text-slate-700 font-sans">
                    <strong>C. Klik &quot;Add New...&quot; &rarr; &quot;Project&quot;</strong>, lalu impor repository GitHub Anda.
                  </p>
                  <p className="text-slate-700 font-sans">
                    <strong>D. Build Settings di Vercel:</strong>
                  </p>
                  <ul className="list-disc pl-5 font-sans space-y-1 text-slate-600">
                    <li>Framework Preset: <code>Vite</code></li>
                    <li>Build Command: <code>npm run build</code></li>
                    <li>Output Directory: <code>dist</code></li>
                  </ul>
                  <p className="text-slate-700 font-sans">
                    <strong>E. Klik Deploy!</strong> Vercel akan memberikan domain publik gratis seperti <code>https://nama-aplikasi.vercel.app</code>.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                  <span>Koneksi Database Google Sheets (Gratis & Real-time di HP)</span>
                </h4>
                <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl space-y-2 text-slate-700 leading-relaxed">
                  <p>
                    Aplikasi ini telah dilengkapi fitur <strong>Integrasi Google Sheets & Apps Script Real-time</strong>. Semua perubahan nilai yang dilakukan di HP Guru akan langsung tersimpan di Google Drive / Spreadsheet secara otomatis tanpa biaya server.
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    *Untuk menghubungkan database, klik tombol hijau <strong>&quot;Integrasi Sheets&quot;</strong> di bagian atas menu aplikasi.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
                  <span>Penggunaan di Handphone (PWA / Mobile Friendly)</span>
                </h4>
                <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl space-y-2 text-slate-700 leading-relaxed">
                  <p>
                    Buka link Vercel di Chrome/Safari HP &rarr; pilih <strong>&quot;Tambahkan ke Layar Utama&quot; (Add to Home Screen)</strong>. Aplikasi akan menjadi seperti aplikasi HP asli dengan tombol sentuh yang nyaman untuk Wali Kelas!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3.5 sm:p-4 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            {activeTab === 'subject' ? 'Perubahan KKM langsung memperbarui Rapor & WA Orang Tua.' : 'Siap dipublikasikan ke Vercel.'}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
            >
              Batal
            </button>
            {activeTab === 'subject' && (
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan KKM</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
