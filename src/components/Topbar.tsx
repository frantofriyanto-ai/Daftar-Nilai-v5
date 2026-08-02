import React from 'react';
import { Search, Bell, Plus, FileSpreadsheet, RefreshCw, Menu } from 'lucide-react';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenQuickAdd: () => void;
  onOpenAppsScriptModal: () => void;
  isSyncing?: boolean;
  webAppUrl?: string;
  lastSyncTime?: string;
  onOpenMobileSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenQuickAdd,
  onOpenAppsScriptModal,
  isSyncing,
  webAppUrl = '',
  lastSyncTime = '',
  onOpenMobileSidebar
}) => {
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

        <div className="relative w-full sm:w-72 lg:w-80">
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

      {/* Title */}
      <div className="hidden lg:block text-center shrink-0">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Daftar Nilai</h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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
              <span className="hidden md:inline font-bold text-emerald-900">Sheets Real-time</span>
              <span className="md:hidden text-[11px] font-bold text-emerald-900">Realtime</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
            </>
          ) : (
            <>
              <span className="hidden md:inline">Google Sheets & Apps Script</span>
              <span className="md:hidden text-[11px]">Sheets</span>
            </>
          )}
          {isSyncing && <RefreshCw className="w-3 h-3 text-teal-600 animate-spin ml-0.5" />}
        </button>

        {/* Notifications Icon with Badge */}
        <button className="relative p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white bg-[#0B63E5] rounded-lg hover:bg-blue-700 transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Tambah Cepat</span>
          <span className="sm:hidden text-[11px]">Tambah</span>
        </button>
      </div>
    </header>
  );
};
