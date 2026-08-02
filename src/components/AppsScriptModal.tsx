import React, { useState } from 'react';
import { X, Copy, Check, FileSpreadsheet, Code2, PlayCircle, ExternalLink, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateAppsScriptCode } from '../utils/appsScriptGenerator';

interface AppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  webAppUrl: string;
  onSaveWebAppUrl: (url: string) => void;
  onSyncData: (mode?: 'pull' | 'push' | 'both') => Promise<void>;
  isSyncing: boolean;
  activeClass?: string;
}

export const AppsScriptModal: React.FC<AppsScriptModalProps> = ({
  isOpen,
  onClose,
  webAppUrl,
  onSaveWebAppUrl,
  onSyncData,
  isSyncing,
  activeClass = 'Kelas 12-A'
}) => {
  const [activeTab, setActiveTab] = useState<'codegs' | 'indexhtml' | 'guide' | 'connect'>('codegs');
  const [copiedGs, setCopiedGs] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [inputUrl, setInputUrl] = useState(webAppUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const { codeGs, indexHtml } = generateAppsScriptCode();

  const handleCopyGs = () => {
    navigator.clipboard.writeText(codeGs);
    setCopiedGs(true);
    setTimeout(() => setCopiedGs(false), 2000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(indexHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWebAppUrl(inputUrl.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#4C4B7C] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center font-bold shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold leading-tight">Google Sheets & Apps Script Automation</h3>
              <p className="text-[11px] sm:text-xs text-indigo-200 leading-tight">Otomatisasi Sinkronisasi Spreadsheet ke Dashboard Nilai {activeClass}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - Overflow Scroll for Mobile */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-6 flex items-center gap-1 sm:gap-2 text-xs font-semibold shrink-0 overflow-x-auto whitespace-nowrap scrollbar-thin">
          <button
            onClick={() => setActiveTab('codegs')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'codegs'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            <span>Code.gs (Backend)</span>
          </button>

          <button
            onClick={() => setActiveTab('indexhtml')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'indexhtml'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>Index.html (Web App)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            <span>Panduan Pasang</span>
          </button>

          <button
            onClick={() => setActiveTab('connect')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'connect'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600" />
            <span>Hubungkan Web App URL</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50 min-h-0">
          
          {/* 1. Code.gs */}
          {activeTab === 'codegs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Script Backend Google Apps Script (`Code.gs`)</h4>
                  <p className="text-xs text-slate-500">Salin kode ini dan tempelkan ke Google Apps Script Editor pada Google Sheets Anda.</p>
                </div>
                <button
                  onClick={handleCopyGs}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  {copiedGs ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGs ? 'Tersalin!' : 'Copy Code.gs'}</span>
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs p-4 max-h-[380px] overflow-y-auto">
                <pre><code>{codeGs}</code></pre>
              </div>
            </div>
          )}

          {/* 2. Index.html */}
          {activeTab === 'indexhtml' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">HTML Template (`Index.html`)</h4>
                  <p className="text-xs text-slate-500">Buat file HTML baru di Apps Script dengan nama <span className="font-mono text-blue-600">Index.html</span> lalu salin kode ini.</p>
                </div>
                <button
                  onClick={handleCopyHtml}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  {copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHtml ? 'Tersalin!' : 'Copy Index.html'}</span>
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs p-4 max-h-[380px] overflow-y-auto">
                <pre><code>{indexHtml}</code></pre>
              </div>
            </div>
          )}

          {/* 3. Setup Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-slate-900">Panduan 4 Langkah Menghubungkan Google Sheets ke Dashboard</h4>
                <p className="text-xs text-slate-500">Gunakan Google Apps Script gratis bawaan Google Workspace tanpa biaya server.</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">1</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Buka Google Sheets & Apps Script</h5>
                    <p className="text-xs text-slate-600 mt-0.5">Buka file Google Sheets Anda, lalu klik menu <span className="font-semibold text-slate-900">Ekstensi (Extensions) → Apps Script</span>.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-sm">2</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Tempelkan Script Backend & File HTML</h5>
                    <p className="text-xs text-slate-600 mt-0.5">Hapus isi `Code.gs` lama, lalu tempelkan kode dari tab <span className="font-semibold text-blue-600">Code.gs</span> di atas. Tambahkan file `Index.html` baru di Apps Script lalu tempelkan kode HTML.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0 text-sm">3</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Jalankan Fungsi Inisialisasi Sheet</h5>
                    <p className="text-xs text-slate-600 mt-0.5">Pilih fungsi <span className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded">setupAcademicSheet</span> pada toolbar editor Apps Script dan klik <span className="font-semibold text-slate-900">Run</span>. Ini akan membuat sheet "Daftar Nilai 12-A" lengkap dengan tata letak header dan warna yang cantik!</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-sm">4</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Terapkan Sebagai Web App</h5>
                    <p className="text-xs text-slate-600 mt-0.5">Klik <span className="font-semibold text-slate-900">Deploy → New deployment</span>. Pilih tipe <span className="font-semibold text-slate-900">Web app</span>. Atur <span className="font-semibold text-slate-900">Who has access</span> ke <span className="font-semibold text-emerald-700">Anyone</span>. Salin URL Web App yang dihasilkan untuk dimasukkan ke tab "Hubungkan Web App URL"!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Connect Web App URL */}
          {activeTab === 'connect' && (
            <div className="space-y-6 max-w-xl mx-auto py-2">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Hubungan Real-Time Google Spreadsheet</h4>
                    <p className="text-xs text-slate-500">Otomatisasi pengiriman nilai & data siswa secara langsung dari Dashboard ke Google Sheets.</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div>
                    <span className="font-bold">Real-time Assessment Sync Enabled</span>
                    <p className="text-[11px] text-emerald-800 mt-0.5">Setiap kali Anda mengedit nilai Tugas, TP, Formatif, Sumatif, Kehadiran, atau Catatan Siswa, data langsung dikirim ke Google Spreadsheet via Web App `doPost`.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveUrl} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Web App Deployment URL:</label>
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-mono"
                    />
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                    >
                      Simpan Web App URL
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onSyncData('pull')}
                        disabled={isSyncing}
                        className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Tarik perubahan nilai yang diedit langsung di Google Sheets ke Dashboard Aplikasi"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>📥 Tarik Data dari Sheets</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSyncData('both')}
                        disabled={isSyncing}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>🔄 Sync Dua Arah Now</span>
                      </button>
                    </div>
                  </div>

                  {saveSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>URL Web App Google Sheets berhasil disimpan! Penilaian kini terhubung real-time.</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex justify-between items-center text-xs shrink-0">
          <span className="text-slate-500 text-[10px] sm:text-xs truncate max-w-[200px] sm:max-w-none">
            Format Otomatisasi Google Sheets {activeClass}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 sm:py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
