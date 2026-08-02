import React, { useState, useEffect } from 'react';
import { AppView, Student, GradeLog, SubjectGradeBreakdown, getSubjectFinalScore, UserAccount, SubjectKKMMap, DEFAULT_SUBJECT_KKM } from './types';
import { INITIAL_STUDENTS, INITIAL_RECENT_UPDATES, getInitialStudentsForClass } from './data/mockData';
import { MOCK_USERS } from './data/mockUsers';
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
import { LoginModal } from './components/LoginModal';
import { UserManagementModal } from './components/UserManagementModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { KKMSettingsModal } from './components/KKMSettingsModal';
import { Download, Share2, FileSpreadsheet, School, ChevronDown } from 'lucide-react';

const DEFAULT_CLASSES = ['Kelas 12-A', 'Kelas 12-B', 'Kelas 11-MIPA 1', 'Kelas 10-A'];

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  
  // User Account & Role State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('antigravity_current_user');
    return saved ? JSON.parse(saved) : MOCK_USERS[0];
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMgmtModalOpen, setIsUserMgmtModalOpen] = useState(false);

  // KKM & WhatsApp Modal State
  const [kkm, setKkm] = useState<number>(() => {
    const saved = localStorage.getItem('antigravity_kkm');
    return saved ? Number(saved) : 75;
  });
  const [kkmMap, setKkmMap] = useState<SubjectKKMMap>(() => {
    const saved = localStorage.getItem('antigravity_subject_kkm_map');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECT_KKM;
  });
  const [isKkmModalOpen, setIsKkmModalOpen] = useState(false);

  const handleSaveKKMMap = (newMap: SubjectKKMMap) => {
    setKkmMap(newMap);
    localStorage.setItem('antigravity_subject_kkm_map', JSON.stringify(newMap));
  };

  const handleSaveGlobalKkm = (newKkm: number) => {
    setKkm(newKkm);
    localStorage.setItem('antigravity_kkm', String(newKkm));
  };

  const [waModalStudent, setWaModalStudent] = useState<Student | null>(null);
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);

  const handleOpenWhatsAppModal = (student: Student) => {
    setWaModalStudent(student);
    setIsWaModalOpen(true);
  };

  const [teacherName, setTeacherName] = useState<string>(() => {
    const savedUser = localStorage.getItem('antigravity_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return parsed.name || 'Budi Santoso, M.Pd';
      } catch (e) {
        // fallback
      }
    }
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('antigravity_last_sync_time') || '';
  });

  const handleUpdateTeacherName = (newName: string) => {
    setTeacherName(newName);
    localStorage.setItem('antigravity_teacher_name', newName);
    if (currentUser) {
      const updatedUser = { ...currentUser, name: newName };
      setCurrentUser(updatedUser);
      localStorage.setItem('antigravity_current_user', JSON.stringify(updatedUser));
    }
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setTeacherName(user.name);
    localStorage.setItem('antigravity_current_user', JSON.stringify(user));
    localStorage.setItem('antigravity_teacher_name', user.name);

    // Auto-switch class according to logged in teacher's assigned class
    if (user.role === 'teacher' && user.assignedClasses && user.assignedClasses.length > 0) {
      const primaryClass = user.assignedClasses[0];
      if (!classList.includes(primaryClass)) {
        const newClassList = [...classList, primaryClass];
        setClassList(newClassList);
        localStorage.setItem('antigravity_class_list', JSON.stringify(newClassList));
      }
      setActiveClass(primaryClass);
      localStorage.setItem('antigravity_active_class', primaryClass);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('antigravity_current_user');
    setIsLoginModalOpen(true);
  };

  // Real-time Push Student/Grade Update to Google Apps Script Spreadsheet
  const pushStudentToSpreadsheet = async (studentToSync: Student) => {
    if (!webAppUrl) return;
    setIsSyncing(true);
    try {
      await fetch(webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'updateStudent',
          student: studentToSync,
          activeClass: activeClass
        })
      });
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(now);
      localStorage.setItem('antigravity_last_sync_time', now);
    } catch (err) {
      console.warn('Real-time sync to spreadsheet warning:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Handlers
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);

    // Push new student to spreadsheet real-time
    pushStudentToSpreadsheet(newStudent);

    // Add log entry
    const newLog: GradeLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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
    let updatedStudentObj: Student | null = null;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updated = {
            ...s,
            grades: {
              ...s.grades,
              [subjectKey]: score
            },
            updatedAt: 'Baru saja'
          };
          updatedStudentObj = updated;
          return updated;
        }
        return s;
      })
    );

    // Sync updated student to Google Spreadsheet in real-time
    if (updatedStudentObj) {
      pushStudentToSpreadsheet(updatedStudentObj);
    }

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
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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
    pushStudentToSpreadsheet(updatedStudent);
  };

  const handleUpdateNotes = (studentId: string, notes: string) => {
    let updatedStudentObj: Student | null = null;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updated = { ...s, notes, updatedAt: 'Baru saja' };
          updatedStudentObj = updated;
          return updated;
        }
        return s;
      })
    );
    if (updatedStudentObj) {
      pushStudentToSpreadsheet(updatedStudentObj);
    }
  };

  const handleSaveWebAppUrl = (url: string) => {
    setWebAppUrl(url);
    localStorage.setItem('antigravity_webapp_url', url);
    if (url) {
      handleSyncData();
    }
  };

  const handleSyncData = async (mode: 'pull' | 'push' | 'both' = 'both') => {
    setIsSyncing(true);
    try {
      if (webAppUrl) {
        const savedUsersStr = localStorage.getItem('antigravity_users_list');
        const currentUsersList: UserAccount[] = savedUsersStr ? JSON.parse(savedUsersStr) : MOCK_USERS;

        if (mode === 'push' || mode === 'both') {
          // 1. Send current student state batch & users list to Google Sheets
          await fetch(webAppUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'syncAll',
              students: students,
              activeClass: activeClass,
              users: currentUsersList
            })
          }).catch(() => {});
        }

        if (mode === 'pull' || mode === 'both') {
          // 2. Pull updated data from Google Sheets (incorporates edits made directly in Sheets for activeClass + Akun Guru)
          const res = await fetch(`${webAppUrl}?action=getData&class=${encodeURIComponent(activeClass)}`);
          if (res.ok) {
            const json = await res.json();
            if (json.students && Array.isArray(json.students) && json.students.length > 0) {
              setStudents(json.students);
            }
            if (json.users && Array.isArray(json.users) && json.users.length > 0) {
              localStorage.setItem('antigravity_users_list', JSON.stringify(json.users));
            }
          }
        }

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncTime(now);
        localStorage.setItem('antigravity_last_sync_time', now);
      } else {
        // Simulated sync delay if no URL provided
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncTime(now);
        localStorage.setItem('antigravity_last_sync_time', now);
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
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenUserManagementModal={() => setIsUserMgmtModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)}
          onOpenKkmModal={() => setIsKkmModalOpen(true)}
          isSyncing={isSyncing}
          webAppUrl={webAppUrl}
          lastSyncTime={lastSyncTime}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          currentUser={currentUser}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenUserManagementModal={() => setIsUserMgmtModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* View Container */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {currentView === 'dashboard' && (
            <>
              {/* Academic Overview Title Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Ringkasan Akademik</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
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
                    <span className="text-[11px] font-medium text-slate-400 hidden xs:inline">(Klik untuk Ubah Kelas)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => setIsClassModalOpen(true)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 shadow-xs transition-colors cursor-pointer"
                  >
                    <School className="w-3.5 h-3.5" />
                    <span>Ubah Kelas</span>
                  </button>

                  <button
                    onClick={() => handleOpenExportModal()}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor Laporan</span>
                  </button>

                  <button
                    onClick={() => setIsAppsScriptOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0B63E5] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
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
              onOpenWhatsAppModal={handleOpenWhatsAppModal}
              activeClass={activeClass}
              kkm={kkm}
              webAppUrl={webAppUrl}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)}
              onManualSync={handleSyncData}
            />
          )}

          {currentView === 'mathematics' && (
            <SubjectDetailView
              subjectKey="math"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
              kkm={kkmMap.math ?? kkm}
              webAppUrl={webAppUrl}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)}
              onManualSync={handleSyncData}
            />
          )}

          {currentView === 'indonesian' && (
            <SubjectDetailView
              subjectKey="indonesian"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
              kkm={kkmMap.indonesian ?? kkm}
              webAppUrl={webAppUrl}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)}
              onManualSync={handleSyncData}
            />
          )}

          {currentView === 'english' && (
            <SubjectDetailView
              subjectKey="english"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
              kkm={kkmMap.english ?? kkm}
              webAppUrl={webAppUrl}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)}
              onManualSync={handleSyncData}
            />
          )}

          {currentView === 'science' && (
            <SubjectDetailView
              subjectKey="science"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
              kkm={kkmMap.science ?? kkm}
              webAppUrl={webAppUrl}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)}
              onManualSync={handleSyncData}
            />
          )}

          {currentView === 'pancasila' && (
            <SubjectDetailView
              subjectKey="pancasila"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
              kkm={kkmMap.pancasila ?? kkm}
              webAppUrl={webAppUrl}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)}
              onManualSync={handleSyncData}
            />
          )}

          {currentView === 'arts' && (
            <SubjectDetailView
              subjectKey="arts"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
              kkm={kkmMap.arts ?? kkm}
              webAppUrl={webAppUrl}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)}
              onManualSync={handleSyncData}
            />
          )}

          {currentView === 'sundanese' && (
            <SubjectDetailView
              subjectKey="sundanese"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
              kkm={kkmMap.sundanese ?? kkm}
              webAppUrl={webAppUrl}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)}
              onManualSync={handleSyncData}
            />
          )}

          {currentView === 'cocurricular' && (
            <SubjectDetailView
              subjectKey="cocurricular"
              students={students}
              onUpdateGrade={handleUpdateGrade}
              activeClass={activeClass}
              kkm={kkmMap.cocurricular ?? kkm}
              webAppUrl={webAppUrl}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)}
              onManualSync={handleSyncData}
            />
          )}

          {currentView === 'notes' && (
            <TeacherNotesView
              students={students}
              onUpdateNotes={handleUpdateNotes}
              onOpenWhatsAppModal={handleOpenWhatsAppModal}
              teacherName={teacherName}
              activeClass={activeClass}
              kkm={kkm}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <KKMSettingsModal
        isOpen={isKkmModalOpen}
        onClose={() => setIsKkmModalOpen(false)}
        kkmMap={kkmMap}
        onSaveKKMMap={handleSaveKKMMap}
        globalKkm={kkm}
        onSaveGlobalKkm={handleSaveGlobalKkm}
      />
      <WhatsAppModal
        isOpen={isWaModalOpen}
        onClose={() => setIsWaModalOpen(false)}
        student={waModalStudent}
        teacherName={teacherName}
        activeClass={activeClass}
        kkm={kkm}
      />
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
        kkm={kkm}
        students={students}
        onSelectClass={handleSelectClass}
        onAddClass={handleAddClass}
        onRenameClass={handleRenameClass}
        onDeleteClass={handleDeleteClass}
        onUpdateAcademicPeriod={setAcademicPeriod}
        onUpdateKKM={(newKkm) => { setKkm(newKkm); localStorage.setItem('antigravity_kkm', String(newKkm)); }}
        onRestoreData={handleRestoreData}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
      />

      <UserManagementModal
        isOpen={isUserMgmtModalOpen}
        onClose={() => setIsUserMgmtModalOpen(false)}
        currentUser={currentUser}
        webAppUrl={webAppUrl}
        onSyncData={handleSyncData}
        isSyncing={isSyncing}
      />
    </div>
  );
}
