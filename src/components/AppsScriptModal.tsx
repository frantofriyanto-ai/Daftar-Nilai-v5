import React, { useState } from 'react';
import { X, Copy, Check, FileSpreadsheet, Code2, PlayCircle, ExternalLink, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateAppsScriptCode } from '../utils/appsScriptGenerator';

interface AppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  webAppUrl: string;
  onSaveWebAppUrl: (url: string) => void;
  onSyncData: () => Promise<void>;
  isSyncing: boolean;
}

export const AppsScriptModal: React.FC<AppsScriptModalProps> = ({
  isOpen,
  onClose,
  webAppUrl,
  onSaveWebAppUrl,
  onSyncData,
  isSyncing
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#4C4B7C] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Google Sheets & Apps Script Automation</h3>
              <p className="text-xs text-indigo-200">Otomatisasi Sinkronisasi Spreadsheet ke Dashboard Nilai Kelas 12-A</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-2 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('codegs')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'codegs'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Code.gs (Backend Script)</span>
          </button>

          <button
            onClick={() => setActiveTab('indexhtml')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'indexhtml'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-600" />
            <span>Index.html (Web App UI)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'guide'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlayCircle className="w-4 h-4 text-amber-600" />
            <span>Panduan Pasang (Setup Guide)</span>
          </button>

          <button
            onClick={() => setActiveTab('connect')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'connect'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-teal-600" />
            <span>Hubungkan Web App URL</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          
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
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Sinkronkan Langsung dengan Google Sheets Web App</h4>
                    <p className="text-xs text-slate-500">Masukkan URL Web App hasil Deploy Google Apps Script Anda di sini.</p>
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

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      Simpan Web App URL
                    </button>

                    <button
                      type="button"
                      onClick={onSyncData}
                      disabled={isSyncing}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Menyingkronkan...' : 'Tes Sinkron Data Now'}</span>
                    </button>
                  </div>

                  {saveSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>URL Web App Google Sheets berhasil disimpan & siap digunakan!</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">Format Otomatisasi untuk Google Sheets Class 12-A</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
