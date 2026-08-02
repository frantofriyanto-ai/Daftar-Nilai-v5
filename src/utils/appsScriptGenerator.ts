export function generateAppsScriptCode(spreadsheetId: string = '') {
  const codeGs = `/**
 * Google Apps Script - Antigravity Academic Management Automation
 * Spreadsheet Automation & Dashboard Data Service
 * Multi-Kelas & Sheet Akun Guru (User Login)
 */

// Helper: Calculate final score based on Kurikulum Merdeka weights
function calculateSubjectFinal(g) {
  if (typeof g === 'number') return g;
  if (!g || typeof g !== 'object') return 0;
  var tugas = Number(g.tugas) || 0;
  var tp1 = Number(g.tp1) || 0;
  var tp2 = Number(g.tp2) || 0;
  var tp3 = Number(g.tp3) || 0;
  var tp4 = Number(g.tp4) || 0;
  var tp5 = Number(g.tp5) || 0;
  var formatif = Number(g.formatif) || 0;
  var sumatif = Number(g.sumatif) || 0;
  var kehadiran = Number(g.kehadiran) || 0;
  
  var tpAvg = (tp1 + tp2 + tp3 + tp4 + tp5) / 5;
  var finalScore = (tugas * 0.20) + (tpAvg * 0.25) + (formatif * 0.20) + (sumatif * 0.30) + (kehadiran * 0.05);
  return Math.round(finalScore * 10) / 10;
}

function makeSampleSubjectBreakdown(base) {
  return {
    tugas: base,
    tp1: Math.min(100, Math.max(0, base - 2)),
    tp2: base,
    tp3: Math.min(100, Math.max(0, base + 2)),
    tp4: base,
    tp5: Math.min(100, Math.max(0, base + 1)),
    formatif: base,
    sumatif: Math.min(100, Math.max(0, base + 3)),
    kehadiran: 95
  };
}

// 1. Initial Setup: Creates "Akun Guru" sheet and "Daftar Nilai Kelas"
function setupAcademicSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // A. Setup Sheet Akun Guru (User Login)
  var userSheet = ss.getSheetByName("Akun Guru");
  if (!userSheet) {
    userSheet = ss.insertSheet("Akun Guru");
  }
  var userHeaders = [["ID", "NIP / Username", "Nama Guru / Pengguna", "Email", "Password", "Role", "Jabatan / Title", "Kelas Binaan", "Terakhir Login"]];
  userSheet.getRange(1, 1, 1, userHeaders[0].length)
           .setValues(userHeaders)
           .setBackground("#3730A3") // Indigo
           .setFontColor("#FFFFFF")
           .setFontWeight("bold")
           .setHorizontalAlignment("center");

  if (userSheet.getLastRow() <= 1) {
    var defaultUsers = [
      ["user_guru_1", "19850315 201001 1 004", "Budi Santoso, M.Pd", "budi.santoso@sekolah.sch.id", "123456", "teacher", "Wali Kelas 12-A", "Kelas 12-A,Kelas 12-B", new Date()],
      ["user_guru_2", "19900822 201502 2 008", "Siti Nurhaliza, S.Pd", "siti.nurhaliza@sekolah.sch.id", "123456", "teacher", "Guru Mapel & Wali Kelas 11-MIPA 1", "Kelas 11-MIPA 1,Kelas 10-A", new Date()],
      ["user_admin_1", "19780512 200212 1 001", "Drs. H. Ahmad Wijaya, M.Si", "ahmad.wijaya@sekolah.sch.id", "admin123", "admin", "Kepala Sekolah & Admin Kurikulum", "Semua Kelas", new Date()],
      ["user_admin_2", "19820101 200501 1 099", "Admin Sistem Akademik", "admin@sekolah.sch.id", "admin123", "admin", "Administrator SIM Akademik", "Semua Kelas", new Date()]
    ];
    userSheet.getRange(2, 1, defaultUsers.length, defaultUsers[0].length).setValues(defaultUsers);
  }
  userSheet.autoResizeColumns(1, userHeaders[0].length);

  // B. Setup Default Class Sheet (Daftar Nilai 12-A)
  setupClassSheet(ss, "Kelas 12-A");
  setupClassSheet(ss, "Kelas 12-B");
  setupClassSheet(ss, "Kelas 11-MIPA 1");
  
  SpreadsheetApp.getUi().alert("Spreadsheet berhasil disiapkan! Sheet 'Akun Guru' dan 'Daftar Nilai Kelas' telah aktif.");
}

function setupClassSheet(ss, className) {
  var sheetName = "Daftar Nilai " + className;
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  var headers = [
    ["NIS", "Nama Siswa", "JK", "Kehadiran (%)", "Matematika", "B. Indonesia", "B. Inggris", "IPAS", "PPKn", "Seni Budaya", "B. Sunda", "Kokurikuler", "Catatan Guru", "Rincian_JSON", "Terakhir Diperbarui"]
  ];

  if (sheet.getLastRow() <= 0) {
    sheet.getRange(1, 1, 1, headers[0].length)
         .setValues(headers)
         .setBackground("#4C4B7C")
         .setFontColor("#FFFFFF")
         .setFontWeight("bold")
         .setHorizontalAlignment("center");
  }

  if (sheet.getLastRow() <= 1) {
    var makeGrades = function(m, i, eng, sc, p, a, su, c) {
      return JSON.stringify({
        math: makeSampleSubjectBreakdown(m),
        indonesian: makeSampleSubjectBreakdown(i),
        english: makeSampleSubjectBreakdown(eng),
        science: makeSampleSubjectBreakdown(sc),
        pancasila: makeSampleSubjectBreakdown(p),
        arts: makeSampleSubjectBreakdown(a),
        sundanese: makeSampleSubjectBreakdown(su),
        cocurricular: makeSampleSubjectBreakdown(c)
      });
    };

    var sampleData = [
      ["202412001", "Adi Saputra", "L", 96, 85, 88, 86, 82, 90, 84, 80, 88, "Aktif dalam diskusi kelas.", makeGrades(85, 88, 86, 82, 90, 84, 80, 88), new Date()],
      ["202412002", "Rina Mahendra", "P", 98, 92, 94, 90, 90, 95, 92, 88, 94, "Prestasi akademik memuaskan.", makeGrades(92, 94, 90, 90, 95, 92, 88, 94), new Date()],
      ["202412003", "Bambang K.", "L", 88, 68, 75, 80, 70, 82, 78, 72, 80, "Perlu bimbingan remedial.", makeGrades(68, 75, 80, 70, 82, 78, 72, 80), new Date()]
    ];
    sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
  }
  sheet.autoResizeColumns(1, headers[0].length);
  return sheet;
}

// 2. Web App HTTP GET Handler
function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'getData') {
    var targetClass = e.parameter.class || "Kelas 12-A";
    return ContentService.createTextOutput(JSON.stringify(getAcademicData(targetClass)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (e && e.parameter && e.parameter.action === 'getUsers') {
    return ContentService.createTextOutput(JSON.stringify({ users: getUserAccounts() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Daftar Nilai & User Login - Antigravity SIM Sekolah')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 3. Web App HTTP POST Handler (Sync Students & Users)
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var activeClass = data.activeClass || 'Kelas 12-A';

    if (action === 'syncAll' || action === 'updateStudent') {
      var syncedStudents = 0;
      if (data.students && Array.isArray(data.students)) {
        syncedStudents = batchSyncStudents(activeClass, data.students);
      }
      var syncedUsers = 0;
      if (data.users && Array.isArray(data.users)) {
        syncedUsers = batchSyncUsers(data.users);
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        syncedStudents: syncedStudents,
        syncedUsers: syncedUsers,
        activeClass: activeClass
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'syncUsers') {
      var count = batchSyncUsers(data.users);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', syncedUsers: count }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 4. Read Class & User Data
function getAcademicData(className) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = setupClassSheet(ss, className);

  var values = sheet.getDataRange().getValues();
  var students = [];

  if (values.length > 1) {
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var nis = row[0] ? row[0].toString() : '';
      if (!nis) continue;

      var name = row[1] || 'Siswa';
      var initials = name.split(' ').map(function(n) { return n[0]; }).join('').substr(0,2).toUpperCase();
      var attRate = Number(row[3]) || 0;

      var gradesObj = null;
      if (row[13] && typeof row[13] === 'string' && row[13].trim().startsWith('{')) {
        try {
          gradesObj = JSON.parse(row[13]);
        } catch (err) {
          gradesObj = null;
        }
      }

      if (!gradesObj) {
        gradesObj = {
          math: Number(row[4]) || 0,
          indonesian: Number(row[5]) || 0,
          english: Number(row[6]) || 0,
          science: Number(row[7]) || 0,
          pancasila: Number(row[8]) || 0,
          arts: Number(row[9]) || 0,
          sundanese: Number(row[10]) || 0,
          cocurricular: Number(row[11]) || 0
        };
      }

      students.push({
        id: 'sheet_' + className + '_' + i,
        nis: nis,
        name: name,
        avatarInitials: initials,
        gender: row[2] || 'L',
        attendanceRate: attRate,
        grades: gradesObj,
        notes: row[12] || '',
        updatedAt: 'Terbaru'
      });
    }
  }

  var usersList = getUserAccounts(ss);

  return {
    students: students,
    users: usersList,
    activeClass: className
  };
}

function getUserAccounts(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  var userSheet = ss.getSheetByName("Akun Guru");
  if (!userSheet) return [];

  var values = userSheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  var users = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var id = row[0] ? row[0].toString() : ('user_' + i);
    var nip = row[1] ? row[1].toString() : '';
    var name = row[2] || '';
    if (!nip && !name) continue;

    var assignedClassesStr = row[7] ? row[7].toString() : '';
    var assignedClasses = assignedClassesStr
      ? assignedClassesStr.split(',').map(function(c) { return c.trim(); }).filter(Boolean)
      : [];

    users.push({
      id: id,
      nip: nip,
      name: name,
      email: row[3] || '',
      role: row[5] || 'teacher',
      avatarInitials: name ? name.split(' ').map(function(n){return n[0];}).join('').substr(0,2).toUpperCase() : 'GR',
      title: row[6] || 'Guru Pengajar',
      assignedClasses: assignedClasses
    });
  }
  return users;
}

// 5. Save or Update Single Student
function saveOrUpdateStudent(className, student) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = setupClassSheet(ss, className);

  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === student.nis.toString()) {
      rowIndex = i + 1;
      break;
    }
  }

  var grades = student.grades || {};
  var mathFinal = calculateSubjectFinal(grades.math);
  var indoFinal = calculateSubjectFinal(grades.indonesian);
  var engFinal = calculateSubjectFinal(grades.english);
  var scienceFinal = calculateSubjectFinal(grades.science);
  var pancasilaFinal = calculateSubjectFinal(grades.pancasila);
  var artsFinal = calculateSubjectFinal(grades.arts);
  var sundaneseFinal = calculateSubjectFinal(grades.sundanese);
  var cocurricularFinal = calculateSubjectFinal(grades.cocurricular);

  var newRow = [
    student.nis,
    student.name,
    student.gender,
    student.attendanceRate,
    mathFinal,
    indoFinal,
    engFinal,
    scienceFinal,
    pancasilaFinal,
    artsFinal,
    sundaneseFinal,
    cocurricularFinal,
    student.notes || '',
    JSON.stringify(grades),
    new Date()
  ];

  if (rowIndex > -1) {
    sheet.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
  } else {
    sheet.appendRow(newRow);
  }
  return true;
}

function batchSyncStudents(className, students) {
  if (!students || !Array.isArray(students)) return 0;
  var count = 0;
  for (var i = 0; i < students.length; i++) {
    if (saveOrUpdateStudent(className, students[i])) {
      count++;
    }
  }
  return count;
}

// 6. Batch Sync Users to "Akun Guru" Sheet
function batchSyncUsers(users) {
  if (!users || !Array.isArray(users)) return 0;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var userSheet = ss.getSheetByName("Akun Guru");
  if (!userSheet) {
    setupAcademicSheet();
    userSheet = ss.getSheetByName("Akun Guru");
  }

  var data = userSheet.getDataRange().getValues();

  for (var u = 0; u < users.length; u++) {
    var user = users[u];
    var rowIndex = -1;

    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString() === user.id.toString() || data[i][1].toString() === user.nip.toString()) {
        rowIndex = i + 1;
        break;
      }
    }

    var assignedStr = (user.assignedClasses && Array.isArray(user.assignedClasses))
      ? user.assignedClasses.join(',')
      : (user.assignedClasses || '');

    var userRow = [
      user.id,
      user.nip,
      user.name,
      user.email,
      '123456', // default pass
      user.role,
      user.title || 'Guru Pengajar',
      assignedStr,
      new Date()
    ];

    if (rowIndex > -1) {
      userSheet.getRange(rowIndex, 1, 1, userRow.length).setValues([userRow]);
    } else {
      userSheet.appendRow(userRow);
    }
  }
  return users.length;
}
`;

  const indexHtml = `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Daftar Nilai & Login Guru - Antigravity SIM Sekolah</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 p-6">
  <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-slate-200 text-center">
    <h2 class="text-xl font-bold text-indigo-900 mb-2">Web App Google Apps Script Aktif!</h2>
    <p class="text-sm text-slate-600 mb-4">Aplikasi ini terkoneksi dengan Sheet <span class="font-bold">Akun Guru</span> dan <span class="font-bold">Daftar Nilai Multi-Kelas</span>.</p>
    <div class="inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-lg font-bold">
      Ready for Sync & User Login
    </div>
  </div>
</body>
</html>`;

  return { codeGs, indexHtml };
}

