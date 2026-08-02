import React, { useState, useEffect } from 'react';
import { Student, getSubjectFinalScore, getKKMStatus } from '../types';
import { MessageSquare, Phone, Send, Copy, Check, X, User, MessageCircle, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  teacherName?: string;
  activeClass?: string;
  kkm?: number;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  student,
  teacherName = 'Budi Santoso, M.Pd',
  activeClass = 'Kelas 12-A',
  kkm = 75
}) => {
  const [phone, setPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [templateType, setTemplateType] = useState<'bimbingan' | 'rapor' | 'kehadiran'>('bimbingan');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Compute student metrics
  const scores = student ? Object.values(student.grades).map(g => getSubjectFinalScore(g as any)) : [];
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0';
  const kkmStatus = getKKMStatus(Number(avgScore), kkm);

  useEffect(() => {
    if (student) {
      const defaultPhone = student.parentPhone || `08123456${(student.id.replace(/\D/g, '') || '01').padStart(4, '0')}`;
      const defaultParent = student.parentName || `Orang Tua / Wali ${student.name}`;
      setPhone(defaultPhone);
      setParentName(defaultParent);

      generateTemplateMessage(templateType, student, defaultParent, defaultPhone);
    }
  }, [student, templateType, teacherName, activeClass, kkm]);

  const generateTemplateMessage = (
    type: 'bimbingan' | 'rapor' | 'kehadiran',
    st: Student,
    pName: string,
    pPhone: string
  ) => {
    const sAvg = (Object.values(st.grades).map(g => getSubjectFinalScore(g as any)).reduce((a, b) => a + b, 0) / 8).toFixed(1);
    const status = getKKMStatus(Number(sAvg), kkm);

    let msg = '';
    if (type === 'bimbingan') {
      msg = `Assalamu'alaikum / Selamat Pagi/Siang Yth. ${pName},\n\n` +
        `Saya ${teacherName} (Wali Kelas ${activeClass} ${st.name}).\n` +
        `Izin menyampaikan Catatan Bimbingan & Perkembangan Siswa an. *${st.name}* (NIS: ${st.nis}):\n\n` +
        `📌 *Ringkasan Perkembangan Akademik:*\n` +
        `• Rata-Rata Nilai: *${sAvg}* (KKM: ${kkm} -> Status: ${status.label.toUpperCase()})\n` +
        `• Persentase Kehadiran: *${st.attendanceRate}%*\n\n` +
        `📝 *Catatan Wali Kelas:*\n` +
        `"${st.notes || 'Siswa menunjukkan sikap dan keaktifan yang baik selama proses pembelajaran.'}"\n\n` +
        `Mohon dukungan Bapak/Ibu di rumah untuk terus memotivasi ananda. Apabila ada hal yang perlu didiskusikan, silakan membalas pesan ini. Terima kasih.\n\n` +
        `Salam hormat,\n` +
        `*${teacherName}*\n` +
        `Wali Kelas ${activeClass}`;
    } else if (type === 'rapor') {
      msg = `Assalamu'alaikum / Selamat Pagi Yth. ${pName},\n\n` +
        `Laporan Rincian Nilai Sementara an. *${st.name}* (${activeClass}):\n\n` +
        `📊 *Capaian Rata-Rata:* ${sAvg} / 100\n` +
        `🎯 *KKM Sekolah:* ${kkm}\n` +
        `✨ *Status KKM:* ${status.isPass ? '✅ TUNTAS MEMUASKAN' : '⚠️ REMIDIAL / PERLU BIMBINGAN'}\n` +
        `📅 *Kehadiran:* ${st.attendanceRate}%\n\n` +
        `Demikian informasi ini disampaikan. Terima kasih atas kerja samanya.\n\n` +
        `Wali Kelas: ${teacherName}`;
    } else {
      msg = `Assalamu'alaikum Yth. ${pName},\n\n` +
        `Menginfokan kehadiran ananda *${st.name}* di ${activeClass}.\n` +
        `Tingkat Kehadiran: *${st.attendanceRate}%*.\n\n` +
        `Catatan Pembinaan: "${st.notes || 'Diharapkan ananda hadir tepat waktu dan menjaga konsistensi belajar.'}"\n\n` +
        `Salam santun,\n${teacherName}`;
    }

    setCustomMessage(msg);
  };

  if (!isOpen || !student) return null;

  const formattedPhone = phone.replace(/[^0-9]/g, '');
  const cleanPhone = formattedPhone.startsWith('0') 
    ? '62' + formattedPhone.slice(1) 
    : formattedPhone.startsWith('62') 
    ? formattedPhone 
    : '62' + formattedPhone;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-emerald-200">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">Kirim Pesan WhatsApp Orang Tua</h3>
              <p className="text-xs text-emerald-100 mt-0.5">Catatan Bimbingan Wali Kelas & Laporan Rapor Siswa</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Summary Header Card */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {student.avatarInitials}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm leading-tight">{student.name}</h4>
              <p className="text-xs text-slate-500">NIS: {student.nis} • {activeClass}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-slate-700">Rata-Rata: <span className="text-emerald-700 text-sm">{avgScore}</span></div>
            <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded border mt-0.5 ${kkmStatus.badgeClass}`}>
              {kkmStatus.label.toUpperCase()} (KKM {kkm})
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Parent Details Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Orang Tua / Wali
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Bapak / Ibu Wali Siswa"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp Orang Tua
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Template Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Draf Pesan Otomatis
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplateType('bimbingan')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  templateType === 'bimbingan'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-[11px] font-bold">Catatan Bimbingan</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Laporan Wali Kelas</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('rapor')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  templateType === 'rapor'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-[11px] font-bold">Rincian Rapor & KKM</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Ringkasan Nilai</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('kehadiran')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  templateType === 'kehadiran'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-[11px] font-bold">Laporan Kehadiran</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Persentase Presensi</div>
              </button>
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Pratinjau Pesan yang Akan Dikirim:
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[11px] text-slate-600 hover:text-emerald-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
              </button>
            </div>
            <textarea
              rows={9}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl font-sans leading-relaxed focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between text-xs">
          <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Format nomor otomatis: +{cleanPhone}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Buka WhatsApp Web / App</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
