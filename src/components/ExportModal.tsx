import React, { useState } from 'react';
import { X, Printer, Download, FileSpreadsheet, FileCheck, Eye, ArrowLeft, CheckCircle2, Upload, Trash2, Building2, School, SlidersHorizontal, Check } from 'lucide-react';
import { Student, getSubjectFinalScore } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  singleStudent?: Student;
  teacherName?: string;
  activeClass?: string;
  academicPeriod?: string;
}

const SUBJECTS_DETAIL = [
  { key: 'math', label: 'Matematika', kkm: 75 },
  { key: 'indonesian', label: 'Bahasa Indonesia', kkm: 75 },
  { key: 'english', label: 'Bahasa Inggris', kkm: 75 },
  { key: 'science', label: 'IPAS (Ilmu Pengetahuan Alam & Sosial)', kkm: 75 },
  { key: 'pancasila', label: 'Pendidikan Pancasila (PPKn)', kkm: 75 },
  { key: 'arts', label: 'Seni Budaya', kkm: 75 },
  { key: 'sundanese', label: 'Bahasa Daerah (Bahasa Sunda)', kkm: 75 },
  { key: 'cocurricular', label: 'Kokurikuler (Projek P5)', kkm: 75 },
];

function getGradePredicate(score: number): { predicate: string; desc: string } {
  if (score >= 90) return { predicate: 'A', desc: 'Sangat Baik. Menunjukkan penguasaan kompetensi yang sangat optimal.' };
  if (score >= 80) return { predicate: 'B', desc: 'Baik. Menunjukkan penguasaan kompetensi yang baik.' };
  if (score >= 75) return { predicate: 'C', desc: 'Cukup. Memenuhi Kriteria Ketuntasan Minimal (KKM).' };
  return { predicate: 'D', desc: 'Perlu Bimbingan. Perlu intervensi khusus pada materi utama.' };
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  students,
  singleStudent,
  teacherName = 'Budi Santoso, M.Pd',
  activeClass = 'Kelas 12-A',
  academicPeriod = 'Semester 1 (2025/2026)',
}) => {
  const [viewMode, setViewMode] = useState<'options' | 'preview'>('options');

  // Formal Kop Surat & Document Header options persisted in localStorage
  const [showFormalHeader, setShowFormalHeader] = useState<boolean>(() => {
    const val = localStorage.getItem('antigravity_show_formal_header');
    return val !== null ? val === 'true' : true;
  });

  const [districtName, setDistrictName] = useState<string>(() => {
    return localStorage.getItem('antigravity_district_name') || 'PEMERINTAH KABUPATEN BANDUNG BARAT / DINAS PENDIDIKAN';
  });

  const [schoolName, setSchoolName] = useState<string>(() => {
    return localStorage.getItem('antigravity_school_name') || 'SD NEGERI GUDANG KAHURIPAN';
  });

  const [schoolAddress, setSchoolAddress] = useState<string>(() => {
    return localStorage.getItem('antigravity_school_address') || 'Jl. Raya Lembang No. 14 • Desa Gudangkahuripan Kec. Lembang • Email: sdngudangkahuripan@gmail.com';
  });

  const [periodText, setPeriodText] = useState<string>(() => {
    return localStorage.getItem('antigravity_period_text') || academicPeriod;
  });

  const [headmasterName, setHeadmasterName] = useState<string>(() => {
    return localStorage.getItem('antigravity_headmaster_name') || 'Iman Kosdiana, M.Pd.';
  });

  const [headmasterNip, setHeadmasterNip] = useState<string>(() => {
    return localStorage.getItem('antigravity_headmaster_nip') || 'NIP. 19720113 199603 1 001';
  });

  const [teacherNip, setTeacherNip] = useState<string>(() => {
    return localStorage.getItem('antigravity_teacher_nip') || 'NIP. 19820412 200801 1 009';
  });

  // Logo state persisted in localStorage
  const [logoDinas, setLogoDinas] = useState<string | null>(() => {
    return localStorage.getItem('antigravity_logo_dinas') || null;
  });

  const [logoSekolah, setLogoSekolah] = useState<string | null>(() => {
    return localStorage.getItem('antigravity_logo_sekolah') || null;
  });

  const handleUpdateSetting = (key: string, value: string | boolean, setter: (v: any) => void) => {
    setter(value);
    localStorage.setItem(`antigravity_${key}`, String(value));
  };

  const handleUploadLogoDinas = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setLogoDinas(result);
        localStorage.setItem('antigravity_logo_dinas', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogoDinas = () => {
    setLogoDinas(null);
    localStorage.removeItem('antigravity_logo_dinas');
  };

  const handleUploadLogoSekolah = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setLogoSekolah(result);
        localStorage.setItem('antigravity_logo_sekolah', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogoSekolah = () => {
    setLogoSekolah(null);
    localStorage.removeItem('antigravity_logo_sekolah');
  };

  if (!isOpen) return null;

  const exportData = singleStudent ? [singleStudent] : students;
  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleDownloadCSV = () => {
    const headers = ["NIS", "Nama Siswa", "JK", "Kehadiran (%)", "Matematika", "B. Indonesia", "B. Inggris", "IPAS", "PPKn", "Seni Budaya", "B. Sunda", "Kokurikuler", "Jumlah Nilai", "Rata-Rata", "Catatan Guru"];
    const rows = exportData.map(s => {
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
      const avg = (total / 8).toFixed(1);
      return [
        s.nis,
        `"${s.name}"`,
        s.gender,
        s.attendanceRate,
        m,
        i,
        e,
        sc,
        p,
        a,
        su,
        c,
        total,
        avg,
        `"${s.notes || ''}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Nilai_${activeClass.replace(/\s+/g, '_')}_${singleStudent ? singleStudent.name.replace(/\s+/g, '_') : 'Seluruh_Siswa'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTriggerPrint = () => {
    if (viewMode !== 'preview') {
      setViewMode('preview');
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  const renderKopSurat = () => {
    if (!showFormalHeader) return null;
    return (
      <div className="border-b-4 border-double border-slate-900 pb-3 mb-5 flex items-center justify-between text-center gap-4">
        {/* Logo Dinas (Left) */}
        <div className="w-20 h-20 shrink-0 flex items-center justify-center">
          {logoDinas ? (
            <img src={logoDinas} alt="Logo Dinas" className="max-h-20 max-w-20 object-contain" />
          ) : (
            <div className="w-16 h-16 rounded-lg border border-dashed border-slate-400 bg-slate-50 flex flex-col items-center justify-center p-1 text-slate-500">
              <Building2 className="w-6 h-6 text-slate-500" />
              <span className="text-[8px] font-bold text-slate-600 text-center uppercase tracking-tighter mt-0.5">Logo Pemkab</span>
            </div>
          )}
        </div>

        {/* Kop Text (Center) */}
        <div className="flex-1 text-center px-2">
          <p className="text-xs font-bold tracking-widest text-slate-800 uppercase">{districtName}</p>
          <h2 className="text-xl font-extrabold text-slate-950 uppercase tracking-tight mt-0.5">{schoolName}</h2>
          <p className="text-[11px] text-slate-700 mt-1 font-medium leading-tight">
            {schoolAddress}
          </p>
        </div>

        {/* Logo Sekolah (Right) */}
        <div className="w-20 h-20 shrink-0 flex items-center justify-center">
          {logoSekolah ? (
            <img src={logoSekolah} alt="Logo Sekolah" className="max-h-20 max-w-20 object-contain" />
          ) : (
            <div className="w-16 h-16 rounded-lg border border-dashed border-slate-400 bg-slate-50 flex flex-col items-center justify-center p-1 text-slate-500">
              <School className="w-6 h-6 text-slate-500" />
              <span className="text-[8px] font-bold text-slate-600 text-center uppercase tracking-tighter mt-0.5">Logo Sekolah</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto modal-backdrop-overlay">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Navigation Bar (Hidden during print) */}
        <div className="px-6 py-4 bg-[#4C4B7C] text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {singleStudent ? `Cetak Rapor Siswa: ${singleStudent.name}` : `Cetak Rekap Laporan Nilai ${activeClass}`}
              </h3>
              <p className="text-xs text-indigo-200 mt-0.5">
                {activeClass} • {periodText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'preview' ? (
              <button
                onClick={() => setViewMode('options')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Opsi</span>
              </button>
            ) : (
              <button
                onClick={() => setViewMode('preview')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5 text-white transition-colors cursor-pointer shadow-xs"
              >
                <Eye className="w-4 h-4" />
                <span>Pratinjau Rapor</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
          {viewMode === 'options' ? (
            /* Options Mode View */
            <div className="space-y-6 no-print max-w-3xl mx-auto">
              {/* Document Info Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-800">Detail Laporan yang Akan Dicetak</h4>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
                    {singleStudent ? 'Rapor Perorangan' : 'Rekap Kelas'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Kelas / Rombel</span>
                    <span className="font-bold text-slate-800">{activeClass}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Tahun Ajaran / Periode</span>
                    <span className="font-bold text-slate-800">{periodText}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Jumlah Dokumen / Siswa</span>
                    <span className="font-bold text-indigo-600">{exportData.length} Siswa</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Wali Kelas</span>
                    <span className="font-bold text-slate-800">{teacherName}</span>
                  </div>
                </div>
              </div>

              {/* Logo Kop Surat Configuration Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Upload Logo Kop Surat (Cetak PDF)</h4>
                      <p className="text-xs text-slate-500">Logo akan tampil di sisi kiri (Dinas) dan kanan (Sekolah) pada Kop Surat PDF</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Logo Dinas (Kiri) */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center text-center space-y-3">
                    <span className="text-xs font-bold text-slate-700">Logo Dinas / Pemkab (Sisi Kiri)</span>
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center p-2 relative overflow-hidden shadow-2xs">
                      {logoDinas ? (
                        <img src={logoDinas} alt="Logo Dinas" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="text-center p-2">
                          <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                          <span className="text-[10px] text-slate-400 font-semibold block">Belum Ada Logo</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <label className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer text-center transition-colors flex items-center justify-center gap-1.5 shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{logoDinas ? 'Ganti Logo' : 'Upload Logo'}</span>
                        <input type="file" accept="image/*" onChange={handleUploadLogoDinas} className="hidden" />
                      </label>
                      {logoDinas && (
                        <button
                          onClick={handleRemoveLogoDinas}
                          className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Logo Dinas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Logo Sekolah (Kanan) */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center text-center space-y-3">
                    <span className="text-xs font-bold text-slate-700">Logo Sekolah / Tut Wuri (Sisi Kanan)</span>
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center p-2 relative overflow-hidden shadow-2xs">
                      {logoSekolah ? (
                        <img src={logoSekolah} alt="Logo Sekolah" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="text-center p-2">
                          <School className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                          <span className="text-[10px] text-slate-400 font-semibold block">Belum Ada Logo</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <label className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer text-center transition-colors flex items-center justify-center gap-1.5 shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{logoSekolah ? 'Ganti Logo' : 'Upload Logo'}</span>
                        <input type="file" accept="image/*" onChange={handleUploadLogoSekolah} className="hidden" />
                      </label>
                      {logoSekolah && (
                        <button
                          onClick={handleRemoveLogoSekolah}
                          className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Logo Sekolah"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Formal Header & Signature Settings Panel */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Pengaturan Header Resmi & Tanda Tangan</h4>
                      <p className="text-xs text-slate-500">Sesuaikan identitas sekolah, periode akademik, dan data NIP pejabat untuk cetak PDF</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={showFormalHeader}
                      onChange={(e) => handleUpdateSetting('show_formal_header', e.target.checked, setShowFormalHeader)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Tampilkan Kop Surat Resmi</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Instansi / Dinas (Kop Atas)</label>
                    <input
                      type="text"
                      value={districtName}
                      onChange={(e) => handleUpdateSetting('district_name', e.target.value, setDistrictName)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Sekolah / Satuan Pendidikan</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => handleUpdateSetting('school_name', e.target.value, setSchoolName)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-extrabold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Alamat Sekolah & Kontak (Kop Bawah)</label>
                    <input
                      type="text"
                      value={schoolAddress}
                      onChange={(e) => handleUpdateSetting('school_address', e.target.value, setSchoolAddress)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Periode Akademik / Semester</label>
                    <input
                      type="text"
                      value={periodText}
                      onChange={(e) => handleUpdateSetting('period_text', e.target.value, setPeriodText)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NIP Wali Kelas ({teacherName})</label>
                    <input
                      type="text"
                      value={teacherNip}
                      onChange={(e) => handleUpdateSetting('teacher_nip', e.target.value, setTeacherNip)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                    <input
                      type="text"
                      value={headmasterName}
                      onChange={(e) => handleUpdateSetting('headmaster_name', e.target.value, setHeadmasterName)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                    <input
                      type="text"
                      value={headmasterNip}
                      onChange={(e) => handleUpdateSetting('headmaster_nip', e.target.value, setHeadmasterNip)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleTriggerPrint}
                  className="p-5 rounded-xl border-2 border-blue-300 bg-blue-50/70 hover:bg-blue-100/80 flex flex-col items-center justify-center text-center gap-3 transition-all group cursor-pointer shadow-xs hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                    <Printer className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-blue-950">Cetak Rapor / Simpan PDF</p>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                      Format Cetak Resmi Sekolah (Dilengkapi Kop Surat & Kolom Tanda Tangan)
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg mt-1">
                    Proses Cetak / PDF →
                  </span>
                </button>

                <button
                  onClick={handleDownloadCSV}
                  className="p-5 rounded-xl border-2 border-teal-300 bg-teal-50/70 hover:bg-teal-100/80 flex flex-col items-center justify-center text-center gap-3 transition-all group cursor-pointer shadow-xs hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-teal-950">Unduh Format CSV / Excel</p>
                    <p className="text-xs text-teal-700 mt-1 leading-relaxed">
                      File spreadsheet mentah untuk pengolahan data di Google Sheets / Excel
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-teal-700 text-white text-[11px] font-bold rounded-lg mt-1">
                    Unduh File .CSV →
                  </span>
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Petunjuk Menyimpan PDF di Browser:</p>
                  <p className="mt-0.5 text-amber-800">
                    Saat jendela cetak terbuka, ubah Tujuan / Printer menjadi <span className="font-bold underline">"Save as PDF" (Simpan sebagai PDF)</span> lalu klik Simpan.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Printable Document Section (Visible always when printing, or in preview mode on screen) */}
          <div className={`${viewMode === 'preview' ? 'block' : 'hidden'} print:block`}>
            {/* Control Bar in Preview Mode */}
            <div className="no-print mb-4 p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Pratinjau Halaman Cetak (A4)</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                  {exportData.length} Halaman
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('options')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Sekarang / PDF</span>
                </button>
              </div>
            </div>

            {/* DOCUMENT CONTENT */}
            <div className="space-y-8">
              {singleStudent ? (
                /* SINGLE STUDENT REPORT CARD */
                <div className="printable-document bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-3xl mx-auto font-sans text-slate-900 leading-normal">
                  {/* Kop Surat Sekolah */}
                  {renderKopSurat()}

                  {/* Title */}
                  <div className="text-center mb-6">
                    <h3 className="text-base font-extrabold uppercase text-slate-900 tracking-wider underline">
                      LAPORAN HASIL BELAJAR & CAPAIAN INDIVIDU SISWA
                    </h3>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      (Rekap Laporan Untuk Orang Tua / Wali Siswa)
                    </p>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{periodText}</p>
                  </div>

                  {/* Student Identity Grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-500 font-medium inline-block w-28">Nama Siswa</span>
                      <span className="font-extrabold text-slate-900">: {singleStudent.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium inline-block w-28">Kelas / Rombel</span>
                      <span className="font-bold text-slate-900">: {activeClass}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium inline-block w-28">NIS / NISN</span>
                      <span className="font-bold text-slate-900">: {singleStudent.nis}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium inline-block w-28">Jenis Kelamin</span>
                      <span className="font-bold text-slate-900">: {singleStudent.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium inline-block w-28">Presensi Kehadiran</span>
                      <span className="font-bold text-emerald-700">: {singleStudent.attendanceRate}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium inline-block w-28">Wali Kelas</span>
                      <span className="font-bold text-slate-900">: {teacherName}</span>
                    </div>
                  </div>

                  {/* Subject Grades Table */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">A. Capaian Nilai Akademik</h4>
                    <table className="w-full text-xs border-collapse border border-slate-900">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900">
                          <th className="border border-slate-900 p-2 text-center w-8">No</th>
                          <th className="border border-slate-900 p-2 text-left">Mata Pelajaran</th>
                          <th className="border border-slate-900 p-2 text-center w-12">KKM</th>
                          <th className="border border-slate-900 p-2 text-center w-14">Nilai</th>
                          <th className="border border-slate-900 p-2 text-center w-16">Predikat</th>
                          <th className="border border-slate-900 p-2 text-left">Capaian Kompetensi / Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SUBJECTS_DETAIL.map((subj, index) => {
                          const breakdown = singleStudent.grades[subj.key as keyof Student['grades']];
                          const score = getSubjectFinalScore(breakdown);
                          const pred = getGradePredicate(score);

                          return (
                            <tr key={subj.key} className="border-b border-slate-300">
                              <td className="border border-slate-900 p-2 text-center font-medium">{index + 1}</td>
                              <td className="border border-slate-900 p-2 font-bold text-slate-900">{subj.label}</td>
                              <td className="border border-slate-900 p-2 text-center font-medium">{subj.kkm}</td>
                              <td className={`border border-slate-900 p-2 text-center font-extrabold ${score < 75 ? 'text-red-700 bg-red-50' : ''}`}>
                                {score}
                              </td>
                              <td className="border border-slate-900 p-2 text-center font-bold">{pred.predicate}</td>
                              <td className="border border-slate-900 p-2 text-[11px] text-slate-700">{pred.desc}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Box */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                    <div className="border border-slate-900 p-3 rounded-md bg-slate-50">
                      <p className="font-bold text-slate-900 mb-1">Akumulasi Nilai:</p>
                      {(() => {
                        const g = singleStudent.grades;
                        const total = Math.round((
                          getSubjectFinalScore(g.math) +
                          getSubjectFinalScore(g.indonesian) +
                          getSubjectFinalScore(g.english) +
                          getSubjectFinalScore(g.science) +
                          getSubjectFinalScore(g.pancasila) +
                          getSubjectFinalScore(g.arts) +
                          getSubjectFinalScore(g.sundanese) +
                          getSubjectFinalScore(g.cocurricular)
                        ) * 10) / 10;
                        const avg = (total / 8).toFixed(1);
                        return (
                          <div className="space-y-0.5 text-slate-800 font-semibold">
                            <p>Total Nilai: <span className="font-extrabold">{total}</span> Poin</p>
                            <p>Rata-Rata Nilai: <span className="font-extrabold text-indigo-700">{avg}</span> / 100</p>
                            <p>Status Ketuntasan: <span className="font-bold text-emerald-700">{Number(avg) >= 75 ? 'TUNTAS' : 'PERLU BIKBINGAN'}</span></p>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="border border-slate-900 p-3 rounded-md bg-slate-50">
                      <p className="font-bold text-slate-900 mb-1">Catatan Wali Kelas:</p>
                      <p className="italic text-slate-700 text-[11px] leading-relaxed">
                        "{singleStudent.notes || 'Pertahankan prestasi belajar, selalu aktif dalam kegiatan intrakulikuler maupun kokurikuler sekolah.'}"
                      </p>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="mt-12 pt-4 border-t border-slate-300 grid grid-cols-3 text-center text-xs text-slate-900 gap-4">
                    <div>
                      <p className="mb-14 font-semibold text-slate-800">Orang Tua / Wali Siswa</p>
                      <p className="font-bold border-b border-slate-900 inline-block px-8">( .................................... )</p>
                    </div>

                    <div>
                      <p className="mb-14 font-semibold text-slate-800">Wali Kelas</p>
                      <p className="font-bold underline text-slate-950">{teacherName}</p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">{teacherNip}</p>
                    </div>

                    <div>
                      <p className="text-[11px] text-slate-600 mb-1">Lembang, {currentDateStr}</p>
                      <p className="mb-12 font-semibold text-slate-800">Kepala Sekolah</p>
                      <p className="font-bold underline text-slate-950">{headmasterName}</p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">{headmasterNip}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* FULL CLASS REKAP REPORT CARD */
                <div className="printable-document bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-5xl mx-auto font-sans text-slate-900 leading-normal">
                  {/* Kop Surat */}
                  {renderKopSurat()}

                  {/* Header Title & Details */}
                  <div className="flex items-center justify-between mb-4 border-b border-slate-300 pb-3 text-xs">
                    <div>
                      <h3 className="text-sm font-extrabold uppercase text-slate-900 tracking-wider">
                        REKAPITULASI LAPORAN HASIL BELAJAR AKADEMIK KELAS
                      </h3>
                      <p className="text-slate-600 font-medium">Kelas: <span className="font-bold text-slate-900">{activeClass}</span> • {periodText}</p>
                    </div>
                    <div className="text-right text-slate-700 font-medium">
                      <p>Wali Kelas: <span className="font-bold">{teacherName}</span></p>
                      <p>Jumlah Siswa: <span className="font-bold">{students.length} Orang</span></p>
                    </div>
                  </div>

                  {/* Class Rekap Table */}
                  <table className="w-full text-xs border-collapse border border-slate-900 mb-6">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900">
                        <th className="border border-slate-900 p-2 text-center w-8">No</th>
                        <th className="border border-slate-900 p-2 text-center w-20">NIS</th>
                        <th className="border border-slate-900 p-2 text-left">Nama Siswa</th>
                        <th className="border border-slate-900 p-2 text-center w-8">JK</th>
                        <th className="border border-slate-900 p-2 text-center">MTK</th>
                        <th className="border border-slate-900 p-2 text-center">INDO</th>
                        <th className="border border-slate-900 p-2 text-center">ING</th>
                        <th className="border border-slate-900 p-2 text-center">IPAS</th>
                        <th className="border border-slate-900 p-2 text-center">PPKN</th>
                        <th className="border border-slate-900 p-2 text-center">SENI</th>
                        <th className="border border-slate-900 p-2 text-center">SUNDA</th>
                        <th className="border border-slate-900 p-2 text-center">KOKUR</th>
                        <th className="border border-slate-900 p-2 text-center font-extrabold bg-slate-200">Total</th>
                        <th className="border border-slate-900 p-2 text-center font-extrabold bg-slate-200">Rata2</th>
                        <th className="border border-slate-900 p-2 text-center">Presensi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, idx) => {
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
                        const avg = (total / 8).toFixed(1);

                        return (
                          <tr key={s.id} className="border-b border-slate-300">
                            <td className="border border-slate-900 p-1.5 text-center font-medium">{idx + 1}</td>
                            <td className="border border-slate-900 p-1.5 text-center font-mono">{s.nis}</td>
                            <td className="border border-slate-900 p-1.5 font-bold text-slate-900">{s.name}</td>
                            <td className="border border-slate-900 p-1.5 text-center font-semibold">{s.gender}</td>
                            <td className="border border-slate-900 p-1.5 text-center">{m}</td>
                            <td className="border border-slate-900 p-1.5 text-center">{i}</td>
                            <td className="border border-slate-900 p-1.5 text-center">{e}</td>
                            <td className="border border-slate-900 p-1.5 text-center">{sc}</td>
                            <td className="border border-slate-900 p-1.5 text-center">{p}</td>
                            <td className="border border-slate-900 p-1.5 text-center">{a}</td>
                            <td className="border border-slate-900 p-1.5 text-center">{su}</td>
                            <td className="border border-slate-900 p-1.5 text-center">{c}</td>
                            <td className="border border-slate-900 p-1.5 text-center font-extrabold bg-slate-50">{total}</td>
                            <td className="border border-slate-900 p-1.5 text-center font-extrabold bg-slate-50">{avg}</td>
                            <td className="border border-slate-900 p-1.5 text-center font-medium">{s.attendanceRate}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Class Signatures */}
                  <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-2 text-center text-xs text-slate-900 gap-8">
                    <div>
                      <p className="mb-14 font-semibold text-slate-800">Mengetahui,<br/>Wali Kelas {activeClass}</p>
                      <p className="font-bold underline text-slate-950">{teacherName}</p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">{teacherNip}</p>
                    </div>

                    <div>
                      <p className="text-[11px] text-slate-600 mb-1">Lembang, {currentDateStr}</p>
                      <p className="mb-12 font-semibold text-slate-800">Kepala Sekolah</p>
                      <p className="font-bold underline text-slate-950">{headmasterName}</p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">{headmasterNip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            Format telah disesuaikan dengan standar Cetak A4 Rapor Pendidikan.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handleTriggerPrint}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
