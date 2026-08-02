import React, { useState } from 'react';
import { X, UserPlus, Award, Check } from 'lucide-react';
import { Student, SubjectGradeBreakdown, getSubjectFinalScore } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onAddStudent: (newStudent: Student) => void;
  onUpdateGrade: (studentId: string, subject: keyof Student['grades'], score: SubjectGradeBreakdown | number) => void;
  activeClass?: string;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  students,
  onAddStudent,
  onUpdateGrade,
  activeClass = 'Kelas 12-A'
}) => {
  const [mode, setMode] = useState<'updateGrade' | 'newStudent'>('updateGrade');

  // Form state for Grade Update
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedSubject, setSelectedSubject] = useState<keyof Student['grades']>('math');
  const [scoreInput, setScoreInput] = useState<number>(85);

  // Form state for New Student
  const [nameInput, setNameInput] = useState('');
  const [nisInput, setNisInput] = useState('');
  const [genderInput, setGenderInput] = useState<'L' | 'P'>('L');
  const [mathScore, setMathScore] = useState<number>(82);
  const [indoScore, setIndoScore] = useState<number>(85);
  const [englishScore, setEnglishScore] = useState<number>(84);
  const [scienceScore, setScienceScore] = useState<number>(80);
  const [pancasilaScore, setPancasilaScore] = useState<number>(88);
  const [artsScore, setArtsScore] = useState<number>(84);
  const [sundaneseScore, setSundaneseScore] = useState<number>(82);
  const [cocurrScore, setCocurrScore] = useState<number>(86);
  const [attendanceScore, setAttendanceScore] = useState<number>(95);

  if (!isOpen) return null;

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    onUpdateGrade(selectedStudentId, selectedSubject, Number(scoreInput));
    onClose();
  };

  const handleNewStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const initials = nameInput
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newStudent: Student = {
      id: `s_${Date.now()}`,
      nis: nisInput.trim() || `2024120${students.length + 1}`,
      name: nameInput.trim(),
      avatarInitials: initials || 'SS',
      gender: genderInput,
      attendanceRate: Number(attendanceScore),
      grades: {
        math: Number(mathScore),
        indonesian: Number(indoScore),
        english: Number(englishScore),
        science: Number(scienceScore),
        pancasila: Number(pancasilaScore),
        arts: Number(artsScore),
        sundanese: Number(sundaneseScore),
        cocurricular: Number(cocurrScore)
      },
      notes: `Siswa baru ditambahkan ke ${activeClass}.`,
      updatedAt: 'Baru saja'
    };

    onAddStudent(newStudent);
    setNameInput('');
    setNisInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#4C4B7C] text-white flex items-center justify-between shrink-0">
          <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300 shrink-0" />
            <span>Tambah Data / Nilai Siswa</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2 text-xs font-semibold shrink-0">
          <button
            onClick={() => setMode('updateGrade')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'updateGrade'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Input / Edit Nilai
          </button>
          <button
            onClick={() => setMode('newStudent')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'newStudent'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tambah Siswa Baru
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {mode === 'updateGrade' ? (
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Siswa ({activeClass}):</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.nis}) - Nilai Math: {getSubjectFinalScore(s.grades.math)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as keyof Student['grades'])}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="math">Matematika</option>
                  <option value="indonesian">Bahasa Indonesia</option>
                  <option value="english">Bahasa Inggris</option>
                  <option value="science">IPAS (Sains)</option>
                  <option value="pancasila">Pendidikan Pancasila</option>
                  <option value="arts">Seni Budaya</option>
                  <option value="sundanese">Bahasa Sunda</option>
                  <option value="cocurricular">Kokurikuler</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nilai Baru (0-100):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-900"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Nilai</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleNewStudentSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Siswa:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ahmad Subagyo"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIS:</label>
                  <input
                    type="text"
                    placeholder="202412037"
                    value={nisInput}
                    onChange={(e) => setNisInput(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin:</label>
                  <select
                    value={genderInput}
                    onChange={(e) => setGenderInput(e.target.value as 'L' | 'P')}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kehadiran (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={attendanceScore}
                    onChange={(e) => setAttendanceScore(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nilai Awal (Matematika & Mapel Lain):</label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold">MTK</span>
                    <input
                      type="number"
                      value={mathScore}
                      onChange={(e) => setMathScore(Number(e.target.value))}
                      className="w-full text-xs p-1.5 bg-slate-50 border border-slate-300 rounded-md"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold">BINDO</span>
                    <input
                      type="number"
                      value={indoScore}
                      onChange={(e) => setIndoScore(Number(e.target.value))}
                      className="w-full text-xs p-1.5 bg-slate-50 border border-slate-300 rounded-md"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold">BING</span>
                    <input
                      type="number"
                      value={englishScore}
                      onChange={(e) => setEnglishScore(Number(e.target.value))}
                      className="w-full text-xs p-1.5 bg-slate-50 border border-slate-300 rounded-md"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold">IPAS</span>
                    <input
                      type="number"
                      value={scienceScore}
                      onChange={(e) => setScienceScore(Number(e.target.value))}
                      className="w-full text-xs p-1.5 bg-slate-50 border border-slate-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambah Siswa</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
