export function generateAppsScriptCode(spreadsheetId: string = '') {
  const codeGs = `/**
 * Google Apps Script - Antigravity Academic Management Automation
 * Spreadsheet Automation & Dashboard Data Service
 * Class 12-A • Semester 1 (Kurikulum Merdeka)
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
    tp1: Math.min(100, base - 2),
    tp2: base,
    tp3: Math.min(100, base + 2),
    tp4: base,
    tp5: Math.min(100, base + 1),
    formatif: base,
    sumatif: Math.min(100, base + 3),
    kehadiran: 95
  };
}

// 1. Initial Setup: Run this once in Apps Script to create formatted Sheet columns & sample data
function setupAcademicSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Daftar Nilai 12-A");
  
  if (!sheet) {
    sheet = ss.insertSheet("Daftar Nilai 12-A");
  }
  
  // Define Headers
  var headers = [
    ["NIS", "Nama Siswa", "JK", "Kehadiran (%)", "Matematika", "B. Indonesia", "B. Inggris", "IPAS", "PPKn", "Seni Budaya", "B. Sunda", "Kokurikuler", "Catatan Guru", "Rincian_JSON", "Terakhir Diperbarui"]
  ];
  
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers)
       .setBackground("#4C4B7C")
       .setFontColor("#FFFFFF")
       .setFontWeight("bold")
       .setHorizontalAlignment("center");
       
  // Set sample data if empty
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
      ["202412001", "Adi Saputra", "L", 96, 85, 88, 86, 82, 90, 84, 80, 88, "Aktif dalam diskusi matematika.", makeGrades(85, 88, 86, 82, 90, 84, 80, 88), new Date()],
      ["202412002", "Rina Mahendra", "P", 98, 92, 94, 90, 90, 95, 92, 88, 94, "Prestasi akademik sangat memuaskan.", makeGrades(92, 94, 90, 90, 95, 92, 88, 94), new Date()],
      ["202412003", "Bambang K.", "L", 88, 68, 75, 80, 70, 82, 78, 72, 80, "Membutuhkan bimbingan remedial.", makeGrades(68, 75, 80, 70, 82, 78, 72, 80), new Date()],
      ["202412004", "Dewi Wijaya", "P", 92, 78, 86, 88, 80, 88, 85, 82, 86, "Sangat baik dalam seni.", makeGrades(78, 86, 88, 80, 88, 85, 82, 86), new Date()],
      ["202412005", "Fajar Putra", "L", 95, 88, 90, 87, 85, 92, 86, 84, 90, "Kepemimpinan kelompok menonjol.", makeGrades(88, 90, 87, 85, 92, 86, 84, 90), new Date()],
      ["202412006", "Siti Rahmawati", "P", 97, 98, 91, 93, 95, 94, 89, 86, 92, "Nilai matematika tertinggi di kelas.", makeGrades(98, 91, 93, 95, 94, 89, 86, 92), new Date()]
    ];
    sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
  }
  
  // Format columns
  sheet.autoResizeColumns(1, headers[0].length);
  SpreadsheetApp.getUi().alert("Sheet 'Daftar Nilai 12-A' berhasil disiapkan!");
}

// 2. Web App HTTP Handler - Serves Web Dashboard
function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'getData') {
    return ContentService.createTextOutput(JSON.stringify(getAcademicData()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Daftar Nilai - Antigravity Academic Management')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 3. API Handler for POST requests (Add grade, update notes, sync)
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    if (action === 'addGrade' || action === 'updateStudent') {
      var result = saveOrUpdateStudent(data.student);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'syncAll') {
      var resultSync = batchSyncStudents(data.students);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', synced: resultSync }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 4. Read Sheet Data
function getAcademicData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Daftar Nilai 12-A");
  if (!sheet) {
    setupAcademicSheet();
    sheet = ss.getSheetByName("Daftar Nilai 12-A");
  }
  
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return { students: [], stats: {} };
  
  var students = [];
  var mathTotal = 0, highestMath = 0, totalAttendance = 0;
  
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var nis = row[0] ? row[0].toString() : '';
    if (!nis) continue;
    
    var name = row[1] || 'Siswa';
    var initials = name.split(' ').map(function(n) { return n[0]; }).join('').substr(0,2).toUpperCase();
    var attRate = Number(row[3]) || 0;

    // Parse grades breakdown JSON if present
    var gradesObj = null;
    if (row[12] && typeof row[12] === 'string' && row[12].trim().startsWith('{')) {
      try {
        gradesObj = JSON.parse(row[12]);
      } catch (err) {
        gradesObj = null;
      }
    }

    if (!gradesObj) {
      gradesObj = {
        math: Number(row[4]) || 0,
        indonesian: Number(row[5]) || 0,
        science: Number(row[6]) || 0,
        pancasila: Number(row[7]) || 0,
        arts: Number(row[8]) || 0,
        sundanese: Number(row[9]) || 0,
        cocurricular: Number(row[10]) || 0
      };
    }
    
    var mathScore = calculateSubjectFinal(gradesObj.math);
    mathTotal += mathScore;
    totalAttendance += attRate;
    if (mathScore > highestMath) highestMath = mathScore;
    
    students.push({
      id: 'sheet_' + i,
      nis: nis,
      name: name,
      avatarInitials: initials,
      gender: row[2] || 'L',
      attendanceRate: attRate,
      grades: gradesObj,
      notes: row[11] || '',
      updatedAt: 'Terbaru'
    });
  }
  
  var count = students.length;
  return {
    students: students,
    stats: {
      totalStudents: count,
      mathAvg: count > 0 ? (mathTotal / count).toFixed(1) : 0,
      highestScore: highestMath,
      attendance: count > 0 ? (totalAttendance / count).toFixed(0) + '%' : '0%'
    }
  };
}

// 5. Update or Save Student
function saveOrUpdateStudent(student) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Daftar Nilai 12-A");
  if (!sheet) {
    setupAcademicSheet();
    sheet = ss.getSheetByName("Daftar Nilai 12-A");
  }
  
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

// 6. Batch Sync Students
function batchSyncStudents(students) {
  if (!students || !Array.isArray(students)) return 0;
  var count = 0;
  for (var i = 0; i < students.length; i++) {
    if (saveOrUpdateStudent(students[i])) {
      count++;
    }
  }
  return count;
}

// 7. Automatic Trigger on Edit (Auto-calculates timestamps)
function onEdit(e) {
  var range = e.range;
  var sheet = range.getSheet();
  if (sheet.getName() === "Daftar Nilai 12-A" && range.getRow() > 1) {
    sheet.getRange(range.getRow(), 14).setValue(new Date());
  }
}
`;

  const indexHtml = `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Daftar Nilai - Antigravity Academic Management</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800">
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#4C4B7C] text-white flex flex-col justify-between p-4 shrink-0">
      <div>
        <div class="flex items-center gap-2 mb-8">
          <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold">A</div>
          <div>
            <h1 class="font-bold text-sm leading-tight">Antigravity</h1>
            <p class="text-xs text-indigo-200">Academic Management</p>
          </div>
        </div>
        <nav class="space-y-1 text-sm">
          <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#5D5B8D] font-medium">Dashboard</a>
          <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-indigo-100">Student Data</a>
          <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-indigo-100">Mathematics</a>
          <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-indigo-100">Teacher Notes</a>
        </nav>
      </div>
      <div class="pt-4 border-t border-indigo-400/30 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center">BS</div>
        <div class="text-xs">
          <p class="font-semibold text-white">Budi Santoso, M.Pd</p>
          <p class="text-indigo-200">MAIN TEACHER</p>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Academic Overview</h2>
          <p class="text-sm text-slate-500">Class 12-A • Semester 1 (2024/2025)</p>
        </div>
        <button onclick="google.script.run.withSuccessHandler(renderData).getAcademicData()" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Refresh Data</button>
      </div>

      <!-- KPI Grid -->
      <div id="kpiGrid" class="grid grid-cols-4 gap-4 mb-6">
        <div class="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">👥</div>
          <div>
            <p class="text-xs text-slate-500">Total Students</p>
            <p id="totalStudents" class="text-2xl font-bold">36</p>
          </div>
        </div>
        <div class="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">🧮</div>
          <div>
            <p class="text-xs text-slate-500">Math Avg.</p>
            <p id="mathAvg" class="text-2xl font-bold">82.5</p>
          </div>
        </div>
        <div class="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">🏆</div>
          <div>
            <p class="text-xs text-slate-500">Highest Score</p>
            <p id="highestScore" class="text-2xl font-bold">98</p>
          </div>
        </div>
        <div class="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl">✅</div>
          <div>
            <p class="text-xs text-slate-500">Attendance</p>
            <p id="attendance" class="text-2xl font-bold">94%</p>
          </div>
        </div>
      </div>
    </main>
  </div>

  <script>
    function renderData(res) {
      if (!res || !res.stats) return;
      document.getElementById('totalStudents').innerText = res.stats.totalStudents || '0';
      document.getElementById('mathAvg').innerText = res.stats.mathAvg || '0';
      document.getElementById('highestScore').innerText = res.stats.highestScore || '0';
      document.getElementById('attendance').innerText = res.stats.attendance || '0%';
    }
  </script>
</body>
</html>`;

  return { codeGs, indexHtml };
}
