import React from 'react';
import { Users, Calculator, Trophy, CheckCircle2 } from 'lucide-react';

interface MetricCardsProps {
  totalStudents: number;
  mathAvg: number | string;
  highestScore: number;
  attendanceRate: number | string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalStudents,
  mathAvg,
  highestScore,
  attendanceRate
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Students */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Total Siswa</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">{totalStudents}</p>
        </div>
      </div>

      {/* 2. Math Avg */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#F0EBFF] text-[#7C3AED] flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Rata-Rata Matematika</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">{mathAvg}</p>
        </div>
      </div>

      {/* 3. Highest Score */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Nilai Tertinggi</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">{highestScore}</p>
        </div>
      </div>

      {/* 4. Attendance */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Tingkat Kehadiran</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            {typeof attendanceRate === 'number' ? `${attendanceRate}%` : attendanceRate}
          </p>
        </div>
      </div>
    </div>
  );
};
