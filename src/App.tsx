import React, { useState, useEffect } from 'react';
import { AppView, Student, GradeLog, SubjectGradeBreakdown, getSubjectFinalScore } from './types';
import { INITIAL_STUDENTS, INITIAL_RECENT_UPDATES, getInitialStudentsForClass } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { MetricCards } from './components/MetricCards';
import { SubjectPerformanceChart } from './components/SubjectPerformanceChart';
import { RecentUpdates } from './components/RecentUpdates';
import { BottomCards } from './components/BottomCards';
import { QuickAddModal } from './components/QuickAddModal';
import { AppsScriptModal } from './components/AppsScriptModal';
import { StudentDataView } from './components/StudentDataView';
import { SubjectDetailView } from './components/SubjectDetailView';
import { TeacherNotesView } from './components/TeacherNotesView';
import { ExportModal } from './components/ExportModal';
import { ClassManagerModal } from './components/ClassManagerModal';
import { Download, Share2, FileSpreadsheet, School, ChevronDown } from 'lucide-react';

const DEFAULT_CLASSES = ['Kelas 12-A', 'Kelas 12-B', 'Kelas 11-MIPA 1', 'Kelas 10-A'];

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [teacherName, setTeacherName] = useState<string>(() => {
    return localStorage.getItem('antigravity_teacher_name') || 'Budi Santoso, M.Pd';
  });

  // Class Management State
  const [classList, setClassList] = useState<string[]>(() => {
    const saved = localStorage.getItem('antigravity_class_list');
    return saved ? JSON.parse(saved) : DEFAULT_CLASSES;
  });

  const [activeClass, setActiveClass] = useState<string>(() => {
    return localStorage.getItem('antigravity_active_class') || 'Kelas 12-A';
  });

  const [academicPeriod, setAcademicPeriod] = useState<string>(() => {
    return localStorage.getItem('antigravity_academic_period') || 'Semester 1 (2024/2025)';
  });

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);

  // Student State tied to activeClass
  const [students, setStudents] = useState<Student[]>(() => {
    const savedClass = localStorage.getItem('antigravity_active_class') || 'Kelas 12-A';
    const saved = localStorage.getItem(`antigravity_students_${savedClass}`);
    if (saved) return JSON.parse(saved);
    return getInitialStudentsForClass(savedClass);
  });

  const [logs, setLogs] = useState<GradeLog[]>(() => {
    const saved = localStorage.getItem('antigravity_logs');
    return saved ? JSON.parse(saved) : INITIAL_RECENT_UPDATES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [webAppUrl, setWebAppUrl] = useState<string>(() => {
    return localStorage.getItem('antigravity_webapp_url') || '';
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAppsScriptOpen, setIsAppsScriptOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportSingleStudent, setExportSingleStudent] = useState<Student | undefined>(undefined);

  // Sync activeClass changes with localStorage & student roster
  useEffect(() => {
    localStorage.setItem('antigravity_active_class', activeClass);
    const saved = localStorage.getItem(`antigravity_students_${activeClass}`);
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      const initial = getInitialStudentsForClass(activeClass);
      setStudents(initial);
      localStorage.setItem(`antigravity_students_${activeClass}`, JSON.stringify(initial));
    }
  }, [activeClass]);

  // Persist students per activeClass
  useEffect(() => {
    if (activeClass) {
      localStorage.setItem(`antigravity_students_${activeClass}`, JSON.stringify(students));
    }
  }, [students, activeClass]);

  // Persist classList & academicPeriod
  useEffect(() => {
    localStorage.setItem('antigravity_class_list', JSON.stringify(classList));
  }, [classList]);

  useEffect(() => {
    localStorage.setItem('antigravity_academic_period', academicPeriod);
  }, [academicPeriod]);

  useEffect(() => {
    localStorage.setItem('antigravity_logs', JSON.stringify(logs));
  }, [logs]);

  // Handlers for Class Management
  const handleSelectClass = (newClassName: string) => {
    setActiveClass(newClassName);
  };

  const handleAddClass = (newClassName: string) => {
    if (!classList.includes(newClassName)) {
      const updatedList = [...classList, newClassName];
      setClassList(updatedList);
      setActiveClass(newClassName);
    }
  };

  const handleRenameClass = (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) return;
    const updatedList = classList.map((c) => (c === oldName ? newName : c));
    setClassList(updatedList);

    const existingData = localStorage.getItem(`antigravity_students_${oldName}`);
    if (existingData) {
      localStorage.setItem(`antigravity_students_${newName}`, existingData);
      localStorage.removeItem(`antigravity_students_${oldName}`);
    }

    if (activeClass === oldName) {
      setActiveClass(newName);
    }
  };

  const handleDeleteClass = (className: string) => {
    if (classList.length <= 1) return;
    const updatedList = classList.filter((c) => c !== className);
    setClassList(updatedList);
    localStorage.removeItem(`antigravity_students_${className}`);

    if (activeClass === className) {
      setActiveClass(updatedList[0]);
    }
  };

  const handleRestoreData = (backup: any) => {
    if (backup.teacherName) {
      setTeacherName(backup.teacherName);
      localStorage.setItem('antigravity_teacher_name', backup.teacherName);
    }
    if (backup.academicPeriod) {
      setAcademicPeriod(backup.academicPeriod);
      localStorage.setItem('antigravity_academic_period', backup.academicPeriod);
    }
    if (backup.classList && Array.isArray(backup.classList)) {
      setClassList(backup.classList);
      localStorage.setItem('antigravity_class_list', JSON.stringify(backup.classList));
    }
    if (backup.studentsPerClass && typeof backup.studentsPerClass === 'object') {
      Object.entries(backup.studentsPerClass).forEach(([clsName, clsStudents]) => {
        localStorage.setItem(`antigravity_students_${clsName}`, JSON.stringify(clsStudents));
      });
    }
    if (backup.logs && Array.isArray(backup.logs)) {
      setLogs(backup.logs);
      localStorage.setItem('antigravity_logs', JSON.stringify(backup.logs));
    }
    if (backup.logos) {
      if (backup.logos.dinas) localStorage.setItem('antigravity_logo_dinas', backup.logos.dinas);
      if (backup.logos.sekolah) localStorage.setItem('antigravity_logo_sekolah', backup.logos.sekolah);
    }
    const targetClass = backup.activeClass || (backup.classList && backup.classList[0]) || activeClass;
    if (targetClass) {
      setActiveClass(targetClass);
      localStorage.setItem('antigravity_active_class', targetClass);
      const saved = localStorage.getItem(`antigravity_students_${targetClass}`);
      if (saved) {
        setStudents(JSON.parse(saved));
      }
    }
  };

  // Dynamic KPI Calculations
  const totalStudents = students.length;
  
  const mathTotal = students.reduce((acc, s) => acc + getSubjectFinalScore(s.grades.math), 0);
  const mathAvg = totalStudents > 0 ? (mathTotal / totalStudents).toFixed(1) : '0';

  const highestScore = students.reduce((max, s) => {
    const gradesList = Object.values(s.grades).map((g) => getSubjectFinalScore(g as any));
    const studentHighest = Math.max(...gradesList);
    return Math.max(max, studentHighest);
  }, 0);

  const totalAtt = students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0);
  const classAttendance = totalStudents > 0 ? Math.round(totalAtt / totalStudents) : 94;

  const handleUpdateTeacherName = (newName: string) => {
    setTeacherName(newName);
    localStorage.setItem('antigravity_teacher_name', newName);
  };

  // Handlers
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);

    // Add log entry
    const newLog: GradeLog = {
      id: `log_${Date.now()}`,
      studentId: newStudent.id,
      studentName: newStudent.name,
      studentInitials: newStudent.avatarInitials,
      subject: 'Matematika',
      score: getSubjectFinalScore(newStudent.grades.math),
      timeAgo: 'Baru saja',
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdateGrade = (studentId: string, subjectKey: keyof Student['grades'], score: SubjectGradeBreakdown | number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            grades: {
              ...s.grades,
              [subjectKey]: score
            },
            updatedAt: 'Baru saja'
          };
        }
        return s;
      })
    );

    const targetStudent = students.find((s) => s.id === studentId);
    if (targetStudent) {
      const subjectNames: Record<string, string> = {
        math: 'Matematika',
        indonesian: 'Bahasa Indonesia',
        english: 'Bahasa Inggris',
        science: 'IPAS (Sains)',
        pancasila: 'Pendidikan Pancasila',
        arts: 'Seni Budaya',
        sundanese: 'Bahasa Sunda',
        cocurricular: 'Kokurikuler'
      };

      const finalVal = getSubjectFinalScore(score);

      const newLog: GradeLog = {
        id: `log_${Date.now()}`,
        studentId: targetStudent.id,
        studentName: targetStudent.name,
        studentInitials: targetStudent.avatarInitials,
        subject: subjectNames[subjectKey] || 'Mata Pelajaran',
        score: finalVal,
        timeAgo: 'Baru saja',
        timestamp: new Date().toLocaleTimeString()
      };
      setLogs((prev) => [newLog, ...prev]);
    }
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const handleUpdateNotes = (studentId: string, notes: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, notes, updatedAt: 'Baru saja' } : s))
    );
  };

  const handleSaveWebAppUrl = (url: string) => {
    setWebAppUrl(url);
    localStorage.setItem('antigravity_webapp_url', url);
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      if (webAppUrl) {
        const res = await fetch(`${webAppUrl}?action=getData`);
        if (res.ok) {
          const json = await res.json();
          if (json.students && Array.isArray(json.students)) {
            setStudents(json.students);
          }
        }
      } else {
        // Simulated sync delay if no URL provided
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    } catch (err) {
      console.warn("Sync error, fallback to local state:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenExportModal = (student?: Student) => {
    setExportSingleStudent(student);
    setIsExportOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        studentCount={totalStudents}
        teacherName={teacherName}
        onUpdateTeacherName={handleUpdateTeacherName}
        activeClass={activeClass}
        classList={classList}
        onSelectClass={handleSelectClass}
        onOpenClassModal={() => setIsClassModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)}
          isSyncing={isSyncing}
        />

        {/* View Container */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentView === 'dashboard' && (
            <>
              {/* Academic Overview Title Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ringkasan Akademik</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => setIsClassModalOpen(true)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-lg text-xs font-bold text-indigo-900 transition-colors cursor-pointer shadow-2xs"
                      title="Klik untuk ubah / kelola kelas"
                    >
                      <School className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{activeClass}</span>
                      <span className="text-indigo-300">•</span>
                      <span className="text-indigo-700 font-semibold">{academicPeriod}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-indigo-500 group-hover:text-indigo-700 ml-0.5" />
                    </button>
                    <span className="text-[11px] font-medium text-slate-400">(Klik untuk Ubah Kelas)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsClassModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 shadow-xs transition-colors cursor-pointer"
                  >
                    <School className="w-3.5 h-3.5" />
                    <span>Ubah Kelas</span>
                  </button>

                  <button
                    onClick={() => handleOpenExportModal()}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor Laporan</span>
                  </button>

                  <button
                    onClick={() => setIsAppsScriptOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0B63E5] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Integrasi Drive / Sheet</span>
                  </button>
                </div>
              </div>

              {/* Top 4 Metric KPI Cards */}
              <MetricCards
                totalStudents={totalStudents}
                mathAvg={mathAvg}
                highestScore={highestScore}
                attendanceRate={`${classAttendance}%`}
              />

              {/* Middle Section: Subject Performance & Recent Updates */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[360px]">
                <div className="lg:col-span-8 h-full">
                  <SubjectPerformanceChart students={students} />
                </div>
                <div className="lg:col-span-4 h-full">
                  <RecentUpdates
                    logs={logs}
                    onViewAllActivity={() => setCurrentView('students')}
                  />
                </div>
              </div>

              {/* Bottom Cards Row */}
              <BottomCards
                onViewAttendanceDetails={() => setCurrentView('students')}
                onFinishGrading={() => setCurrentView('mathematics')}
              />
            </>
          )}

          {currentView === 'students' && (
            <StudentDataView
              students={students}
              onUpdateStudent={handleUpdateStudent}
              onOpenExportModal={handleOpenExportModal}
              activeClass={activeClass}
            />
          )}

          {currentView === 'mathematics' && (
            <SubjectDetailView
              subjectKey="math"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
            />
          )}

          {currentView === 'indonesian' && (
            <SubjectDetailView
              subjectKey="indonesian"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
            />
          )}

          {currentView === 'english' && (
            <SubjectDetailView
              subjectKey="english"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
            />
          )}

          {currentView === 'science' && (
            <SubjectDetailView
              subjectKey="science"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
            />
          )}

          {currentView === 'pancasila' && (
            <SubjectDetailView
              subjectKey="pancasila"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
            />
          )}

          {currentView === 'arts' && (
            <SubjectDetailView
              subjectKey="arts"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
            />
          )}

          {currentView === 'sundanese' && (
            <SubjectDetailView
              subjectKey="sundanese"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
            />
          )}

          {currentView === 'cocurricular' && (
            <SubjectDetailView
              subjectKey="cocurricular"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
            />
          )}

          {currentView === 'notes' && (
            <TeacherNotesView
              students={students}
              onUpdateNotes={handleUpdateNotes}
              teacherName={teacherName}
              activeClass={activeClass}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        students={students}
        onAddStudent={handleAddStudent}
        onUpdateGrade={handleUpdateGrade}
        activeClass={activeClass}
      />

      <AppsScriptModal
        isOpen={isAppsScriptOpen}
        onClose={() => setIsAppsScriptOpen(false)}
        webAppUrl={webAppUrl}
        onSaveWebAppUrl={handleSaveWebAppUrl}
        onSyncData={handleSyncData}
        isSyncing={isSyncing}
        activeClass={activeClass}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        students={students}
        singleStudent={exportSingleStudent}
        teacherName={teacherName}
        activeClass={activeClass}
        academicPeriod={academicPeriod}
      />

      <ClassManagerModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        activeClass={activeClass}
        classList={classList}
        academicPeriod={academicPeriod}
        students={students}
        onSelectClass={handleSelectClass}
        onAddClass={handleAddClass}
        onRenameClass={handleRenameClass}
        onDeleteClass={handleDeleteClass}
        onUpdateAcademicPeriod={setAcademicPeriod}
        onRestoreData={handleRestoreData}
      />
    </div>
  );
}
