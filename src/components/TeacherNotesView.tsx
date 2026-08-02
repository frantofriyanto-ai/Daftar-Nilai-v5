import React, { useState } from 'react';
import { Student } from '../types';
import { FileText, Save, Check, User } from 'lucide-react';

interface TeacherNotesViewProps {
  students: Student[];
  onUpdateNotes: (studentId: string, notes: string) => void;
  teacherName?: string;
  activeClass?: string;
}

export const TeacherNotesView: React.FC<TeacherNotesViewProps> = ({
  students,
  onUpdateNotes,
  teacherName = 'Budi Santoso, M.Pd',
  activeClass = 'Kelas 12-A'
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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Catatan Guru {activeClass}</h2>
        <p className="text-xs text-slate-500 mt-0.5">Kelola catatan perkembangan akademik, karakter, dan bimbingan konseling untuk siswa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Selector List */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col max-h-[500px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daftar Siswa ({students.length})
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {students.map((s) => {
              const isSelected = s.id === selectedStudentId;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectStudent(s.id)}
                  className={`w-full p-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {s.avatarInitials}
                    </div>
                    <div className="truncate">
                      <p className={`text-xs font-semibold truncate ${isSelected ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>
                        {s.name}
                      </p>
                      <p className="text-[10px] text-slate-400">NIS: {s.nis}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note Editor */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          {selectedStudent ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {selectedStudent.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                    <p className="text-xs text-slate-500">NIS: {selectedStudent.nis} • {activeClass}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md">
                    Kehadiran: {selectedStudent.attendanceRate}%
                  </span>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Catatan Guru / Pembimbing ({teacherName}):
                </label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  rows={8}
                  placeholder="Tuliskan catatan perkembangan akademik, minat, bakat, atau rekomendasi pembelajaran untuk siswa ini..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">Terakhir diperbarui: {selectedStudent.updatedAt}</span>

                <button
                  onClick={handleSaveNotes}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
                >
                  {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                  <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Catatan'}</span>
                </button>
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
