import { Student, GradeLog, SubjectAvg, SubjectGradeBreakdown } from '../types';

function createGradeBreakdown(baseScore: number, att = 95): SubjectGradeBreakdown {
  const b = Math.min(100, Math.max(0, baseScore));
  return {
    tugas: b,
    tp1: Math.min(100, Math.max(0, b + 2)),
    tp2: Math.min(100, Math.max(0, b - 1)),
    tp3: Math.min(100, Math.max(0, b + 1)),
    tp4: Math.min(100, Math.max(0, b - 2)),
    tp5: Math.min(100, Math.max(0, b + 3)),
    formatif: Math.min(100, Math.max(0, b - 1)),
    sumatif: b,
    kehadiran: att
  };
}

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    nis: '202412001',
    name: 'Adi Saputra',
    avatarInitials: 'AS',
    gender: 'L',
    attendanceRate: 96,
    grades: {
      math: createGradeBreakdown(85, 96),
      indonesian: createGradeBreakdown(88, 96),
      english: createGradeBreakdown(86, 96),
      science: createGradeBreakdown(82, 96),
      pancasila: createGradeBreakdown(90, 96),
      arts: createGradeBreakdown(84, 96),
      sundanese: createGradeBreakdown(80, 96),
      cocurricular: createGradeBreakdown(88, 96)
    },
    notes: 'Aktif dalam diskusi matematika, perlu peningkatan pada literasi sains.',
    updatedAt: '2m lalu'
  },
  {
    id: 's2',
    nis: '202412002',
    name: 'Rina Mahendra',
    avatarInitials: 'RM',
    gender: 'P',
    attendanceRate: 98,
    grades: {
      math: createGradeBreakdown(92, 98),
      indonesian: createGradeBreakdown(94, 98),
      english: createGradeBreakdown(90, 98),
      science: createGradeBreakdown(90, 98),
      pancasila: createGradeBreakdown(95, 98),
      arts: createGradeBreakdown(92, 98),
      sundanese: createGradeBreakdown(88, 98),
      cocurricular: createGradeBreakdown(94, 98)
    },
    notes: 'Prestasi akademik sangat memuaskan di semua mata pelajaran.',
    updatedAt: '15m lalu'
  },
  {
    id: 's3',
    nis: '202412003',
    name: 'Bambang K.',
    avatarInitials: 'BK',
    gender: 'L',
    attendanceRate: 88,
    grades: {
      math: createGradeBreakdown(68, 88),
      indonesian: createGradeBreakdown(75, 88),
      english: createGradeBreakdown(80, 88),
      science: createGradeBreakdown(70, 88),
      pancasila: createGradeBreakdown(82, 88),
      arts: createGradeBreakdown(78, 88),
      sundanese: createGradeBreakdown(72, 88),
      cocurricular: createGradeBreakdown(80, 88)
    },
    notes: 'Membutuhkan bimbingan remedial matematika bab kalkulus.',
    updatedAt: '1 jam lalu'
  },
  {
    id: 's4',
    nis: '202412004',
    name: 'Dewi Wijaya',
    avatarInitials: 'DW',
    gender: 'P',
    attendanceRate: 92,
    grades: {
      math: createGradeBreakdown(78, 92),
      indonesian: createGradeBreakdown(86, 92),
      english: createGradeBreakdown(88, 92),
      science: createGradeBreakdown(80, 92),
      pancasila: createGradeBreakdown(88, 92),
      arts: createGradeBreakdown(85, 92),
      sundanese: createGradeBreakdown(82, 92),
      cocurricular: createGradeBreakdown(86, 92)
    },
    notes: 'Sangat baik dalam seni dan kegiatan ekstra kurikuler.',
    updatedAt: '3 jam lalu'
  },
  {
    id: 's5',
    nis: '202412005',
    name: 'Fajar Putra',
    avatarInitials: 'FP',
    gender: 'L',
    attendanceRate: 95,
    grades: {
      math: createGradeBreakdown(88, 95),
      indonesian: createGradeBreakdown(90, 95),
      english: createGradeBreakdown(87, 95),
      science: createGradeBreakdown(85, 95),
      pancasila: createGradeBreakdown(92, 95),
      arts: createGradeBreakdown(86, 95),
      sundanese: createGradeBreakdown(84, 95),
      cocurricular: createGradeBreakdown(90, 95)
    },
    notes: 'Kepemimpinan kelompok sangat menonjol di kelas.',
    updatedAt: '4 jam lalu'
  },
  {
    id: 's6',
    nis: '202412006',
    name: 'Siti Rahmawati',
    avatarInitials: 'SR',
    gender: 'P',
    attendanceRate: 97,
    grades: {
      math: createGradeBreakdown(98, 97),
      indonesian: createGradeBreakdown(91, 97),
      english: createGradeBreakdown(93, 97),
      science: createGradeBreakdown(95, 97),
      pancasila: createGradeBreakdown(94, 97),
      arts: createGradeBreakdown(89, 97),
      sundanese: createGradeBreakdown(86, 97),
      cocurricular: createGradeBreakdown(92, 97)
    },
    notes: 'Nilai matematika tertinggi di kelas (98).',
    updatedAt: '5 jam lalu'
  },
  {
    id: 's7',
    nis: '202412007',
    name: 'Ahmad Rizky',
    avatarInitials: 'AR',
    gender: 'L',
    attendanceRate: 90,
    grades: {
      math: createGradeBreakdown(75, 90),
      indonesian: createGradeBreakdown(82, 90),
      english: createGradeBreakdown(80, 90),
      science: createGradeBreakdown(78, 90),
      pancasila: createGradeBreakdown(85, 90),
      arts: createGradeBreakdown(80, 90),
      sundanese: createGradeBreakdown(76, 90),
      cocurricular: createGradeBreakdown(82, 90)
    },
    notes: 'Kehadiran perlu ditingkatkan di jam pelajaran pertama.',
    updatedAt: '6 jam lalu'
  },
  {
    id: 's8',
    nis: '202412008',
    name: 'Nabila Putri',
    avatarInitials: 'NP',
    gender: 'P',
    attendanceRate: 94,
    grades: {
      math: createGradeBreakdown(84, 94),
      indonesian: createGradeBreakdown(89, 94),
      english: createGradeBreakdown(91, 94),
      science: createGradeBreakdown(81, 94),
      pancasila: createGradeBreakdown(87, 94),
      arts: createGradeBreakdown(90, 94),
      sundanese: createGradeBreakdown(85, 94),
      cocurricular: createGradeBreakdown(88, 94)
    },
    notes: 'Rajin mengumpulkan tugas tepat waktu.',
    updatedAt: '7 jam lalu'
  },
  // Generate remaining students up to 36
  ...Array.from({ length: 28 }).map((_, idx) => {
    const num = idx + 9;
    const names = [
      'Budi Santoso', 'Cinta Laura', 'Dimas Anggara', 'Eka Pratama', 'Gita Gutawa',
      'Hendra Setiawan', 'Indah Permata', 'Joko Widodo', 'Kartika Sari', 'Luki Wijaya',
      'Maya Anggraini', 'Naufal Azhar', 'Oktavia Ramadhani', 'Pratama Arhan', 'Qori Sandioriva',
      'Rizky Febian', 'Salsabila Adriani', 'Taufik Hidayat', 'Umar Faruq', 'Vina Panduwinata',
      'Wahyu Hidayat', 'Xavier Marks', 'Yuliana Susanti', 'Zahra Amalia', 'Andi Utama',
      'Bagus Prasetyo', 'Citra Kirana', 'Deri Sulaiman'
    ];
    const name = names[idx] || `Siswa 12-A ${num}`;
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    
    const mathScores = [80, 85, 78, 83, 82, 87, 81, 79, 86, 84, 88, 77, 82, 85, 83, 80, 86, 82, 84, 81, 83, 85, 82, 80, 84, 86, 81, 83];
    const math = mathScores[idx % mathScores.length];
    const att = Math.floor(Math.random() * 8) + 91;

    return {
      id: `s${num}`,
      nis: `2024120${num < 10 ? '0' + num : num}`,
      name,
      avatarInitials: initials,
      gender: (num % 2 === 0 ? 'P' : 'L') as 'L' | 'P',
      attendanceRate: att,
      grades: {
        math: createGradeBreakdown(math, att),
        indonesian: createGradeBreakdown(Math.min(100, math + 3), att),
        english: createGradeBreakdown(Math.min(100, math + 2), att),
        science: createGradeBreakdown(Math.min(100, math - 1), att),
        pancasila: createGradeBreakdown(Math.min(100, math + 4), att),
        arts: createGradeBreakdown(Math.min(100, math + 2), att),
        sundanese: createGradeBreakdown(Math.min(100, math - 2), att),
        cocurricular: createGradeBreakdown(Math.min(100, math + 5), att)
      },
      notes: 'Siswa dapat mengikuti materi pembelajaran dengan baik.',
      updatedAt: `${num} jam lalu`
    };
  })
];

export const INITIAL_RECENT_UPDATES: GradeLog[] = [
  {
    id: 'log1',
    studentId: 's1',
    studentName: 'Adi Saputra',
    studentInitials: 'AS',
    subject: 'Matematika',
    score: 85,
    timeAgo: '2m lalu',
    timestamp: 'Baru saja'
  },
  {
    id: 'log2',
    studentId: 's2',
    studentName: 'Rina Mahendra',
    studentInitials: 'RM',
    subject: 'Bahasa Indonesia',
    score: 92,
    timeAgo: '15m lalu',
    timestamp: '15 menit lalu'
  },
  {
    id: 'log3',
    studentId: 's3',
    studentName: 'Bambang K.',
    studentInitials: 'BK',
    subject: 'Bahasa Inggris',
    score: 88,
    timeAgo: '1 jam lalu',
    timestamp: '1 jam lalu'
  },
  {
    id: 'log4',
    studentId: 's4',
    studentName: 'Dewi Wijaya',
    studentInitials: 'DW',
    subject: 'Seni Budaya',
    score: 78,
    timeAgo: '3 jam lalu',
    timestamp: '3 jam lalu'
  },
  {
    id: 'log5',
    studentId: 's5',
    studentName: 'Fajar Putra',
    studentInitials: 'FP',
    subject: 'IPAS (Sains)',
    score: 88,
    timeAgo: '4 jam lalu',
    timestamp: '4 jam lalu'
  }
];

export const SUBJECT_INFO_MAP: Record<string, { label: string; short: string; key: keyof Student['grades'] }> = {
  math: { label: 'Matematika', short: 'MTK', key: 'math' },
  indonesian: { label: 'Bahasa Indonesia', short: 'B. Indo', key: 'indonesian' },
  english: { label: 'Bahasa Inggris', short: 'B. Bing', key: 'english' },
  science: { label: 'IPAS (Sains)', short: 'IPAS', key: 'science' },
  pancasila: { label: 'Pendidikan Pancasila', short: 'PPKn', key: 'pancasila' },
  arts: { label: 'Seni Budaya', short: 'Seni', key: 'arts' },
  sundanese: { label: 'Bahasa Sunda', short: 'B. Sunda', key: 'sundanese' },
  cocurricular: { label: 'Kokurikuler', short: 'Kokur.', key: 'cocurricular' }
};

export function getInitialStudentsForClass(className: string): Student[] {
  if (className === 'Kelas 12-A') {
    return INITIAL_STUDENTS;
  }
  
  // Extract number or suffix to seed differences
  const prefixNIS = className.includes('11') ? '20241100' : className.includes('10') ? '20241000' : '20241250';
  
  return INITIAL_STUDENTS.map((st, idx) => ({
    ...st,
    id: `cls_${className.replace(/\s+/g, '_')}_s${idx + 1}`,
    nis: `${prefixNIS}${idx + 1}`,
    updatedAt: 'Terdaftar'
  }));
}

