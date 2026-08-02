import React from 'react';
import { GradeLog } from '../types';

interface RecentUpdatesProps {
  logs: GradeLog[];
  onViewAllActivity: () => void;
}

export const RecentUpdates: React.FC<RecentUpdatesProps> = ({ logs, onViewAllActivity }) => {
  // Show last 5 logs
  const displayLogs = logs.slice(0, 5);

  const getAvatarBg = (initials: string) => {
    if (initials === 'AS' || initials === 'DW') return 'bg-sky-100 text-sky-700';
    if (initials === 'RM' || initials === 'FP') return 'bg-purple-100 text-purple-700';
    return 'bg-indigo-100 text-indigo-700';
  };

  const getScoreBadgeStyle = (score: number) => {
    if (score < 75) {
      return 'bg-red-50 text-red-600 border border-red-200/60 font-bold';
    }
    return 'bg-sky-50 text-sky-600 border border-sky-200/60 font-bold';
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Pembaruan Terkini</h3>
          <p className="text-xs text-slate-500 mt-0.5">5 entri nilai terakhir</p>
        </div>

        {/* Table Head */}
        <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-2 mb-3">
          <span className="col-span-7">SISWA</span>
          <span className="col-span-3 text-center">NILAI</span>
          <span className="col-span-2 text-right">WAKTU</span>
        </div>

        {/* Student Logs */}
        <div className="space-y-3">
          {displayLogs.map((log, idx) => (
            <div key={`${log.id}_${idx}`} className="grid grid-cols-12 gap-2 items-center text-xs py-1 hover:bg-slate-50 rounded-lg px-1 transition-colors">
              {/* Student Initials + Name */}
              <div className="col-span-7 flex items-center gap-2.5 overflow-hidden">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${getAvatarBg(log.studentInitials)}`}>
                  {log.studentInitials}
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 truncate">{log.studentName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{log.subject}</p>
                </div>
              </div>

              {/* Score Badge */}
              <div className="col-span-3 flex justify-center">
                <span className={`px-2.5 py-1 rounded-md text-xs min-w-[34px] text-center ${getScoreBadgeStyle(log.score)}`}>
                  {log.score}
                </span>
              </div>

              {/* Relative Time */}
              <div className="col-span-2 text-right text-[11px] text-slate-400 font-medium">
                {log.timeAgo}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-4 border-t border-slate-100 text-center mt-4">
        <button
          onClick={onViewAllActivity}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all inline-flex items-center gap-1"
        >
          Lihat Semua Aktivitas
        </button>
      </div>
    </div>
  );
};
