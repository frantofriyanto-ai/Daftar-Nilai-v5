import React, { useState } from 'react';
import { Student, getSubjectFinalScore, getKKMStatus } from '../types';
import { FileText, Save, Check, User, MessageCircle, ShieldCheck } from 'lucide-react';

interface TeacherNotesViewProps {
  students: Student[];
  onUpdateNotes: (studentId: string, notes: string) => void;
  onOpenWhatsAppModal?: (student: Student) => void;
  teacherName?: string;
  activeClass?: string;
  kkm?: number;
}

export const TeacherNotesView: React.FC<TeacherNotesViewProps> = ({
  students,
  onUpdateNotes,
  onOpenWhatsAppModal,
  teacherName = 'Budi Santoso, M.Pd',
  activeClass = 'Kelas 12-A',
  kkm = 75
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const [notesInput, setNotesInput] = useState(selectedStudent?.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    const target = students.find((s) => s.id === id);
    setNotesInput(target?.notes || '');
    setSavedSuccess(false);
  };

  const handleSaveNotes = () => {
    if (selectedStudent) {
      onUpdateNotes(selectedStudent.id, notesInput);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const scores = selectedStudent 
    ? Object.values(selectedStudent.grades).map((g) => getSubjectFinalScore(g as any))
    : [];
  const avgScore = scores.length 
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : '0';
  const kkmStatus = getKKMStatus(Number(avgScore), kkm);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Catatan Bimbingan Wali Kelas ({activeClass})</h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola catatan perkembangan akademik, karakter, bimbingan konseling, dan kirimkan langsung via WhatsApp ke Orang Tua / Wali Siswa.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <div className="text-xs">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Standar KKM Sekolah</span>
            <span className="font-bold text-slate-800">{kkm} Nilai Minimal Tuntas</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Selector List */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col max-h-[540px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Daftar Siswa ({students.length})</span>
            <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded">KKM: {kkm}</span>
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {students.map((s) => {
              const isSelected = s.id === selectedStudentId;
              const sScores = Object.values(s.grades).map((g) => getSubjectFinalScore(g as any));
              const sAvg = (sScores.reduce((a, b) => a + b, 0) / sScores.length).toFixed(1);
              const sKkm = getKKMStatus(Number(sAvg), kkm);

              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectStudent(s.id)}
                  className={`w-full p-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {s.avatarInitials}
                    </div>
                    <div className="truncate">
                      <p className={`text-xs font-semibold truncate ${isSelected ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>
                        {s.name}
                      </p>
                      <p className="text-[10px] text-slate-400">Rata-Rata: <strong className="text-slate-700">{sAvg}</strong></p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${sKkm.badgeClass}`}>
                    {sKkm.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note Editor */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          {selectedStudent ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {selectedStudent.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${kkmStatus.badgeClass}`}>
                        {kkmStatus.label.toUpperCase()} (Rata2 {avgScore})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">NIS: {selectedStudent.nis} • {activeClass}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenWhatsAppModal && (
                    <button
                      onClick={() => onOpenWhatsAppModal(selectedStudent)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
                      title="Kirim Catatan Bimbingan via WhatsApp ke Orang Tua"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Kirim WA Orang Tua</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <label className="block text-xs font-bold text-slate-700">
                  Catatan Bimbingan Wali Kelas ({teacherName}):
                </label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  rows={8}
                  placeholder="Tuliskan catatan perkembangan akademik, disiplin, motivasi belajar, atau hasil konseling siswa ini..."
                  className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">Terakhir diperbarui: {selectedStudent.updatedAt}</span>

                <div className="flex items-center gap-2">
                  {onOpenWhatsAppModal && (
                    <button
                      onClick={() => onOpenWhatsAppModal(selectedStudent)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Draf Pesan WA</span>
                    </button>
                  )}

                  <button
                    onClick={handleSaveNotes}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4 text-white" />}
                    <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Catatan'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">Pilih siswa dari daftar di samping untuk menulis catatan.</div>
          )}
        </div>
      </div>
    </div>
  );
};
