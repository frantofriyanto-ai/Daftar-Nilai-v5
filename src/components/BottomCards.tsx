import React from 'react';
import { ArrowRight, CheckSquare } from 'lucide-react';

interface BottomCardsProps {
  onViewAttendanceDetails: () => void;
  onFinishGrading: () => void;
}

export const BottomCards: React.FC<BottomCardsProps> = ({
  onViewAttendanceDetails,
  onFinishGrading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Class Attendance Trend Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
        {/* Subtle Zigzag Graphic SVG Overlay in Top-Right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none flex items-center justify-end pr-4">
          <svg className="w-48 h-24 text-slate-400" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="10,80 60,80 100,20 140,50 190,10" />
          </svg>
        </div>

        <div className="relative z-10 max-w-[80%]">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Tren Kehadiran Kelas</h3>
          <p className="text-xs text-slate-500 mt-1">Kehadiran stabil 94% selama 30 hari terakhir.</p>
        </div>

        <div className="relative z-10 pt-4">
          <button
            onClick={onViewAttendanceDetails}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-all group"
          >
            <span>Lihat rincian</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. Grading Status Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
        {/* Right Icon Graphic */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 opacity-80 pointer-events-none">
          <div className="space-y-1.5 w-10">
            <div className="h-2 bg-slate-200 rounded-full w-full"></div>
            <div className="h-2 bg-slate-200 rounded-full w-3/4"></div>
            <div className="h-2 bg-blue-500 rounded-full w-1/2 mt-1"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-[75%]">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Status Penilaian</h3>
          <p className="text-xs text-slate-500 mt-1">3 tugas menunggu pemeriksaan pada Matematika.</p>
        </div>

        <div className="relative z-10 pt-4">
          <button
            onClick={onFinishGrading}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-all group"
          >
            <span>Selesaikan penilaian</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
