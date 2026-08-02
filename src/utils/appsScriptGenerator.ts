export function generateAppsScriptCode(spreadsheetId: string = '') {
  const codeGs = `/**
 * Google Apps Script - Antigravity Academic Management Automation
 * Spreadsheet Automation & Dashboard Data Service
 * Multi-Kelas, Akun Guru (User Login), & Rincian Nilai Komponen per Mata Pelajaran
 */

// Global Subject Configuration Mapping
var SUBJECT_CONFIG = [
  { key: 'math', name: 'Matematika', col: 5 },
  { key: 'indonesian', name: 'B. Indonesia', col: 6 },
  { key: 'english', name: 'B. Inggris', col: 7 },
  { key: 'science', name: 'IPAS', col: 8 },
  { key: 'pancasila', name: 'PPKn', col: 9 },
  { key: 'arts', name: 'Seni Budaya', col: 10 },
  { key: 'sundanese', name: 'B. Sunda', col: 11 },
  { key: 'cocurricular', name: 'Kokurikuler', col: 12 }
];

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

function normalizeBreakdown(g, fallback) {
  if (!fallback) fallback = 80;
  if (typeof g === 'number') {
    return makeSampleSubjectBreakdown(g);
  }
  if (!g || typeof g !== 'object') {
    return makeSampleSubjectBreakdown(fallback);
  }
  return {
    tugas: Number(g.tugas) || fallback,
    tp1: Number(g.tp1) || fallback,
    tp2: Number(g.tp2) || fallback,
    tp3: Number(g.tp3) || fallback,
    tp4: Number(g.tp4) || fallback,
    tp5: Number(g.tp5) || fallback,
    formatif: Number(g.formatif) || fallback,
    sumatif: Number(g.sumatif) || fallback,
    kehadiran: Number(g.kehadiran) || 95
  };
}

// 1. Initial Setup: Creates "Akun Guru" sheet, "Daftar Nilai Kelas", & "Rincian Komponen"
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
      ["user_guru_1", "19850315 201001 1 004", "Budi Santoso, M.Pd", "budi.santoso@sekolah.sch.id", "123456", "teacher", "Wali Kelas 12-A", "Kelas 12-A", new Date()],
      ["user_guru_2", "19900822 201502 2 008", "Siti Nurhaliza, S.Pd", "siti.nurhaliza@sekolah.sch.id", "123456", "teacher", "Wali Kelas 11-MIPA 1", "Kelas 11-MIPA 1", new Date()],
      ["user_admin_1", "19780512 200212 1 001", "Drs. H. Ahmad Wijaya, M.Si", "ahmad.wijaya@sekolah.sch.id", "admin123", "admin", "Kepala Sekolah & Admin Kurikulum", "Semua Kelas", new Date()],
      ["user_admin_2", "19820101 200501 1 099", "Admin Sistem Akademik", "admin@sekolah.sch.id", "admin123", "admin", "Administrator SIM Akademik", "Semua Kelas", new Date()]
    ];
    userSheet.getRange(2, 1, defaultUsers.length, defaultUsers[0].length).setValues(defaultUsers);
  }
  userSheet.autoResizeColumns(1, userHeaders[0].length);

  // B. Setup Default Class Sheets & Component Breakdown Sheets
  setupClassSheet(ss, "Kelas 12-A");
  setupClassSheet(ss, "Kelas 12-B");
  setupClassSheet(ss, "Kelas 11-MIPA 1");
  
  SpreadsheetApp.getUi().alert("Spreadsheet berhasil disiapkan! Sheet 'Akun Guru', 'Daftar Nilai Kelas', dan 'Rincian Nilai Komponen' per mata pelajaran telah aktif.");
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

  // Setup Subject Detail Sheets
  for (var k = 0; k < SUBJECT_CONFIG.length; k++) {
    setupSubjectBreakdownSheet(ss, className, SUBJECT_CONFIG[k].name);
  }

  return sheet;
}

function setupSubjectBreakdownSheet(ss, className, subjectName) {
  var sheetName = "Rincian " + subjectName + " (" + className + ")";
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  var headers = [
    ["NIS", "Nama Siswa", "Tugas (20%)", "TP1", "TP2", "TP3", "TP4", "TP5", "Formatif (20%)", "Sumatif (30%)", "Kehadiran (5%)", "Nilai Akhir", "Terakhir Diperbarui"]
  ];
  if (sheet.getLastRow() <= 0) {
    sheet.getRange(1, 1, 1, headers[0].length)
         .setValues(headers)
         .setBackground("#3730A3")
         .setFontColor("#FFFFFF")
         .setFontWeight("bold")
         .setHorizontalAlignment("center");
  }
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

// 4. Read Class & User Data (Incorporating Rincian Komponen Sheets)
function getAcademicData(className) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = setupClassSheet(ss, className);

  var values = sheet.getDataRange().getValues();
  var students = [];
  var studentMapByNis = {};

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
        gradesObj = {};
      }

      // Reconcile direct cell edits in Summary Sheet with gradesObj
      for (var s = 0; s < SUBJECT_CONFIG.length; s++) {
        var item = SUBJECT_CONFIG[s];
        var cellVal = row[item.col - 1];
        if (cellVal !== '' && cellVal !== null && cellVal !== undefined && !isNaN(Number(cellVal))) {
          var numVal = Number(cellVal);
          if (gradesObj[item.key]) {
            var currentCalc = calculateSubjectFinal(gradesObj[item.key]);
            if (Math.abs(currentCalc - numVal) > 0.05) {
              gradesObj[item.key] = makeSampleSubjectBreakdown(numVal);
            }
          } else {
            gradesObj[item.key] = makeSampleSubjectBreakdown(numVal);
          }
        } else if (!gradesObj[item.key]) {
          gradesObj[item.key] = makeSampleSubjectBreakdown(80);
        }
      }

      var stObj = {
        id: 'sheet_' + className + '_' + i,
        nis: nis,
        name: name,
        avatarInitials: initials,
        gender: row[2] || 'L',
        attendanceRate: attRate,
        grades: gradesObj,
        notes: row[12] || '',
        updatedAt: 'Terbaru'
      };

      students.push(stObj);
      studentMapByNis[nis] = stObj;
    }
  }

  // Read actual Component Breakdown values from Rincian [Subject] ([Class]) Sheets
  for (var k = 0; k < SUBJECT_CONFIG.length; k++) {
    var subj = SUBJECT_CONFIG[k];
    var sSheet = ss.getSheetByName("Rincian " + subj.name + " (" + className + ")");
    if (sSheet && sSheet.getLastRow() > 1) {
      var sValues = sSheet.getDataRange().getValues();
      for (var r = 1; r < sValues.length; r++) {
        var sRow = sValues[r];
        var sNis = sRow[0] ? sRow[0].toString() : '';
        if (!sNis || !studentMapByNis[sNis]) continue;

        var bObj = {
          tugas: Number(sRow[2]) || 0,
          tp1: Number(sRow[3]) || 0,
          tp2: Number(sRow[4]) || 0,
          tp3: Number(sRow[5]) || 0,
          tp4: Number(sRow[6]) || 0,
          tp5: Number(sRow[7]) || 0,
          formatif: Number(sRow[8]) || 0,
          sumatif: Number(sRow[9]) || 0,
          kehadiran: Number(sRow[10]) || 0
        };

        studentMapByNis[sNis].grades[subj.key] = bObj;
      }
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

// 5. Save or Update Single Student (Populates Summary & Rincian Komponen Sheets)
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

  // Ensure normalized component breakdown for every subject
  var normalizedGrades = {};
  for (var k = 0; k < SUBJECT_CONFIG.length; k++) {
    var key = SUBJECT_CONFIG[k].key;
    normalizedGrades[key] = normalizeBreakdown(grades[key], 80);
  }

  var mathFinal = calculateSubjectFinal(normalizedGrades.math);
  var indoFinal = calculateSubjectFinal(normalizedGrades.indonesian);
  var engFinal = calculateSubjectFinal(normalizedGrades.english);
  var scienceFinal = calculateSubjectFinal(normalizedGrades.science);
  var pancasilaFinal = calculateSubjectFinal(normalizedGrades.pancasila);
  var artsFinal = calculateSubjectFinal(normalizedGrades.arts);
  var sundaneseFinal = calculateSubjectFinal(normalizedGrades.sundanese);
  var cocurricularFinal = calculateSubjectFinal(normalizedGrades.cocurricular);

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
    JSON.stringify(normalizedGrades),
    new Date()
  ];

  if (rowIndex > -1) {
    sheet.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
  } else {
    sheet.appendRow(newRow);
  }

  // Populate Rincian Komponen Sheets for every subject
  for (var s = 0; s < SUBJECT_CONFIG.length; s++) {
    var subj = SUBJECT_CONFIG[s];
    var b = normalizedGrades[subj.key];
    var sFinal = calculateSubjectFinal(b);

    var subjSheet = setupSubjectBreakdownSheet(ss, className, subj.name);
    var sData = subjSheet.getDataRange().getValues();
    var sRowIdx = -1;

    for (var r = 1; r < sData.length; r++) {
      if (sData[r][0].toString() === student.nis.toString()) {
        sRowIdx = r + 1;
        break;
      }
    }

    var sRow = [
      student.nis,
      student.name,
      b.tugas,
      b.tp1,
      b.tp2,
      b.tp3,
      b.tp4,
      b.tp5,
      b.formatif,
      b.sumatif,
      b.kehadiran,
      sFinal,
      new Date()
    ];

    if (sRowIdx > -1) {
      subjSheet.getRange(sRowIdx, 1, 1, sRow.length).setValues([sRow]);
    } else {
      subjSheet.appendRow(sRow);
    }
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

// 7. Automatic Trigger on Edit (Auto-calculates timestamps & updates JSON + Rincian Komponen when cells are edited)
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    var range = e.range;
    var sheet = range.getSheet();
    var sheetName = sheet.getName();
    var row = range.getRow();

    if (row <= 1) return;

    // A. Edit on Rincian [Subject] ([Class]) sheet
    if (sheetName.indexOf("Rincian ") === 0) {
      sheet.getRange(row, 13).setValue(new Date());

      var rData = sheet.getRange(row, 1, 1, 12).getValues()[0];
      var nis = rData[0].toString();
      if (!nis) return;

      var b = {
        tugas: Number(rData[2]) || 0,
        tp1: Number(rData[3]) || 0,
        tp2: Number(rData[4]) || 0,
        tp3: Number(rData[5]) || 0,
        tp4: Number(rData[6]) || 0,
        tp5: Number(rData[7]) || 0,
        formatif: Number(rData[8]) || 0,
        sumatif: Number(rData[9]) || 0,
        kehadiran: Number(rData[10]) || 0
      };

      var newFinal = calculateSubjectFinal(b);
      sheet.getRange(row, 12).setValue(newFinal);

      // Extract class name & subject name from sheet title "Rincian [Subject] ([Class])"
      var openParen = sheetName.lastIndexOf("(");
      var closeParen = sheetName.lastIndexOf(")");
      if (openParen > 0 && closeParen > openParen) {
        var className = sheetName.substring(openParen + 1, closeParen);
        var subjectName = sheetName.substring(8, openParen).trim();

        // Find subject config
        var subjConfig = null;
        for (var s = 0; s < SUBJECT_CONFIG.length; s++) {
          if (SUBJECT_CONFIG[s].name === subjectName) {
            subjConfig = SUBJECT_CONFIG[s];
            break;
          }
        }

        if (subjConfig) {
          var ss = SpreadsheetApp.getActiveSpreadsheet();
          var summarySheet = ss.getSheetByName("Daftar Nilai " + className);
          if (summarySheet) {
            var sumData = summarySheet.getDataRange().getValues();
            for (var i = 1; i < sumData.length; i++) {
              if (sumData[i][0].toString() === nis) {
                var sumRowIdx = i + 1;
                summarySheet.getRange(sumRowIdx, subjConfig.col).setValue(newFinal);
                summarySheet.getRange(sumRowIdx, 15).setValue(new Date());

                var gradesObj = {};
                if (sumData[i][13] && typeof sumData[i][13] === 'string' && sumData[i][13].trim().startsWith('{')) {
                  try { gradesObj = JSON.parse(sumData[i][13]); } catch (err) { gradesObj = {}; }
                }
                gradesObj[subjConfig.key] = b;
                summarySheet.getRange(sumRowIdx, 14).setValue(JSON.stringify(gradesObj));
                break;
              }
            }
          }
        }
      }
    }

    // B. Edit on Summary "Daftar Nilai [Class]" sheet
    if (sheetName.indexOf("Daftar Nilai ") === 0) {
      sheet.getRange(row, 15).setValue(new Date());

      var col = range.getColumn();
      if (col >= 5 && col <= 12) {
        var rowData = sheet.getRange(row, 1, 1, 14).getValues()[0];
        var gradesObj = {};
        if (rowData[13] && typeof rowData[13] === 'string' && rowData[13].trim().startsWith('{')) {
          try { gradesObj = JSON.parse(rowData[13]); } catch (err) { gradesObj = {}; }
        }

        for (var sc = 0; sc < SUBJECT_CONFIG.length; sc++) {
          var item = SUBJECT_CONFIG[sc];
          var val = Number(rowData[item.col - 1]);
          if (!isNaN(val) && rowData[item.col - 1] !== '') {
            var currCalc = calculateSubjectFinal(gradesObj[item.key]);
            if (Math.abs(currCalc - val) > 0.05 || !gradesObj[item.key]) {
              gradesObj[item.key] = makeSampleSubjectBreakdown(val);
            }
          }
        }
        sheet.getRange(row, 14).setValue(JSON.stringify(gradesObj));
      }
    }
  } catch (err) {
    // ignore
  }
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
    <p class="text-sm text-slate-600 mb-4">Aplikasi ini terkoneksi dengan Sheet <span class="font-bold">Akun Guru</span>, <span class="font-bold">Daftar Nilai Multi-Kelas</span>, dan <span class="font-bold">Rincian Nilai Komponen</span> per mata pelajaran.</p>
    <div class="inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-lg font-bold">
      Ready for Sync, Component Grades, & User Login
    </div>
  </div>
</body>
</html>`;

  return { codeGs, indexHtml };
}


