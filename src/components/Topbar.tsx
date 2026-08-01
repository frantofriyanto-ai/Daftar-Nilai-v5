import React from 'react';
import { Search, Bell, Settings, Plus, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenQuickAdd: () => void;
  onOpenAppsScriptModal: () => void;
  isSyncing?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenQuickAdd,
  onOpenAppsScriptModal,
  isSyncing
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari siswa atau mata pelajaran..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder-slate-400 transition-all"
        />
      </div>

      {/* Title */}
      <div className="hidden md:block text-center">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Daftar Nilai</h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Apps Script & Google Sheets Button */}
        <button
          onClick={onOpenAppsScriptModal}
          title="Google Sheets Apps Script Automation"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F766E] bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Google Sheets & Apps Script</span>
          {isSyncing && <RefreshCw className="w-3 h-3 text-teal-600 animate-spin ml-1" />}
        </button>

        {/* Notifications Icon with Badge */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Settings Gear */}
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
        </button>

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0B63E5] rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Cepat</span>
        </button>
      </div>
    </header>
  );
};
