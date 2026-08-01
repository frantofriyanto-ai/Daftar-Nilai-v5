import React, { useState } from 'react';
import { Student, SubjectGradeBreakdown, getSubjectGradeBreakdown, getSubjectFinalScore } from '../types';
import { Search, Edit2, Check, Download, FileText, ArrowUpDown, Percent, Calculator, Award, Sliders, X, GitCompare, Plus, Users, CheckSquare, Square, Sparkles, Target, Eye, EyeOff, Focus, Filter } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StudentDataViewProps {
  students: Student[];
  onUpdateStudent: (updated: Student) => void;
  onOpenExportModal: (student?: Student) => void;
}

const COMPARE_COLORS = [
  { stroke: '#2563EB', fill: '#3B82F6', bg: 'bg-blue-500', text: 'text-blue-700', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { stroke: '#059669', fill: '#10B981', bg: 'bg-emerald-500', text: 'text-emerald-700', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { stroke: '#D97706', fill: '#F59E0B', bg: 'bg-amber-500', text: 'text-amber-700', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { stroke: '#7C3AED', fill: '#8B5CF6', bg: 'bg-purple-500', text: 'text-purple-700', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
  { stroke: '#E11D48', fill: '#F43F5E', bg: 'bg-rose-500', text: 'text-rose-700', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200' },
];

const SUBJECT_LIST = [
  { key: 'math', label: 'MTK', fullName: 'Matematika' },
  { key: 'indonesian', label: 'BINDO', fullName: 'Bahasa Indonesia' },
  { key: 'english', label: 'BING', fullName: 'Bahasa Inggris' },
  { key: 'science', label: 'IPAS', fullName: 'IPAS (Sains)' },
  { key: 'pancasila', label: 'PPKN', fullName: 'Pendidikan Pancasila' },
  { key: 'arts', label: 'SENI', fullName: 'Seni Budaya' },
  { key: 'sundanese', label: 'SUNDA', fullName: 'Bahasa Sunda' },
  { key: 'cocurricular', label: 'KOKUR', fullName: 'Kokurikuler' },
] as const;

export const StudentDataView: React.FC<StudentDataViewProps> = ({
  students,
  onUpdateStudent,
  onOpenExportModal
}) => {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Student | null>(null);
  const [sortField, setSortField] = useState<'name' | 'math' | 'total' | 'attendance'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Mode Fokus State ('all' or specific subject key e.g. 'math')
  const [focusSubjectKey, setFocusSubjectKey] = useState<string>('all');

  const visibleSubjects = focusSubjectKey === 'all'
    ? SUBJECT_LIST
    : SUBJECT_LIST.filter((s) => s.key === focusSubjectKey);

  // Comparison State
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // State for detailed breakdown modal
  const [breakdownModalStudent, setBreakdownModalStudent] = useState<Student | null>(null);
  const [breakdownForm, setBreakdownForm] = useState<Student['grades'] | null>(null);

  const getStudentTotalAndAvg = (s: Student) => {
    const g = s.grades;
    const m = getSubjectFinalScore(g.math);
    const i = getSubjectFinalScore(g.indonesian);
    const e = getSubjectFinalScore(g.english);
    const sc = getSubjectFinalScore(g.science);
    const p = getSubjectFinalScore(g.pancasila);
    const a = getSubjectFinalScore(g.arts);
    const su = getSubjectFinalScore(g.sundanese);
    const c = getSubjectFinalScore(g.cocurricular);
    const total = Math.round((m + i + e + sc + p + a + su + c) * 10) / 10;
    const avg = Math.round((total / 8) * 10) / 10;
    return { total, avg };
  };

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.nis.toLowerCase().includes(q) ||
      s.avatarInitials.toLowerCase().includes(q)
    );
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortField === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sortField === 'math') {
      const mA = getSubjectFinalScore(a.grades.math);
      const mB = getSubjectFinalScore(b.grades.math);
      return sortAsc ? mA - mB : mB - mA;
    }
    if (sortField === 'attendance') {
      return sortAsc ? a.attendanceRate - b.attendanceRate : b.attendanceRate - a.attendanceRate;
    }
    if (sortField === 'total') {
      const totalA = getStudentTotalAndAvg(a).total;
      const totalB = getStudentTotalAndAvg(b).total;
      return sortAsc ? totalA - totalB : totalB - totalA;
    }
    return 0;
  });

  const handleStartEdit = (student: Student) => {
    setEditingId(student.id);
    setEditForm({ ...student, grades: { ...student.grades } });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      onUpdateStudent(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleOpenBreakdownModal = (student: Student) => {
    setBreakdownModalStudent(student);
    setBreakdownForm(JSON.parse(JSON.stringify(student.grades)));
  };

  const handleSaveBreakdownModal = () => {
    if (breakdownModalStudent && breakdownForm) {
      onUpdateStudent({
        ...breakdownModalStudent,
        grades: breakdownForm,
        updatedAt: 'Baru saja'
      });
      setBreakdownModalStudent(null);
      setBreakdownForm(null);
    }
  };

  const toggleCompareStudent = (id: string) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else {
        if (prev.length >= 5) return prev;
        return [...prev, id];
      }
    });
  };

  const handleOpenCompareModal = () => {
    if (selectedCompareIds.length === 0 && students.length >= 2) {
      setSelectedCompareIds([students[0].id, students[1].id]);
    }
    setIsCompareModalOpen(true);
  };

  const selectedCompareStudents = students.filter((s) => selectedCompareIds.includes(s.id));

  const radarChartData = SUBJECT_LIST.map((subj) => {
    const row: Record<string, any> = {
      subject: subj.label,
      fullName: subj.fullName
    };
    selectedCompareStudents.forEach((st) => {
      row[st.id] = getSubjectFinalScore(st.grades[subj.key as keyof Student['grades']]);
    });
    return row;
  });

  const getStudentBestAndWeakestSubject = (s: Student) => {
    let maxSc = -1;
    let maxSubj = '';
    let minSc = 101;
    let minSubj = '';

    SUBJECT_LIST.forEach((subj) => {
      const sc = getSubjectFinalScore(s.grades[subj.key as keyof Student['grades']]);
      if (sc > maxSc) {
        maxSc = sc;
        maxSubj = subj.label;
      }
      if (sc < minSc) {
        minSc = sc;
        minSubj = subj.label;
      }
    });

    return { best: `${maxSubj} (${maxSc})`, weakest: `${minSubj} (${minSc})` };
  };

  // Class overall stats
  const totalStudentsCount = students.length || 1;
  const overallClassTotalSum = Math.round(students.reduce((acc, s) => acc + getStudentTotalAndAvg(s).total, 0));
  const overallClassAvgScore = (students.reduce((acc, s) => acc + getStudentTotalAndAvg(s).avg, 0) / totalStudentsCount).toFixed(1);
  const overallAttendanceAvg = Math.round(students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / totalStudentsCount);

  return (
    <div className="space-y-6">
      {/* Header & Summary Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Data Siswa, Kehadiran & Total Nilai (Kelas 12-A)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Kelola nilai akhir & rincian komponen (Tugas 20%, TP1-5 25%, Formatif 20%, Sumatif 30%, Kehadiran 5%).</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau NIS..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              onClick={handleOpenCompareModal}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer shadow-xs border ${
                selectedCompareIds.length > 0
                  ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Bandingkan Radar Siswa ({selectedCompareIds.length})</span>
            </button>

            <button
              onClick={() => onOpenExportModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Cetak Rekap PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-emerald-800 font-semibold">Rata-Rata Kehadiran Kelas</span>
            </div>
            <span className="text-sm font-extrabold text-emerald-900">{overallAttendanceAvg}%</span>
          </div>

          <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-800 font-semibold">Rata-Rata Nilai Keseluruhan</span>
            </div>
            <span className="text-sm font-extrabold text-blue-900">{overallClassAvgScore} / 100</span>
          </div>

          <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span className="text-xs text-indigo-800 font-semibold">Total Nilai Akumulasi Kelas</span>
            </div>
            <span className="text-sm font-extrabold text-indigo-900">{overallClassTotalSum.toLocaleString()} Poin</span>
          </div>
        </div>
      </div>

      {/* Mode Fokus Toolbar */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl transition-all ${focusSubjectKey !== 'all' ? 'bg-amber-400 text-slate-950 font-bold shadow-md animate-pulse' : 'bg-slate-800 text-indigo-300'}`}>
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Mode Fokus Input Mapel</h3>
              {focusSubjectKey !== 'all' ? (
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-400 text-slate-950 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  AKTIF: {SUBJECT_LIST.find(s => s.key === focusSubjectKey)?.fullName}
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-slate-400 rounded-full">
                  Semua Mapel Ditampilkan
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sembunyikan kolom nilai lain agar fokus dan konsentrasi saat menginput nilai mata pelajaran tertentu.
            </p>
          </div>
        </div>

        {/* Focus Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFocusSubjectKey('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              focusSubjectKey === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Semua (8 Mapel)
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          {SUBJECT_LIST.map((subj) => {
            const isSelected = focusSubjectKey === subj.key;
            return (
              <button
                key={subj.key}
                onClick={() => setFocusSubjectKey(subj.key)}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold ring-2 ring-amber-300'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Fokus pada ${subj.fullName}`}
              >
                {isSelected && <Target className="w-3 h-3 text-slate-950" />}
                <span>{subj.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-3 text-center text-indigo-700 font-bold" title="Pilih siswa untuk dibandingan">
                  <div className="flex items-center justify-center gap-1">
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>CEK</span>
                  </div>
                </th>
                <th className="py-3.5 px-4">NIS</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => { setSortField('name'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1">
                    <span>NAMA SISWA</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-2 text-center">JK</th>
                
                {/* Attendance Column */}
                <th className="py-3.5 px-2 text-center cursor-pointer text-emerald-700 hover:text-emerald-900" onClick={() => { setSortField('attendance'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center justify-center gap-0.5">
                    <span>HADIR (%)</span>
                    <ArrowUpDown className="w-3 h-3 text-emerald-500" />
                  </div>
                </th>

                {/* Dynamic Subject Columns (Mode Fokus Filtered) */}
                {visibleSubjects.map((subj) => {
                  const isFocused = focusSubjectKey === subj.key;
                  return (
                    <th
                      key={subj.key}
                      className={`py-3.5 px-3 text-center font-bold cursor-pointer transition-colors ${
                        isFocused
                          ? 'bg-amber-100 text-amber-950 border-x-2 border-amber-400'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                      onClick={() => { setSortField(subj.key as any); setSortAsc(!sortAsc); }}
                      title={`Urutkan berdasarkan nilai ${subj.fullName}`}
                    >
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <span className="text-[11px] font-bold">{subj.label}</span>
                        {isFocused && (
                          <span className="text-[9px] font-extrabold text-amber-900 bg-amber-300 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            <Target className="w-2.5 h-2.5" /> FOKUS
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}

                {/* Total Score Column */}
                <th className="py-3.5 px-3 text-center bg-indigo-50/70 text-indigo-900 font-bold cursor-pointer hover:bg-indigo-100" onClick={() => { setSortField('total'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center justify-center gap-1">
                    <span>JUMLAH</span>
                    <ArrowUpDown className="w-3 h-3 text-indigo-600" />
                  </div>
                </th>

                <th className="py-3.5 px-3 text-center bg-blue-50/70 text-blue-900 font-bold">
                  RATA2
                </th>

                <th className="py-3.5 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStudents.map((s) => {
                const isEditing = editingId === s.id;
                const activeStudentData = isEditing && editForm ? editForm : s;
                const { total: currentTotal, avg: currentAvg } = getStudentTotalAndAvg(activeStudentData);

                const isSelectedForCompare = selectedCompareIds.includes(s.id);
                const compareColorIndex = selectedCompareIds.indexOf(s.id);
                const compareColorObj = compareColorIndex >= 0 ? COMPARE_COLORS[compareColorIndex % COMPARE_COLORS.length] : null;

                return (
                  <tr key={s.id} className={`hover:bg-slate-50/80 transition-colors ${isEditing ? 'bg-amber-50/40' : isSelectedForCompare ? 'bg-indigo-50/30' : ''}`}>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelectedForCompare}
                        onChange={() => toggleCompareStudent(s.id)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        title="Pilih untuk perbandingan side-by-side"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 flex items-center gap-1.5">
                      {compareColorObj && (
                        <span className={`w-2 h-2 rounded-full ${compareColorObj.bg}`} title="Warna indikator radar chart" />
                      )}
                      <span>{s.nis}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {s.avatarInitials}
                        </div>
                        <div>
                          <p className="truncate max-w-[150px]">{s.name}</p>
                          <p className="text-[10px] font-normal text-slate-400 truncate">{s.notes || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-slate-600">{s.gender}</td>

                    {/* Kehadiran (%) */}
                    <td className="py-3 px-2 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editForm?.attendanceRate ?? 0}
                            onChange={(e) => setEditForm({ ...editForm!, attendanceRate: Math.min(100, Math.max(0, Number(e.target.value))) })}
                            className="w-12 text-center p-1 bg-white border border-emerald-500 rounded-md font-extrabold text-emerald-800 shadow-xs focus:ring-2 focus:ring-emerald-500/20"
                            title="Edit % Kehadiran Siswa"
                          />
                          <span className="text-[10px] font-bold text-emerald-700">%</span>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200/60">
                          {s.attendanceRate}%
                        </span>
                      )}
                    </td>

                    {/* Dynamic Subject Cells (Mode Fokus Filtered) */}
                    {visibleSubjects.map((subj) => {
                      const breakdown = activeStudentData.grades[subj.key as keyof Student['grades']];
                      const finalScore = getSubjectFinalScore(breakdown);
                      const isFocused = focusSubjectKey === subj.key;

                      return (
                        <td
                          key={subj.key}
                          className={`py-3 px-3 text-center transition-colors ${
                            isFocused
                              ? 'bg-amber-50/90 font-extrabold text-amber-950 border-x-2 border-amber-200'
                              : ''
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                finalScore < 75
                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                  : isFocused
                                  ? 'bg-amber-200 text-amber-950 border border-amber-300 shadow-2xs text-sm font-black'
                                  : 'bg-slate-100/90 text-slate-800'
                              }`}
                            >
                              {finalScore}
                            </span>

                            {isFocused && (
                              <button
                                onClick={() => handleOpenBreakdownModal(activeStudentData)}
                                className="text-[10px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-0.5 cursor-pointer"
                                title={`Ubah rincian komponen nilai ${subj.fullName}`}
                              >
                                <Sliders className="w-2.5 h-2.5" />
                                <span>Rincian</span>
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* JUMLAH NILAI */}
                    <td className="py-3 px-3 text-center bg-indigo-50/50 font-extrabold text-indigo-900">
                      <span className="px-2 py-1 bg-indigo-100/80 rounded-md border border-indigo-200">
                        {currentTotal}
                      </span>
                    </td>

                    {/* RATA-RATA */}
                    <td className="py-3 px-3 text-center bg-blue-50/50 font-bold text-blue-900">
                      {currentAvg}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenBreakdownModal(s)}
                          className="px-2 py-1 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200 flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Edit Rincian Komponen Nilai (Tugas, TP, Formatif, Sumatif, Kehadiran)"
                        >
                          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="text-[10px] font-bold">Rincian</span>
                        </button>

                        <button
                          onClick={() => onOpenExportModal(s)}
                          className="px-2 py-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Cetak Rekap Individu & Rapor Laporan Orang Tua Siswa"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px] font-bold">Rapor Orang Tua</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Rincian Komponen Nilai Siswa */}
      {breakdownModalStudent && breakdownForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-[#4C4B7C] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-300" />
                  <span>Edit Rincian Komponen Nilai: {breakdownModalStudent.name} ({breakdownModalStudent.nis})</span>
                </h3>
                <p className="text-xs text-indigo-200 mt-0.5">Persentase: Tugas (20%) + TP1-5 Rata2 (25%) + Formatif (20%) + Sumatif (30%) + Kehadiran (5%)</p>
              </div>
              <button
                onClick={() => { setBreakdownModalStudent(null); setBreakdownForm(null); }}
                className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {[
                { key: 'math', label: 'Matematika' },
                { key: 'indonesian', label: 'Bahasa Indonesia' },
                { key: 'english', label: 'Bahasa Inggris' },
                { key: 'science', label: 'IPAS (Sains)' },
                { key: 'pancasila', label: 'Pendidikan Pancasila' },
                { key: 'arts', label: 'Seni Budaya' },
                { key: 'sundanese', label: 'Bahasa Sunda' },
                { key: 'cocurricular', label: 'Kokurikuler' }
              ].map(({ key, label }) => {
                const subKey = key as keyof Student['grades'];
                const bd = getSubjectGradeBreakdown(breakdownForm[subKey]);
                const tpAvg = Math.round((((bd.tp1 ?? 0) + (bd.tp2 ?? 0) + (bd.tp3 ?? 0) + (bd.tp4 ?? 0) + (bd.tp5 ?? 0)) / 5) * 10) / 10;
                const finalSc = getSubjectFinalScore(bd);

                const updateSub = (field: keyof SubjectGradeBreakdown, val: number) => {
                  setBreakdownForm({
                    ...breakdownForm,
                    [subKey]: {
                      ...bd,
                      [field]: Math.min(100, Math.max(0, val))
                    }
                  });
                };

                return (
                  <div key={key} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{label}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Nilai Akhir Kalkulasi:</span>
                        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-950 font-extrabold text-sm rounded-lg border border-indigo-200">
                          {finalSc}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-9 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-blue-800 mb-0.5">Tugas (20%)</label>
                        <input
                          type="number"
                          value={bd.tugas}
                          onChange={(e) => updateSub('tugas', Number(e.target.value))}
                          className="w-full text-center p-1.5 bg-white border border-blue-300 rounded-md font-bold text-blue-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">TP1</label>
                        <input
                          type="number"
                          value={bd.tp1}
                          onChange={(e) => updateSub('tp1', Number(e.target.value))}
                          className="w-full text-center p-1.5 bg-white border border-slate-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">TP2</label>
                        <input
                          type="number"
                          value={bd.tp2}
                          onChange={(e) => updateSub('tp2', Number(e.target.value))}
                          className="w-full text-center p-1.5 bg-white border border-slate-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">TP3</label>
                        <input
                          type="number"
                          value={bd.tp3}
                          onChange={(e) => updateSub('tp3', Number(e.target.value))}
                          className="w-full text-center p-1.5 bg-white border border-slate-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">TP4</label>
                        <input
                          type="number"
                          value={bd.tp4}
                          onChange={(e) => updateSub('tp4', Number(e.target.value))}
                          className="w-full text-center p-1.5 bg-white border border-slate-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">TP5</label>
                        <input
                          type="number"
                          value={bd.tp5}
                          onChange={(e) => updateSub('tp5', Number(e.target.value))}
                          className="w-full text-center p-1.5 bg-white border border-slate-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-purple-800 mb-0.5">Formatif (20%)</label>
                        <input
                          type="number"
                          value={bd.formatif}
                          onChange={(e) => updateSub('formatif', Number(e.target.value))}
                          className="w-full text-center p-1.5 bg-white border border-purple-300 rounded-md font-bold text-purple-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-rose-800 mb-0.5">Sumatif (30%)</label>
                        <input
                          type="number"
                          value={bd.sumatif}
                          onChange={(e) => updateSub('sumatif', Number(e.target.value))}
                          className="w-full text-center p-1.5 bg-white border border-rose-300 rounded-md font-bold text-rose-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-emerald-800 mb-0.5">Hadir (5%)</label>
                        <input
                          type="number"
                          value={bd.kehadiran}
                          onChange={(e) => updateSub('kehadiran', Number(e.target.value))}
                          className="w-full text-center p-1.5 bg-white border border-emerald-300 rounded-md font-bold text-emerald-900"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Perubahan akan langsung mengkalkulasi ulang total poin dan rata-rata siswa.</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setBreakdownModalStudent(null); setBreakdownForm(null); }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveBreakdownModal}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Semua Rincian Nilai</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Radar Chart & Side-by-Side Comparison */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0B63E5] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <GitCompare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    Analisis Perbandingan Kinerja Siswa (Radar Chart Side-by-Side)
                  </h3>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Bandingkan profil kompetensi & capaian nilai antar siswa dalam 8 mata pelajaran secara visual.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Header Toolbar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {/* Selected Student Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Siswa Dibandingkan ({selectedCompareStudents.length}/5):</span>
                </span>

                {selectedCompareStudents.map((st, idx) => {
                  const col = COMPARE_COLORS[idx % COMPARE_COLORS.length];
                  return (
                    <span
                      key={st.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold shadow-2xs ${col.badgeBg}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${col.bg}`} />
                      <span>{st.name}</span>
                      <button
                        onClick={() => toggleCompareStudent(st.id)}
                        className="p-0.5 hover:bg-slate-200/50 rounded-full cursor-pointer ml-0.5"
                        title="Hapus dari perbandingan"
                      >
                        <X className="w-3 h-3 text-slate-500 hover:text-red-600" />
                      </button>
                    </span>
                  );
                })}

                {/* Add Student Dropdown if under 5 */}
                {selectedCompareStudents.length < 5 && (
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          toggleCompareStudent(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="text-xs py-1 px-2.5 bg-white border border-slate-300 rounded-full font-semibold text-slate-700 hover:border-indigo-500 focus:outline-hidden cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>+ Tambah Siswa...</option>
                      {students
                        .filter((s) => !selectedCompareIds.includes(s.id))
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.nis})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const top2 = [...students]
                      .sort((a, b) => getStudentTotalAndAvg(b).total - getStudentTotalAndAvg(a).total)
                      .slice(0, 2)
                      .map((s) => s.id);
                    setSelectedCompareIds(top2);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                >
                  2 Ranking Teratas
                </button>
                <button
                  onClick={() => setSelectedCompareIds([])}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {selectedCompareStudents.length < 2 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <GitCompare className="w-10 h-10 text-indigo-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">Pilih Minimal 2 Siswa untuk Membandingkan</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Gunakan menu "+ Tambah Siswa" di atas atau beri tanda centang pada tabel siswa untuk menampilkan grafik jaring (radar chart) side-by-side.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Radar Chart */}
                  <div className="lg:col-span-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Grafik Radar Capaian 8 Mapel</span>
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        Skala: 0 - 100
                      </span>
                    </div>

                    <div className="w-full h-[340px] pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                          <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }}
                          />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 9 }} />

                          {selectedCompareStudents.map((st, idx) => {
                            const col = COMPARE_COLORS[idx % COMPARE_COLORS.length];
                            return (
                              <Radar
                                key={st.id}
                                name={st.name}
                                dataKey={st.id}
                                stroke={col.stroke}
                                fill={col.fill}
                                fillOpacity={0.25}
                                strokeWidth={2.5}
                              />
                            );
                          })}
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              fontSize: '12px'
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                      💡 <strong>Petunjuk Guru:</strong> Semakin luas area grafik jaring mendekati tepi luar (nilai 100), semakin tinggi penguasaan materi siswa pada mata pelajaran tersebut.
                    </div>
                  </div>

                  {/* Right Column: Side-by-Side Comparison Matrix */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                      <div className="p-3 bg-slate-100/80 border-b border-slate-200">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Calculator className="w-4 h-4 text-blue-600" />
                          <span>Matriks Perbandingan Nilai Side-by-Side</span>
                        </h4>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                              <th className="py-2.5 px-3">Mata Pelajaran</th>
                              {selectedCompareStudents.map((st, idx) => {
                                const col = COMPARE_COLORS[idx % COMPARE_COLORS.length];
                                return (
                                  <th key={st.id} className="py-2.5 px-3 text-center">
                                    <div className="flex flex-col items-center">
                                      <span className={`w-2 h-2 rounded-full ${col.bg} mb-0.5`} />
                                      <span className="truncate max-w-[90px]" title={st.name}>{st.name}</span>
                                    </div>
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {SUBJECT_LIST.map((subj) => {
                              // Find max score for this subject among selected students
                              const scores = selectedCompareStudents.map((s) => getSubjectFinalScore(s.grades[subj.key as keyof Student['grades']]));
                              const maxScore = Math.max(...scores);

                              return (
                                <tr key={subj.key} className="hover:bg-slate-50/60 transition-colors">
                                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                                    {subj.fullName} ({subj.label})
                                  </td>
                                  {selectedCompareStudents.map((st) => {
                                    const sc = getSubjectFinalScore(st.grades[subj.key as keyof Student['grades']]);
                                    const isHighest = sc === maxScore && selectedCompareStudents.length > 1;

                                    return (
                                      <td key={st.id} className="py-2.5 px-3 text-center font-semibold">
                                        <span
                                          className={`px-2 py-0.5 rounded-md ${
                                            isHighest
                                              ? 'bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300'
                                              : 'text-slate-700'
                                          }`}
                                        >
                                          {sc}
                                        </span>
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}

                            {/* Total Score Row */}
                            <tr className="bg-indigo-50/50 font-bold">
                              <td className="py-2.5 px-3 text-indigo-950 font-extrabold">Total Nilai Akumulasi</td>
                              {selectedCompareStudents.map((st) => (
                                <td key={st.id} className="py-2.5 px-3 text-center text-indigo-950 font-extrabold text-sm">
                                  {getStudentTotalAndAvg(st).total}
                                </td>
                              ))}
                            </tr>

                            {/* Rata-Rata Row */}
                            <tr className="bg-blue-50/50 font-bold">
                              <td className="py-2.5 px-3 text-blue-950 font-extrabold">Rata-Rata Nilai</td>
                              {selectedCompareStudents.map((st) => (
                                <td key={st.id} className="py-2.5 px-3 text-center text-blue-950 font-extrabold text-sm">
                                  {getStudentTotalAndAvg(st).avg}
                                </td>
                              ))}
                            </tr>

                            {/* Kehadiran Row */}
                            <tr className="bg-emerald-50/50 font-bold">
                              <td className="py-2.5 px-3 text-emerald-950 font-extrabold">Tingkat Kehadiran (%)</td>
                              {selectedCompareStudents.map((st) => (
                                <td key={st.id} className="py-2.5 px-3 text-center text-emerald-900 font-extrabold">
                                  {st.attendanceRate}%
                                </td>
                              ))}
                            </tr>

                            {/* Best Subject Row */}
                            <tr className="hover:bg-slate-50">
                              <td className="py-2 px-3 text-slate-500 text-[11px] font-medium">Mapel Unggulan</td>
                              {selectedCompareStudents.map((st) => (
                                <td key={st.id} className="py-2 px-3 text-center text-[11px] text-emerald-700 font-bold">
                                  {getStudentBestAndWeakestSubject(st).best}
                                </td>
                              ))}
                            </tr>

                            {/* Weakest Subject Row */}
                            <tr className="hover:bg-slate-50">
                              <td className="py-2 px-3 text-slate-500 text-[11px] font-medium">Butuh Pendampingan</td>
                              {selectedCompareStudents.map((st) => (
                                <td key={st.id} className="py-2 px-3 text-center text-[11px] text-amber-700 font-bold">
                                  {getStudentBestAndWeakestSubject(st).weakest}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Siswa yang dipilih disorot pada tabel utama data kelas.
              </span>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 shadow-xs cursor-pointer"
              >
                Selesai / Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


