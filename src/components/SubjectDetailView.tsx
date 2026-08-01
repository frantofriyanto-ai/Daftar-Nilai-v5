import React, { useState } from 'react';
import { Student, SubjectGradeBreakdown, getSubjectGradeBreakdown, getSubjectFinalScore } from '../types';
import { SUBJECT_INFO_MAP } from '../data/mockData';
import { Award, TrendingUp, AlertCircle, CheckCircle2, Edit2, Check, Percent, HelpCircle, Layers, X, Copy, SlidersHorizontal } from 'lucide-react';

interface SubjectDetailViewProps {
  subjectKey: keyof Student['grades'];
  students: Student[];
  onUpdateGrade: (studentId: string, subject: keyof Student['grades'], grade: SubjectGradeBreakdown | number) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subjectKey,
  students,
  onUpdateGrade
}) => {
  const info = Object.values(SUBJECT_INFO_MAP).find((s) => s.key === subjectKey) || {
    label: 'Mata Pelajaran',
    short: 'Subject',
    key: subjectKey
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SubjectGradeBreakdown | null>(null);

  // Bulk Edit State
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkForms, setBulkForms] = useState<Record<string, SubjectGradeBreakdown>>({});
  const [batchField, setBatchField] = useState<keyof SubjectGradeBreakdown>('tugas');
  const [batchValue, setBatchValue] = useState<number>(85);

  const total = students.length || 1;
  const finalScores = students.map((s) => getSubjectFinalScore(s.grades[subjectKey]));
  const avg = (finalScores.reduce((a, b) => a + b, 0) / total).toFixed(1);
  const highest = Math.max(...finalScores, 0);
  const lowest = Math.min(...finalScores, 100);
  const passedCount = finalScores.filter((s) => s >= 75).length;
  const passRate = Math.round((passedCount / total) * 100);

  const handleStartEdit = (s: Student) => {
    setEditingId(s.id);
    setEditForm({ ...getSubjectGradeBreakdown(s.grades[subjectKey], 80) });
  };

  const handleSaveEdit = (studentId: string) => {
    if (editForm) {
      onUpdateGrade(studentId, subjectKey, editForm);
    }
    setEditingId(null);
    setEditForm(null);
  };

  // Bulk Edit Handlers
  const handleToggleBulkMode = () => {
    if (!isBulkMode) {
      const initial: Record<string, SubjectGradeBreakdown> = {};
      students.forEach((s) => {
        initial[s.id] = { ...getSubjectGradeBreakdown(s.grades[subjectKey], 80) };
      });
      setBulkForms(initial);
      setSelectedIds(students.map((s) => s.id));
      setIsBulkMode(true);
      setEditingId(null);
    } else {
      setIsBulkMode(false);
      setSelectedIds([]);
      setBulkForms({});
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(students.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyBatchValue = () => {
    if (selectedIds.length === 0) return;
    setBulkForms((prev) => {
      const updated = { ...prev };
      selectedIds.forEach((id) => {
        if (updated[id]) {
          updated[id] = {
            ...updated[id],
            [batchField]: Number(batchValue) || 0
          };
        }
      });
      return updated;
    });
  };

  const handleSaveBulk = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => {
      if (bulkForms[id]) {
        onUpdateGrade(id, subjectKey, bulkForms[id]);
      }
    });
    setIsBulkMode(false);
    setSelectedIds([]);
    setBulkForms({});
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4C4B7C] to-[#5D5B8D] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 bg-white/10 px-2.5 py-1 rounded-full">
            Kurikulum Merdeka • Kelas 12-A
          </span>
          <h2 className="text-2xl font-bold tracking-tight mt-2">{info.label}</h2>
          <p className="text-xs text-indigo-100 mt-1">Bobot Penilaian: Tugas (20%) + TP1-5 (25%) + Formatif (20%) + Sumatif (30%) + Kehadiran (5%)</p>
        </div>

        <div className="flex gap-4 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl text-center border border-white/10">
            <p className="text-[10px] text-indigo-200 uppercase font-semibold">Rata-Rata Kelas</p>
            <p className="text-xl font-extrabold">{avg}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl text-center border border-white/10">
            <p className="text-[10px] text-indigo-200 uppercase font-semibold">Nilai Tertinggi</p>
            <p className="text-xl font-extrabold text-amber-300">{highest}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl text-center border border-white/10">
            <p className="text-[10px] text-indigo-200 uppercase font-semibold">Tuntas KKM</p>
            <p className="text-xl font-extrabold text-emerald-300">{passRate}%</p>
          </div>
        </div>
      </div>

      {/* Weighting Legend Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Percent className="w-4 h-4 text-indigo-600" />
          <span>Komponen & Persentase Bobot Nilai Akhir:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200/60">Tugas: 20%</span>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200/60">TP1–TP5 (Rata2): 25%</span>
          <span className="px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg border border-purple-200/60">Formatif: 20%</span>
          <span className="px-2.5 py-1 bg-rose-50 text-rose-800 rounded-lg border border-rose-200/60">Sumatif: 30%</span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200/60">Kehadiran Mapel: 5%</span>
        </div>
      </div>

      {/* Bulk Edit Quick Bar */}
      {isBulkMode && (
        <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-xl shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="text-sm font-bold text-indigo-950">Mode Pengeditan Massal (Bulk Edit)</h4>
                <p className="text-xs text-indigo-700">
                  {selectedIds.length} dari {students.length} siswa dipilih. Anda dapat mengisi nilai komponen sekaligus atau mengedit langsung pada tabel di bawah.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveBulk}
                disabled={selectedIds.length === 0}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Massal ({selectedIds.length})</span>
              </button>
              <button
                onClick={handleToggleBulkMode}
                className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Batal</span>
              </button>
            </div>
          </div>

          {/* Batch Field Fill Toolbar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-indigo-200/80 text-xs">
            <span className="font-bold text-indigo-900">Pengisian Cepat Komponen:</span>
            <select
              value={batchField}
              onChange={(e) => setBatchField(e.target.value as keyof SubjectGradeBreakdown)}
              className="p-1.5 bg-white border border-indigo-300 rounded-lg text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="tugas">Tugas (20%)</option>
              <option value="tp1">TP 1</option>
              <option value="tp2">TP 2</option>
              <option value="tp3">TP 3</option>
              <option value="tp4">TP 4</option>
              <option value="tp5">TP 5</option>
              <option value="formatif">Formatif (20%)</option>
              <option value="sumatif">Sumatif (30%)</option>
              <option value="kehadiran">Kehadiran (5%)</option>
            </select>

            <div className="flex items-center gap-1">
              <span className="text-slate-600 font-medium">Nilai:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={batchValue}
                onChange={(e) => setBatchValue(Number(e.target.value))}
                className="w-16 p-1.5 bg-white border border-indigo-300 rounded-lg text-center font-bold text-slate-900"
              />
            </div>

            <button
              onClick={handleApplyBatchValue}
              disabled={selectedIds.length === 0}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Terapkan ke {selectedIds.length} Siswa Terpilih</span>
            </button>
          </div>
        </div>
      )}

      {/* Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Rincian Nilai Komponen {info.label} ({students.length} Siswa)</span>
          </h3>

          <button
            onClick={handleToggleBulkMode}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              isBulkMode
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isBulkMode ? 'Keluar Bulk Edit' : 'Edit Massal (Bulk Edit)'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                {isBulkMode && (
                  <th className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === students.length && students.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      title="Pilih Semua Siswa"
                    />
                  </th>
                )}
                <th className="py-3 px-3">Siswa</th>
                <th className="py-3 px-2 text-center bg-blue-50/50 text-blue-900">Tugas (20%)</th>
                <th className="py-3 px-1 text-center">TP1</th>
                <th className="py-3 px-1 text-center">TP2</th>
                <th className="py-3 px-1 text-center">TP3</th>
                <th className="py-3 px-1 text-center">TP4</th>
                <th className="py-3 px-1 text-center">TP5</th>
                <th className="py-3 px-2 text-center bg-amber-50/50 text-amber-900">Rata TP (25%)</th>
                <th className="py-3 px-2 text-center bg-purple-50/50 text-purple-900">Formatif (20%)</th>
                <th className="py-3 px-2 text-center bg-rose-50/50 text-rose-900">Sumatif (30%)</th>
                <th className="py-3 px-2 text-center bg-emerald-50/50 text-emerald-900">Hadir (5%)</th>
                <th className="py-3 px-3 text-center bg-indigo-100/70 text-indigo-950 font-extrabold">NILAI AKHIR</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700">
              {students.map((s) => {
                const isSingleEditing = editingId === s.id;
                const isSelectedForBulk = isBulkMode && selectedIds.includes(s.id);
                const isRowEditable = isSingleEditing || (isBulkMode && isSelectedForBulk);

                const bd = isBulkMode
                  ? (bulkForms[s.id] || getSubjectGradeBreakdown(s.grades[subjectKey]))
                  : (isSingleEditing && editForm ? editForm : getSubjectGradeBreakdown(s.grades[subjectKey]));

                const tpAvg = Math.round((((bd.tp1 ?? 0) + (bd.tp2 ?? 0) + (bd.tp3 ?? 0) + (bd.tp4 ?? 0) + (bd.tp5 ?? 0)) / 5) * 10) / 10;
                const finalScore = getSubjectFinalScore(bd);
                const isPassed = finalScore >= 75;

                const updateFieldValue = (field: keyof SubjectGradeBreakdown, val: number) => {
                  if (isBulkMode) {
                    setBulkForms((prev) => ({
                      ...prev,
                      [s.id]: {
                        ...(prev[s.id] || getSubjectGradeBreakdown(s.grades[subjectKey])),
                        [field]: val
                      }
                    }));
                  } else if (editForm) {
                    setEditForm({ ...editForm, [field]: val });
                  }
                };

                return (
                  <tr key={s.id} className={`hover:bg-slate-50 transition-colors ${isRowEditable ? 'bg-amber-50/60' : ''}`}>
                    {isBulkMode && (
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.id)}
                          onChange={() => handleToggleSelectRow(s.id)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                    )}

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {s.avatarInitials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{s.name}</p>
                          <p className="text-[10px] text-slate-400">NIS: {s.nis}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tugas (20%) */}
                    <td className="py-2 px-1 text-center bg-blue-50/20">
                      {isRowEditable ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bd.tugas ?? 0}
                          onChange={(e) => updateFieldValue('tugas', Number(e.target.value))}
                          className="w-10 text-center p-1 bg-white border border-blue-400 rounded-md font-bold text-blue-900"
                        />
                      ) : (
                        <span className="font-medium text-slate-800">{bd.tugas}</span>
                      )}
                    </td>

                    {/* TP1 */}
                    <td className="py-2 px-1 text-center">
                      {isRowEditable ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bd.tp1 ?? 0}
                          onChange={(e) => updateFieldValue('tp1', Number(e.target.value))}
                          className="w-10 text-center p-1 bg-white border border-slate-300 rounded-md"
                        />
                      ) : (
                        <span>{bd.tp1}</span>
                      )}
                    </td>

                    {/* TP2 */}
                    <td className="py-2 px-1 text-center">
                      {isRowEditable ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bd.tp2 ?? 0}
                          onChange={(e) => updateFieldValue('tp2', Number(e.target.value))}
                          className="w-10 text-center p-1 bg-white border border-slate-300 rounded-md"
                        />
                      ) : (
                        <span>{bd.tp2}</span>
                      )}
                    </td>

                    {/* TP3 */}
                    <td className="py-2 px-1 text-center">
                      {isRowEditable ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bd.tp3 ?? 0}
                          onChange={(e) => updateFieldValue('tp3', Number(e.target.value))}
                          className="w-10 text-center p-1 bg-white border border-slate-300 rounded-md"
                        />
                      ) : (
                        <span>{bd.tp3}</span>
                      )}
                    </td>

                    {/* TP4 */}
                    <td className="py-2 px-1 text-center">
                      {isRowEditable ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bd.tp4 ?? 0}
                          onChange={(e) => updateFieldValue('tp4', Number(e.target.value))}
                          className="w-10 text-center p-1 bg-white border border-slate-300 rounded-md"
                        />
                      ) : (
                        <span>{bd.tp4}</span>
                      )}
                    </td>

                    {/* TP5 */}
                    <td className="py-2 px-1 text-center">
                      {isRowEditable ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bd.tp5 ?? 0}
                          onChange={(e) => updateFieldValue('tp5', Number(e.target.value))}
                          className="w-10 text-center p-1 bg-white border border-slate-300 rounded-md"
                        />
                      ) : (
                        <span>{bd.tp5}</span>
                      )}
                    </td>

                    {/* Rata TP (25%) */}
                    <td className="py-2 px-1 text-center bg-amber-50/30 font-semibold text-amber-900">
                      {tpAvg}
                    </td>

                    {/* Formatif (20%) */}
                    <td className="py-2 px-1 text-center bg-purple-50/20">
                      {isRowEditable ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bd.formatif ?? 0}
                          onChange={(e) => updateFieldValue('formatif', Number(e.target.value))}
                          className="w-10 text-center p-1 bg-white border border-purple-400 rounded-md font-bold text-purple-900"
                        />
                      ) : (
                        <span className="font-medium text-slate-800">{bd.formatif}</span>
                      )}
                    </td>

                    {/* Sumatif (30%) */}
                    <td className="py-2 px-1 text-center bg-rose-50/20">
                      {isRowEditable ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bd.sumatif ?? 0}
                          onChange={(e) => updateFieldValue('sumatif', Number(e.target.value))}
                          className="w-10 text-center p-1 bg-white border border-rose-400 rounded-md font-bold text-rose-900"
                        />
                      ) : (
                        <span className="font-medium text-slate-800">{bd.sumatif}</span>
                      )}
                    </td>

                    {/* Kehadiran (5%) */}
                    <td className="py-2 px-1 text-center bg-emerald-50/20">
                      {isRowEditable ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bd.kehadiran ?? 0}
                          onChange={(e) => updateFieldValue('kehadiran', Number(e.target.value))}
                          className="w-10 text-center p-1 bg-white border border-emerald-400 rounded-md font-bold text-emerald-900"
                        />
                      ) : (
                        <span className="font-medium text-emerald-800">{bd.kehadiran}%</span>
                      )}
                    </td>

                    {/* Nilai Akhir */}
                    <td className="py-2 px-3 text-center bg-indigo-50/80 font-extrabold text-indigo-950 text-sm">
                      <span className={`px-2 py-1 rounded-md border ${isPassed ? 'bg-indigo-100 border-indigo-200 text-indigo-900' : 'bg-rose-100 border-rose-200 text-rose-900'}`}>
                        {finalScore}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-2 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {isPassed ? 'Tuntas' : 'Remedial'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-2 px-3 text-center">
                      {isSingleEditing ? (
                        <button
                          onClick={() => handleSaveEdit(s.id)}
                          className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1 mx-auto cursor-pointer"
                          title="Simpan Nilai Komponen"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">Simpan</span>
                        </button>
                      ) : !isBulkMode ? (
                        <button
                          onClick={() => handleStartEdit(s)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                          title="Edit Rincian Nilai Komponen"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] font-semibold text-indigo-600">Bulk Active</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


