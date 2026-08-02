export type AppView = 
  | 'dashboard' 
  | 'students' 
  | 'mathematics' 
  | 'indonesian' 
  | 'english'
  | 'science' 
  | 'pancasila' 
  | 'arts' 
  | 'sundanese' 
  | 'cocurricular' 
  | 'notes';

export type UserRole = 'admin' | 'teacher';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  nip: string;
  role: UserRole;
  avatarInitials: string;
  title: string;
  assignedClasses?: string[];
}

export interface SubjectGradeBreakdown {
  tugas: number;     // 20%
  tp1: number;       // TP1
  tp2: number;       // TP2
  tp3: number;       // TP3
  tp4: number;       // TP4
  tp5: number;       // TP5 (Avg TP1..TP5 weighted at 25%)
  formatif: number;  // 20%
  sumatif: number;   // 30%
  kehadiran: number; // 5%
}

export type SubjectGrade = number | SubjectGradeBreakdown;

export function getSubjectGradeBreakdown(grade: SubjectGrade | undefined, fallbackScore = 80): SubjectGradeBreakdown {
  if (typeof grade === 'number') {
    const s = grade;
    return {
      tugas: s,
      tp1: s,
      tp2: s,
      tp3: s,
      tp4: s,
      tp5: s,
      formatif: s,
      sumatif: s,
      kehadiran: s
    };
  }
  if (!grade) {
    return {
      tugas: fallbackScore,
      tp1: fallbackScore,
      tp2: fallbackScore,
      tp3: fallbackScore,
      tp4: fallbackScore,
      tp5: fallbackScore,
      formatif: fallbackScore,
      sumatif: fallbackScore,
      kehadiran: fallbackScore
    };
  }
  return grade;
}

export function getSubjectFinalScore(grade: SubjectGrade | undefined, fallback = 80): number {
  if (typeof grade === 'number') return grade;
  if (!grade) return fallback;
  const bd = getSubjectGradeBreakdown(grade, fallback);
  const tpAvg = ((bd.tp1 ?? 0) + (bd.tp2 ?? 0) + (bd.tp3 ?? 0) + (bd.tp4 ?? 0) + (bd.tp5 ?? 0)) / 5;
  const weighted = 
    ((bd.tugas ?? 0) * 0.20) +
    (tpAvg * 0.25) +
    ((bd.formatif ?? 0) * 0.20) +
    ((bd.sumatif ?? 0) * 0.30) +
    ((bd.kehadiran ?? 0) * 0.05);
  return Math.round(weighted * 10) / 10;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  parentName?: string;
  parentPhone?: string;
  avatarInitials: string;
  gender: 'L' | 'P';
  attendanceRate: number; // percentage, e.g. 95
  grades: {
    math: SubjectGrade;
    indonesian: SubjectGrade;
    english: SubjectGrade;
    science: SubjectGrade;
    pancasila: SubjectGrade;
    arts: SubjectGrade;
    sundanese: SubjectGrade;
    cocurricular: SubjectGrade;
  };
  notes?: string;
  updatedAt: string;
}

export interface SubjectKKMMap {
  math: number;
  indonesian: number;
  english: number;
  science: number;
  pancasila: number;
  arts: number;
  sundanese: number;
  cocurricular: number;
}

export const DEFAULT_SUBJECT_KKM: SubjectKKMMap = {
  indonesian: 75,
  math: 70,
  science: 75,
  pancasila: 75,
  english: 70,
  arts: 75,
  sundanese: 75,
  cocurricular: 75,
};

export const SUBJECT_NAMES: Record<keyof SubjectKKMMap, { name: string; short: string; code: string }> = {
  indonesian: { name: 'Bahasa Indonesia', short: 'B. Indo', code: 'BIND' },
  math: { name: 'Matematika', short: 'MTK', code: 'MTK' },
  science: { name: 'IPAS (Science)', short: 'IPAS', code: 'IPAS' },
  pancasila: { name: 'Pendidikan Pancasila (PKn)', short: 'Pancasila', code: 'PPKN' },
  english: { name: 'Bahasa Inggris', short: 'B. Ing', code: 'BING' },
  arts: { name: 'Seni & Budaya (SBdP)', short: 'Seni', code: 'SBDP' },
  sundanese: { name: 'Bahasa Daerah (Sunda)', short: 'B. Daerah', code: 'BD' },
  cocurricular: { name: 'P5 / Kokurikuler', short: 'P5', code: 'P5' },
};

export function getKKMStatus(score: number, kkm = 75) {
  const isPass = score >= kkm;
  return {
    isPass,
    kkm,
    label: isPass ? 'Tuntas' : 'Remidial',
    badgeClass: isPass 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
      : 'bg-rose-100 text-rose-800 border-rose-300 shadow-2xs'
  };
}

export interface GradeLog {
  id: string;
  studentId: string;
  studentName: string;
  studentInitials: string;
  subject: string;
  score: number;
  timeAgo: string;
  timestamp: string;
}

export interface SubjectAvg {
  subjectKey: string;
  subjectName: string;
  shortName: string;
  average: number;
  color: string;
}

export interface GoogleSheetConfig {
  spreadsheetId: string;
  webAppUrl: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}

