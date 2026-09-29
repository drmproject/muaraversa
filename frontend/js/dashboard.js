// MUARAVERSA DIGITAL SCHOOL ECOSYSTEM - FRONTEND CONTROLLER
// Version 1.0 Production Architecture

let currentRole = 'ADMIN';
let currentUser = null;
let currentToken = localStorage.getItem('muaraversa_token') || 'admin_token_default';

let appData = {
  school: null,
  teachers: [],
  students: [],
  classes: [],
  subjects: [],
  schedules: [],
  materials: [],
  assignments: [],
  submissions: [],
  quizzes: [],
  grades: [],
  studentAttendance: [],
  teacherAttendance: [],
  announcements: [],
  messages: [],
  letters: [],
  archives: [],
  users: [],
  auditLogs: []
};

// Active CBT Session State
let activeCbtQuiz = null;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  await checkSession();
  await loadAllData();
});

// Helper for API fetch with auth token
async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${currentToken}`,
    ...(options.headers || {})
  };
  try {
    const res = await fetch(path, { ...options, headers });
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${path}:`, err);
    return { success: false, message: err.message };
  }
}

// Session checking
async function checkSession() {
  const res = await api('/api/auth/me');
  if (res && res.user) {
    currentUser = res.user;
    currentRole = res.user.role;
    updateUserUI();
  }
}

function updateUserUI() {
  const roleBadge = document.getElementById('currentRoleBadge');
  const nameLabel = document.getElementById('userNameLabel');
  const avatar = document.getElementById('userAvatar');
  const greeting = document.getElementById('dashboardGreeting');

  if (roleBadge) {
    roleBadge.textContent = currentRole;
    roleBadge.className = 'role-pill ' + currentRole.toLowerCase().replace('_', '');
  }
  if (nameLabel && currentUser) {
    nameLabel.textContent = currentUser.name;
  }
  if (avatar && currentUser) {
    avatar.textContent = currentUser.avatar || '👤';
  }
  if (greeting && currentUser) {
    greeting.textContent = `Selamat datang kembali, ${currentUser.name}! Anda sedang mengelola platform dalam mode ${currentRole}.`;
  }

  // Update Persona Switcher Bar Active State
  const buttons = document.querySelectorAll('.persona-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick')?.includes(currentRole)) {
      btn.classList.add('active');
    }
  });

  // Filter sidebar items according to RBAC
  document.querySelectorAll('.sidebar-nav [data-roles]').forEach(el => {
    const allowed = el.getAttribute('data-roles').split(',');
    if (allowed.includes(currentRole) || currentRole === 'SUPER_ADMIN') {
      el.style.display = 'flex';
    } else {
      el.style.display = 'none';
    }
  });
}

// Persona Switcher for Quick Demo & Multi-Role Evaluation
async function switchRole(role) {
  const res = await api('/api/auth/switch-demo-role', {
    method: 'POST',
    body: JSON.stringify({ role })
  });

  if (res && res.success) {
    currentToken = res.token;
    localStorage.setItem('muaraversa_token', res.token);
    currentUser = res.user;
    currentRole = res.user.role;
    updateUserUI();
    showToast(`Beralih ke persona: ${res.user.name} (${role})`);
    await loadAllData();
  } else {
    alert(res.message || 'Gagal berganti persona');
  }
}

// Logout handler
async function handleLogout() {
  await api('/api/auth/logout', { method: 'POST' });
  localStorage.removeItem('muaraversa_token');
  window.location.href = '/login.html';
}

// Mobile sidebar toggle
function toggleSidebar() {
  const sidebar = document.getElementById('appSidebar');
  sidebar.classList.toggle('mobile-open');
}

// Navigation switcher
function showSection(sectionId, targetElement = null) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.style.display = 'none';
  });

  // Show target
  const target = document.getElementById('section-' + sectionId);
  if (target) {
    target.style.display = 'block';
  }

  // Update active state in sidebar
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.classList.remove('active');
  });

  if (targetElement) {
    targetElement.classList.add('active');
  } else {
    const autoNav = Array.from(document.querySelectorAll('.sidebar-nav .nav-item')).find(item =>
      item.getAttribute('onclick')?.includes(`'${sectionId}'`)
    );
    if (autoNav) autoNav.classList.add('active');
  }

  // Scroll to top of main
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load all system data
async function loadAllData() {
  try {
    const [
      statsRes, schoolRes, teachersRes, studentsRes, classesRes, subjectsRes,
      schedulesRes, materialsRes, assignmentsRes, submissionsRes, quizzesRes,
      gradesRes, studentAttRes, teacherAttRes, announcementsRes, messagesRes,
      lettersRes, archivesRes, usersRes, auditRes
    ] = await Promise.all([
      api('/api/dashboard'),
      api('/api/school'),
      api('/api/teachers'),
      api('/api/students'),
      api('/api/classes'),
      api('/api/subjects'),
      api('/api/schedules'),
      api('/api/materials'),
      api('/api/assignments'),
      api('/api/submissions'),
      api('/api/quizzes'),
      api('/api/grades'),
      api('/api/attendance/students'),
      api('/api/attendance/teachers'),
      api('/api/announcements'),
      api('/api/messages'),
      api('/api/admin/letters'),
      api('/api/admin/archives'),
      api('/api/users'),
      api('/api/audit-logs')
    ]);

    if (schoolRes && schoolRes.school) {
      appData.school = schoolRes.school;
      renderSchoolProfile(schoolRes.school);
    }
    if (statsRes) renderDashboardStats(statsRes);
    if (teachersRes && teachersRes.teachers) {
      appData.teachers = teachersRes.teachers;
      renderTeachers(teachersRes.teachers);
    }
    if (studentsRes && studentsRes.students) {
      appData.students = studentsRes.students;
      renderStudents(studentsRes.students);
    }
    if (classesRes && classesRes.classes) {
      appData.classes = classesRes.classes;
      renderClasses(classesRes.classes);
      populateClassFilter(classesRes.classes);
    }
    if (subjectsRes && subjectsRes.data) {
      appData.subjects = subjectsRes.data;
      renderSubjects(subjectsRes.data);
    }
    if (schedulesRes && schedulesRes.schedules) {
      appData.schedules = schedulesRes.schedules;
      renderSchedules(schedulesRes.schedules);
    }
    if (materialsRes && materialsRes.materials) {
      appData.materials = materialsRes.materials;
      renderMaterials(materialsRes.materials);
    }
    if (assignmentsRes && assignmentsRes.assignments) {
      appData.assignments = assignmentsRes.assignments;
      renderAssignments(assignmentsRes.assignments);
    }
    if (submissionsRes && submissionsRes.submissions) {
      appData.submissions = submissionsRes.submissions;
      renderSubmissions(submissionsRes.submissions);
    }
    if (quizzesRes && quizzesRes.quizzes) {
      appData.quizzes = quizzesRes.quizzes;
      renderQuizzes(quizzesRes.quizzes);
    }
    if (gradesRes && gradesRes.grades) {
      appData.grades = gradesRes.grades;
      renderGrades(gradesRes.grades);
    }
    if (studentAttRes && studentAttRes.attendance) {
      appData.studentAttendance = studentAttRes.attendance;
      renderStudentAttendance(studentAttRes.attendance);
    }
    if (teacherAttRes && teacherAttRes.attendance) {
      appData.teacherAttendance = teacherAttRes.attendance;
      renderTeacherAttendance(teacherAttRes.attendance);
    }
    if (announcementsRes && announcementsRes.announcements) {
      appData.announcements = announcementsRes.announcements;
      renderAnnouncements(announcementsRes.announcements);
    }
    if (messagesRes && messagesRes.messages) {
      appData.messages = messagesRes.messages;
      renderMessages(messagesRes.messages);
    }
    if (lettersRes && lettersRes.letters) {
      appData.letters = lettersRes.letters;
      renderLetters(lettersRes.letters);
    }
    if (archivesRes && archivesRes.archives) {
      appData.archives = archivesRes.archives;
      renderArchives(archivesRes.archives);
    }
    if (usersRes && usersRes.users) {
      appData.users = usersRes.users;
      renderUsers(usersRes.users);
    }
    if (auditRes && auditRes.logs) {
      appData.auditLogs = auditRes.logs;
      renderAuditLogs(auditRes.logs);
    }

    populateAiStudentSelect();
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

// 1. Dashboard Stats
function renderDashboardStats(stats) {
  if (document.getElementById('statGuru')) document.getElementById('statGuru').textContent = stats.total_guru || 0;
  if (document.getElementById('statSiswa')) document.getElementById('statSiswa').textContent = stats.total_siswa || 0;
  if (document.getElementById('statKelas')) document.getElementById('statKelas').textContent = stats.total_kelas || 0;
  if (document.getElementById('statPresensi')) document.getElementById('statPresensi').textContent = (stats.metrics?.attendance_rate || 98) + '%';
  if (document.getElementById('schoolSubtitle') && stats.sekolah) {
    document.getElementById('schoolSubtitle').textContent = stats.sekolah.name || stats.sekolah.school_name || 'Muaraversa';
  }
}

// 2. School Profile
function renderSchoolProfile(s) {
  if (!s) return;
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };
  setVal('formSchoolName', s.name || s.school_name);
  setVal('formSchoolNpsn', s.npsn);
  setVal('formSchoolPrincipal', s.principal_name);
  setVal('formSchoolPrincipalNip', s.principal_nip);
  setVal('formSchoolAddress', s.address);
  setVal('formSchoolPhone', s.phone);
  setVal('formSchoolEmail', s.email);
  setVal('formSchoolWebsite', s.website);
  if (document.getElementById('formSchoolAccreditation')) {
    document.getElementById('formSchoolAccreditation').value = s.accreditation || 'A';
  }
}

async function saveSchoolProfile() {
  const body = {
    name: document.getElementById('formSchoolName')?.value,
    npsn: document.getElementById('formSchoolNpsn')?.value,
    principal_name: document.getElementById('formSchoolPrincipal')?.value,
    principal_nip: document.getElementById('formSchoolPrincipalNip')?.value,
    address: document.getElementById('formSchoolAddress')?.value,
    phone: document.getElementById('formSchoolPhone')?.value,
    email: document.getElementById('formSchoolEmail')?.value,
    website: document.getElementById('formSchoolWebsite')?.value,
    accreditation: document.getElementById('formSchoolAccreditation')?.value
  };

  const res = await api('/api/school', {
    method: 'POST',
    body: JSON.stringify(body)
  });

  if (res && res.success) {
    showToast('Profil sekolah berhasil disimpan!');
    await loadAllData();
  } else {
    alert(res.message || 'Gagal menyimpan profil');
  }
}

// 3. Teachers
function renderTeachers(list) {
  const tbody = document.getElementById('teacherTableBody');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8">Belum ada data guru.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map((t, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong>${t.name}</strong></td>
      <td>${t.nip || '-'}</td>
      <td><span class="badge badge-info">${t.subject || 'Guru Kelas'}</span></td>
      <td><span class="badge badge-success">${t.status || 'PNS'}</span></td>
      <td>${t.phone || t.email || '-'}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editTeacher(${t.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTeacher(${t.id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function openAddTeacherModal() {
  showGenericModal('Tambah Tenaga Pendidik (Guru)', `
    <form onsubmit="event.preventDefault(); submitAddTeacher();">
      <div class="form-group">
        <label class="form-label">Nama Lengkap & Gelar</label>
        <input class="form-control" id="mTeacherName" required placeholder="Contoh: Budi Santoso, S.Pd">
      </div>
      <div class="form-group">
        <label class="form-label">NIP (Nomor Induk Pegawai)</label>
        <input class="form-control" id="mTeacherNip" placeholder="198501012010011001">
      </div>
      <div class="form-group">
        <label class="form-label">Mata Pelajaran yang Diampu</label>
        <input class="form-control" id="mTeacherSubject" placeholder="Matematika / Guru Kelas">
      </div>
      <div class="form-group">
        <label class="form-label">Status Kepegawaian</label>
        <select class="form-control" id="mTeacherStatus">
          <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
          <option value="PPPK">PPPK</option>
          <option value="Honorer">Guru Tetap Yayasan / Honorer</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Nomor Telepon / WhatsApp</label>
        <input class="form-control" id="mTeacherPhone" placeholder="0812xxxx">
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Simpan Guru</button>
    </form>
  `);
}

async function submitAddTeacher() {
  const body = {
    name: document.getElementById('mTeacherName')?.value,
    nip: document.getElementById('mTeacherNip')?.value,
    subject: document.getElementById('mTeacherSubject')?.value,
    status: document.getElementById('mTeacherStatus')?.value,
    phone: document.getElementById('mTeacherPhone')?.value
  };

  const res = await api('/api/teachers', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Guru berhasil ditambahkan!');
    await loadAllData();
  } else {
    alert(res.message || 'Gagal menambahkan guru');
  }
}

async function deleteTeacher(id) {
  if (!confirm('Yakin ingin menghapus guru ini?')) return;
  const res = await api(`/api/teachers/${id}`, { method: 'DELETE' });
  if (res && res.success) {
    showToast('Guru dihapus');
    await loadAllData();
  }
}

// 4. Students
function renderStudents(list) {
  const tbody = document.getElementById('studentTableBody');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#94a3b8">Belum ada data siswa.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map((s, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong>${s.name}</strong></td>
      <td>${s.nis} / <small>${s.nisn || '-'}</small></td>
      <td><span class="badge badge-info">${s.class || 'Kelas 1-A'}</span></td>
      <td>${s.gender === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}</td>
      <td>${s.parent_name || 'H. Hendra Gunawan'}</td>
      <td><span class="badge badge-success">${s.status || 'Aktif'}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="viewDigitalReport(${s.id})">E-Raport</button>
        <button class="btn btn-danger btn-sm" onclick="deleteStudent(${s.id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function filterStudents() {
  const keyword = (document.getElementById('studentSearchInput')?.value || '').toLowerCase();
  const classFilter = document.getElementById('studentClassFilter')?.value;

  const filtered = appData.students.filter(s => {
    const matchName = s.name.toLowerCase().includes(keyword) || s.nis.includes(keyword);
    const matchClass = !classFilter || s.class_id === Number(classFilter);
    return matchName && matchClass;
  });
  renderStudents(filtered);
}

function populateClassFilter(classes) {
  const sel = document.getElementById('studentClassFilter');
  if (!sel) return;
  sel.innerHTML = '<option value="">Semua Kelas</option>' + classes.map(c => `
    <option value="${c.id}">${c.name}</option>
  `).join('');
}

function openAddStudentModal() {
  const classOptions = appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  showGenericModal('Tambah Peserta Didik Baru', `
    <form onsubmit="event.preventDefault(); submitAddStudent();">
      <div class="form-group">
        <label class="form-label">Nama Lengkap Siswa</label>
        <input class="form-control" id="mStudentName" required placeholder="Ahmad Fauzi">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">NIS (Nomor Induk Siswa)</label>
          <input class="form-control" id="mStudentNis" required placeholder="1004">
        </div>
        <div class="form-group">
          <label class="form-label">NISN (Nasional)</label>
          <input class="form-control" id="mStudentNisn" placeholder="0087654324">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Rombel / Kelas</label>
          <select class="form-control" id="mStudentClassId">${classOptions}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Jenis Kelamin</label>
          <select class="form-control" id="mStudentGender">
            <option value="L">Laki-laki (L)</option>
            <option value="P">Perempuan (P)</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Nama Orang Tua / Wali</label>
        <input class="form-control" id="mStudentParentName" placeholder="Bapak / Ibu Wali">
      </div>
      <div class="form-group">
        <label class="form-label">Alamat Rumah</label>
        <input class="form-control" id="mStudentAddress" placeholder="Kota Bogor">
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Simpan Data Siswa</button>
    </form>
  `);
}

async function submitAddStudent() {
  const body = {
    name: document.getElementById('mStudentName')?.value,
    nis: document.getElementById('mStudentNis')?.value,
    nisn: document.getElementById('mStudentNisn')?.value,
    class_id: document.getElementById('mStudentClassId')?.value,
    gender: document.getElementById('mStudentGender')?.value,
    parent_name: document.getElementById('mStudentParentName')?.value,
    address: document.getElementById('mStudentAddress')?.value
  };

  const res = await api('/api/students', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Siswa berhasil didaftarkan!');
    await loadAllData();
  } else {
    alert(res.message || 'Gagal mendaftar siswa');
  }
}

async function deleteStudent(id) {
  if (!confirm('Yakin ingin menghapus data siswa ini?')) return;
  const res = await api(`/api/students/${id}`, { method: 'DELETE' });
  if (res && res.success) {
    showToast('Siswa dihapus');
    await loadAllData();
  }
}

// 5. Classes
function renderClasses(list) {
  const tbody = document.getElementById('classTableBody');
  if (!tbody) return;
  tbody.innerHTML = list.map((c, idx) => {
    const studentCount = appData.students.filter(s => s.class_id === c.id).length;
    return `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${c.name}</strong></td>
        <td><span class="badge badge-info">Tingkat ${c.grade || c.tingkat || '1'}</span></td>
        <td>${c.room || 'Ruang Kelas'}</td>
        <td>👨‍🏫 ${c.teacher || c.wali_kelas || '-'}</td>
        <td>${studentCount} Siswa</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="editClass(${c.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteClass(${c.id})">Hapus</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddClassModal() {
  const teacherOpts = appData.teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  showGenericModal('Tambah Rombongan Belajar (Kelas)', `
    <form onsubmit="event.preventDefault(); submitAddClass();">
      <div class="form-group">
        <label class="form-label">Nama Kelas / Rombel</label>
        <input class="form-control" id="mClassName" required placeholder="Contoh: Kelas 2-B">
      </div>
      <div class="form-group">
        <label class="form-label">Tingkatan</label>
        <select class="form-control" id="mClassGrade">
          <option value="1">Kelas 1</option>
          <option value="2">Kelas 2</option>
          <option value="3">Kelas 3</option>
          <option value="4">Kelas 4</option>
          <option value="5">Kelas 5</option>
          <option value="6">Kelas 6</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Ruang Kelas</label>
        <input class="form-control" id="mClassRoom" placeholder="Ruang 202">
      </div>
      <div class="form-group">
        <label class="form-label">Wali Kelas</label>
        <select class="form-control" id="mClassTeacherId">${teacherOpts}</select>
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Simpan Kelas</button>
    </form>
  `);
}

async function submitAddClass() {
  const body = {
    name: document.getElementById('mClassName')?.value,
    grade: document.getElementById('mClassGrade')?.value,
    room: document.getElementById('mClassRoom')?.value,
    teacher_id: document.getElementById('mClassTeacherId')?.value
  };

  const res = await api('/api/classes', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Kelas berhasil dibuat!');
    await loadAllData();
  }
}

async function deleteClass(id) {
  if (!confirm('Yakin ingin menghapus kelas ini?')) return;
  const res = await api(`/api/classes/${id}`, { method: 'DELETE' });
  if (res && res.success) {
    showToast('Kelas dihapus');
    await loadAllData();
  }
}

// 6. Subjects
function renderSubjects(list) {
  const tbody = document.getElementById('subjectTableBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(s => `
    <tr>
      <td><code>${s.code}</code></td>
      <td><strong>${s.name}</strong></td>
      <td><span class="badge badge-info">${s.category || 'Wajib'}</span></td>
      <td><strong>${s.kkm || 75}</strong></td>
      <td>${appData.teachers.filter(t => (t.subject || '').includes(s.name.split(' ')[0])).map(t => t.name).join(', ') || 'Semua Guru'}</td>
    </tr>
  `).join('');
}

function openAddSubjectModal() {
  showGenericModal('Tambah Mata Pelajaran Baru', `
    <form onsubmit="event.preventDefault(); submitAddSubject();">
      <div class="form-group">
        <label class="form-label">Kode Mata Pelajaran</label>
        <input class="form-control" id="mSubCode" required placeholder="Contoh: ING-01">
      </div>
      <div class="form-group">
        <label class="form-label">Nama Mata Pelajaran</label>
        <input class="form-control" id="mSubName" required placeholder="Bahasa Inggris">
      </div>
      <div class="form-group">
        <label class="form-label">Kategori</label>
        <select class="form-control" id="mSubCategory">
          <option value="Wajib">Wajib Nasional</option>
          <option value="Muatan Lokal">Muatan Lokal (Mulok)</option>
          <option value="Pilihan">Pilihan / Ekstrakurikuler</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Nilai KKM (Kriteria Ketuntasan Minimal)</label>
        <input type="number" class="form-control" id="mSubKkm" value="75" min="50" max="100">
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Simpan Mata Pelajaran</button>
    </form>
  `);
}

async function submitAddSubject() {
  const body = {
    code: document.getElementById('mSubCode')?.value,
    name: document.getElementById('mSubName')?.value,
    category: document.getElementById('mSubCategory')?.value,
    kkm: document.getElementById('mSubKkm')?.value
  };

  const res = await api('/api/subjects', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Mata Pelajaran berhasil ditambahkan!');
    await loadAllData();
  }
}

// 7. Schedules
function renderSchedules(list) {
  const tbody = document.getElementById('scheduleTableBody');
  const dashList = document.getElementById('dashboardScheduleList');

  if (tbody) {
    tbody.innerHTML = list.map(s => `
      <tr>
        <td><strong>${s.day}</strong></td>
        <td>${s.time_start} - ${s.time_end}</td>
        <td><span class="badge badge-info">${s.class_name}</span></td>
        <td><strong>${s.subject_name}</strong></td>
        <td>👨‍🏫 ${s.teacher_name}</td>
        <td>${s.room}</td>
      </tr>
    `).join('');
  }

  if (dashList) {
    dashList.innerHTML = list.slice(0, 3).map(s => `
      <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <div>
          <strong style="color:#1e40af">${s.day}, ${s.time_start} - ${s.time_end}</strong>
          <div style="font-weight:700;font-size:14px">${s.subject_name} (${s.class_name})</div>
          <small style="color:var(--text-muted)">Pengajar: ${s.teacher_name} • ${s.room}</small>
        </div>
        <span class="badge badge-success">Terjadwal</span>
      </div>
    `).join('');
  }
}

function openAddScheduleModal() {
  const classOpts = appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const subOpts = appData.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  const teacherOpts = appData.teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('');

  showGenericModal('Tambah Jadwal Pembelajaran', `
    <form onsubmit="event.preventDefault(); submitAddSchedule();">
      <div class="form-group">
        <label class="form-label">Hari</label>
        <select class="form-control" id="mSchDay">
          <option value="Senin">Senin</option>
          <option value="Selasa">Selasa</option>
          <option value="Rabu">Rabu</option>
          <option value="Kamis">Kamis</option>
          <option value="Jumat">Jumat</option>
          <option value="Sabtu">Sabtu</option>
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Jam Mulai</label>
          <input type="time" class="form-control" id="mSchStart" value="07:30">
        </div>
        <div class="form-group">
          <label class="form-label">Jam Selesai</label>
          <input type="time" class="form-control" id="mSchEnd" value="09:00">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Rombel / Kelas</label>
        <select class="form-control" id="mSchClassId">${classOpts}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Mata Pelajaran</label>
        <select class="form-control" id="mSchSubId">${subOpts}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Guru Pengampu</label>
        <select class="form-control" id="mSchTeacherId">${teacherOpts}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Ruang Kelas / Lab</label>
        <input class="form-control" id="mSchRoom" value="Ruang Kelas">
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Simpan Jadwal</button>
    </form>
  `);
}

async function submitAddSchedule() {
  const body = {
    day: document.getElementById('mSchDay')?.value,
    time_start: document.getElementById('mSchStart')?.value,
    time_end: document.getElementById('mSchEnd')?.value,
    class_id: document.getElementById('mSchClassId')?.value,
    subject_id: document.getElementById('mSchSubId')?.value,
    teacher_id: document.getElementById('mSchTeacherId')?.value,
    room: document.getElementById('mSchRoom')?.value
  };

  const res = await api('/api/schedules', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Jadwal berhasil ditambahkan!');
    await loadAllData();
  }
}

// 8. Materials
function renderMaterials(list) {
  const grid = document.getElementById('materialsGrid');
  if (!grid) return;
  grid.innerHTML = list.map(m => `
    <div class="card" style="margin-bottom:0">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <span class="badge ${m.type === 'Modul' ? 'badge-info' : 'badge-success'}">${m.type}</span>
        <span style="font-size:11px;color:var(--text-muted)">${m.class_name}</span>
      </div>
      <h3 style="font-size:16px;font-weight:700;margin-bottom:6px">${m.title}</h3>
      <p style="font-size:13px;color:#475569;margin-bottom:12px">${m.description || '-'}</p>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">
        Mapel: <strong>${m.subject_name}</strong><br>
        Oleh: <strong>${m.teacher_name}</strong>
      </div>
      <a href="${m.file_url}" target="_blank" class="btn btn-secondary btn-sm" style="width:100%">📥 Buka / Unduh Dokumen</a>
    </div>
  `).join('');
}

function openAddMaterialModal() {
  const classOpts = appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const subOpts = appData.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  showGenericModal('Unggah Bahan Ajar / LKPD Digital', `
    <form onsubmit="event.preventDefault(); submitAddMaterial();">
      <div class="form-group">
        <label class="form-label">Judul Materi / LKPD</label>
        <input class="form-control" id="mMatTitle" required placeholder="Contoh: Modul Ajar IPAS Siklus Air">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Tipe Dokumen</label>
          <select class="form-control" id="mMatType">
            <option value="Modul">Modul Ajar Kurikulum Merdeka</option>
            <option value="LKPD">Lembar Kerja Peserta Didik (LKPD)</option>
            <option value="Rangkuman">Ringkasan Materi Visual</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Kelas</label>
          <select class="form-control" id="mMatClassId">${classOpts}</select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Mata Pelajaran</label>
        <select class="form-control" id="mMatSubId">${subOpts}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Deskripsi & Capaian Pembelajaran</label>
        <textarea class="form-control" id="mMatDesc" placeholder="Ringkasan isi bahan pembelajaran..."></textarea>
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Unggah & Publikasikan</button>
    </form>
  `);
}

async function submitAddMaterial() {
  const body = {
    title: document.getElementById('mMatTitle')?.value,
    type: document.getElementById('mMatType')?.value,
    class_id: document.getElementById('mMatClassId')?.value,
    subject_id: document.getElementById('mMatSubId')?.value,
    description: document.getElementById('mMatDesc')?.value
  };

  const res = await api('/api/materials', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Materi ajar berhasil diunggah!');
    await loadAllData();
  }
}

// 9. Assignments & Submissions
function renderAssignments(list) {
  const tbody = document.getElementById('assignmentTableBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(a => `
    <tr>
      <td>
        <strong>${a.title}</strong><br>
        <small style="color:var(--text-muted)">${a.description}</small>
      </td>
      <td><span class="badge badge-info">${a.class_name} • ${a.subject_name}</span></td>
      <td>${new Date(a.deadline).toLocaleDateString('id-ID')}</td>
      <td><strong>${a.max_score}</strong></td>
      <td>
        ${currentRole === 'SISWA' ? `
          <button class="btn btn-success btn-sm" onclick="openSubmitAssignmentModal(${a.id}, '${a.title.replace(/'/g, "\\'")}')">📤 Kumpulkan Tugas</button>
        ` : `
          <button class="btn btn-secondary btn-sm" onclick="showToast('Memantau pengumpulan tugas...')">Lihat Peserta</button>
        `}
      </td>
    </tr>
  `).join('');
}

function renderSubmissions(list) {
  const tbody = document.getElementById('submissionTableBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(sub => `
    <tr>
      <td><strong>${sub.student_name}</strong></td>
      <td>${sub.assignment_title}</td>
      <td><span style="font-size:12px;color:#475569">${sub.submission_text || 'Lampiran tugas terunggah'}</span></td>
      <td>${new Date(sub.submitted_at).toLocaleDateString('id-ID')}</td>
      <td>${sub.score !== null ? `<span class="badge badge-success" style="font-size:13px">${sub.score} / 100</span>` : '<span class="badge badge-warning">Belum Dinilai</span>'}</td>
      <td><small>${sub.feedback || '-'}</small></td>
      <td>
        ${currentRole === 'GURU' || currentRole === 'ADMIN' || currentRole === 'SUPER_ADMIN' ? `
          <button class="btn btn-primary btn-sm" onclick="openGradeSubmissionModal(${sub.id}, '${sub.student_name}')">Beri Nilai</button>
        ` : '<span style="color:#94a3b8">-</span>'}
      </td>
    </tr>
  `).join('');
}

function openAddAssignmentModal() {
  const classOpts = appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const subOpts = appData.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  showGenericModal('Buat Penugasan Baru untuk Siswa', `
    <form onsubmit="event.preventDefault(); submitAddAssignment();">
      <div class="form-group">
        <label class="form-label">Judul Tugas</label>
        <input class="form-control" id="mAsgTitle" required placeholder="Contoh: Latihan Soal Cerita Operasi Hitung">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Kelas Sasaran</label>
          <select class="form-control" id="mAsgClassId">${classOpts}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Mata Pelajaran</label>
          <select class="form-control" id="mAsgSubId">${subOpts}</select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Batas Waktu Pengumpulan (Deadline)</label>
        <input type="datetime-local" class="form-control" id="mAsgDeadline" required>
      </div>
      <div class="form-group">
        <label class="form-label">Instruksi Tugas</label>
        <textarea class="form-control" id="mAsgDesc" placeholder="Jelaskan petunjuk pengerjaan tugas..."></textarea>
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Terbitkan Tugas</button>
    </form>
  `);
}

async function submitAddAssignment() {
  const body = {
    title: document.getElementById('mAsgTitle')?.value,
    class_id: document.getElementById('mAsgClassId')?.value,
    subject_id: document.getElementById('mAsgSubId')?.value,
    deadline: document.getElementById('mAsgDeadline')?.value,
    description: document.getElementById('mAsgDesc')?.value
  };

  const res = await api('/api/assignments', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Tugas berhasil diterbitkan!');
    await loadAllData();
  }
}

function openSubmitAssignmentModal(assignmentId, title) {
  showGenericModal(`Kumpulkan Tugas: ${title}`, `
    <form onsubmit="event.preventDefault(); submitStudentWork(${assignmentId});">
      <div class="form-group">
        <label class="form-label">Catatan / Jawaban Anda</label>
        <textarea class="form-control" id="mSubText" required placeholder="Tuliskan jawaban atau keterangan pengumpulan tugas..."></textarea>
      </div>
      <button class="btn btn-success" type="submit" style="width:100%">Kirim Tugas Sekarang ✓</button>
    </form>
  `);
}

async function submitStudentWork(assignmentId) {
  const body = {
    assignment_id: assignmentId,
    student_id: 1, // Ahmad Fauzi
    submission_text: document.getElementById('mSubText')?.value
  };

  const res = await api('/api/submissions', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Tugas Anda berhasil terkirim!');
    await loadAllData();
  }
}

function openGradeSubmissionModal(subId, studentName) {
  showGenericModal(`Penilaian Tugas: ${studentName}`, `
    <form onsubmit="event.preventDefault(); submitGradeSubmission(${subId});">
      <div class="form-group">
        <label class="form-label">Nilai Skor (0 - 100)</label>
        <input type="number" class="form-control" id="mGradeScore" min="0" max="100" required value="95">
      </div>
      <div class="form-group">
        <label class="form-label">Catatan / Umpan Balik Guru</label>
        <textarea class="form-control" id="mGradeFeedback" placeholder="Sangat bagus, penulisan rapi dan tepat...">Sangat bagus, ketelitian jawaban sudah sangat baik!</textarea>
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Simpan Nilai</button>
    </form>
  `);
}

async function submitGradeSubmission(subId) {
  const body = {
    score: document.getElementById('mGradeScore')?.value,
    feedback: document.getElementById('mGradeFeedback')?.value
  };

  const res = await api(`/api/submissions/${subId}/grade`, { method: 'PUT', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Nilai dan umpan balik tugas tersimpan!');
    await loadAllData();
  }
}

// 10. Quizzes & CBT
function renderQuizzes(list) {
  const container = document.getElementById('quizCardsContainer');
  if (!container) return;
  container.innerHTML = list.map(q => `
    <div class="card" style="margin-bottom:0">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <span class="badge badge-info">${q.subject_name}</span>
        <span class="badge badge-warning">⏱️ ${q.duration_minutes} Menit</span>
      </div>
      <h3 style="font-size:17px;font-weight:700;margin-bottom:6px">${q.title}</h3>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px">
        Kelas: <strong>${q.class_name}</strong> • KKM Kelulusan: <strong>${q.passing_grade}</strong> • Jumlah Soal: <strong>${q.questions?.length || 0} Soal</strong>
      </p>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" onclick="startCbtExam(${q.id})">🚀 Mulai Kerjakan CBT</button>
        <button class="btn btn-secondary btn-sm" onclick="openAddQuestionModal(${q.id})">+ Tambah Butir Soal</button>
      </div>
    </div>
  `).join('');
}

function startCbtExam(quizId) {
  const quiz = appData.quizzes.find(q => q.id === quizId);
  if (!quiz) return;
  activeCbtQuiz = quiz;

  const container = document.getElementById('cbtTestContainer');
  const title = document.getElementById('cbtQuizTitle');
  const list = document.getElementById('cbtQuestionsList');

  if (container && title && list) {
    title.textContent = `Ujian Aktif: ${quiz.title}`;
    list.innerHTML = (quiz.questions || []).map((q, idx) => `
      <div style="background:#fff;padding:16px;border-radius:8px;border:1px solid #cbd5e1;margin-bottom:16px">
        <div style="font-weight:700;margin-bottom:10px;font-size:14px">Soal No. ${idx + 1}: ${q.question_text}</div>
        <div style="display:flex;flex-direction:column;gap:8px;font-size:13px">
          <label style="cursor:pointer;display:flex;gap:8px;align-items:center"><input type="radio" name="ans_${q.id}" value="A"> A. ${q.option_a}</label>
          <label style="cursor:pointer;display:flex;gap:8px;align-items:center"><input type="radio" name="ans_${q.id}" value="B"> B. ${q.option_b}</label>
          <label style="cursor:pointer;display:flex;gap:8px;align-items:center"><input type="radio" name="ans_${q.id}" value="C"> C. ${q.option_c}</label>
          <label style="cursor:pointer;display:flex;gap:8px;align-items:center"><input type="radio" name="ans_${q.id}" value="D"> D. ${q.option_d}</label>
        </div>
      </div>
    `).join('');

    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
  }
}

async function submitCbtExam() {
  if (!activeCbtQuiz) return;
  const answers = {};
  (activeCbtQuiz.questions || []).forEach(q => {
    const selected = document.querySelector(`input[name="ans_${q.id}"]:checked`);
    if (selected) answers[q.id] = selected.value;
  });

  const res = await api(`/api/quizzes/${activeCbtQuiz.id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ student_id: 1, answers })
  });

  if (res && res.success) {
    document.getElementById('cbtTestContainer').style.display = 'none';
    showToast(`Ujian Selesai! Skor Anda: ${res.result.score} (${res.result.passed ? 'LULUS' : 'REMEDIAL'})`);
    alert(`🎉 Hasil Ujian CBT:\nSkor: ${res.result.score} / 100\nBenar: ${res.result.total_correct} dari ${res.result.total_questions} soal\nStatus: ${res.result.passed ? 'LULUS MEMUASKAN' : 'PERLU REMEDIAL'}`);
    await loadAllData();
  }
}

function openAddQuizModal() {
  const classOpts = appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const subOpts = appData.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  showGenericModal('Buat Paket Ujian CBT Online', `
    <form onsubmit="event.preventDefault(); submitAddQuiz();">
      <div class="form-group">
        <label class="form-label">Judul Ujian / Kuis</label>
        <input class="form-control" id="mQzTitle" required placeholder="Contoh: PTS Ganjil Matematika Kelas 1">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Kelas</label>
          <select class="form-control" id="mQzClassId">${classOpts}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Mata Pelajaran</label>
          <select class="form-control" id="mQzSubId">${subOpts}</select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Durasi Waktu (Menit)</label>
          <input type="number" class="form-control" id="mQzDuration" value="30">
        </div>
        <div class="form-group">
          <label class="form-label">KKM Kelulusan</label>
          <input type="number" class="form-control" id="mQzPass" value="75">
        </div>
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Buat Paket Ujian</button>
    </form>
  `);
}

async function submitAddQuiz() {
  const body = {
    title: document.getElementById('mQzTitle')?.value,
    class_id: document.getElementById('mQzClassId')?.value,
    subject_id: document.getElementById('mQzSubId')?.value,
    duration_minutes: document.getElementById('mQzDuration')?.value,
    passing_grade: document.getElementById('mQzPass')?.value
  };

  const res = await api('/api/quizzes', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Paket ujian CBT berhasil dibuat!');
    await loadAllData();
  }
}

function openAddQuestionModal(quizId) {
  showGenericModal('Tambah Soal ke Bank Soal', `
    <form onsubmit="event.preventDefault(); submitAddQuestion(${quizId});">
      <div class="form-group">
        <label class="form-label">Teks Soal / Pertanyaan</label>
        <textarea class="form-control" id="mQuestText" required placeholder="Tuliskan stimulus dan teks pertanyaan..."></textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div class="form-group">
          <label class="form-label">Pilihan A</label>
          <input class="form-control" id="mQuestA" required>
        </div>
        <div class="form-group">
          <label class="form-label">Pilihan B</label>
          <input class="form-control" id="mQuestB" required>
        </div>
        <div class="form-group">
          <label class="form-label">Pilihan C</label>
          <input class="form-control" id="mQuestC" required>
        </div>
        <div class="form-group">
          <label class="form-label">Pilihan D</label>
          <input class="form-control" id="mQuestD" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Kunci Jawaban Benar</label>
        <select class="form-control" id="mQuestCorrect">
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Tambahkan ke Soal Ujian</button>
    </form>
  `);
}

async function submitAddQuestion(quizId) {
  const body = {
    question_text: document.getElementById('mQuestText')?.value,
    option_a: document.getElementById('mQuestA')?.value,
    option_b: document.getElementById('mQuestB')?.value,
    option_c: document.getElementById('mQuestC')?.value,
    option_d: document.getElementById('mQuestD')?.value,
    correct_answer: document.getElementById('mQuestCorrect')?.value
  };

  const res = await api(`/api/quizzes/${quizId}/questions`, { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Soal berhasil ditambahkan ke bank soal!');
    await loadAllData();
  }
}

// 11. Grades & E-Raport
function renderGrades(list) {
  const tbody = document.getElementById('gradeTableBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(g => `
    <tr>
      <td><strong>${g.student_name}</strong></td>
      <td>${g.subject_name}</td>
      <td>${g.tugas_avg}</td>
      <td>${g.uts}</td>
      <td>${g.uas}</td>
      <td><strong style="color:#1e40af;font-size:14px">${g.final_grade}</strong></td>
      <td><span class="badge ${g.predicate === 'A' ? 'badge-success' : 'badge-info'}">Predikat ${g.predicate}</span></td>
      <td><small style="color:#475569">${g.notes}</small></td>
    </tr>
  `).join('');
}

function openAddGradeModal() {
  const stuOpts = appData.students.map(s => `<option value="${s.id}">${s.name} (${s.class})</option>`).join('');
  const subOpts = appData.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  showGenericModal('Input Nilai Hasil Belajar Siswa', `
    <form onsubmit="event.preventDefault(); submitAddGrade();">
      <div class="form-group">
        <label class="form-label">Pilih Siswa</label>
        <select class="form-control" id="mGrdStudentId">${stuOpts}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Mata Pelajaran</label>
        <select class="form-control" id="mGrdSubId">${subOpts}</select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        <div class="form-group">
          <label class="form-label">Rata Tugas (30%)</label>
          <input type="number" class="form-control" id="mGrdTugas" value="88">
        </div>
        <div class="form-group">
          <label class="form-label">Nilai UTS (30%)</label>
          <input type="number" class="form-control" id="mGrdUts" value="85">
        </div>
        <div class="form-group">
          <label class="form-label">Nilai UAS (40%)</label>
          <input type="number" class="form-control" id="mGrdUas" value="90">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Deskripsi Capaian Kompetensi</label>
        <textarea class="form-control" id="mGrdNotes">Sangat baik dalam memahami materi dan menunjukkan kemandirian belajar yang konsisten.</textarea>
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Simpan Nilai Raport</button>
    </form>
  `);
}

async function submitAddGrade() {
  const body = {
    student_id: document.getElementById('mGrdStudentId')?.value,
    subject_id: document.getElementById('mGrdSubId')?.value,
    tugas_avg: document.getElementById('mGrdTugas')?.value,
    uts: document.getElementById('mGrdUts')?.value,
    uas: document.getElementById('mGrdUas')?.value,
    notes: document.getElementById('mGrdNotes')?.value
  };

  const res = await api('/api/grades', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Nilai raport berhasil disimpan!');
    await loadAllData();
  }
}

async function viewDigitalReport(studentId = 1) {
  const res = await api(`/api/report-cards/${studentId}`);
  if (!res || !res.success) {
    alert('Gagal mengambil data raport');
    return;
  }

  showSection('grades');
  const box = document.getElementById('reportCardPreviewBox');
  const sName = document.getElementById('rapStudentName');
  const sNis = document.getElementById('rapStudentNis');
  const sClass = document.getElementById('rapStudentClass');
  const list = document.getElementById('rapGradesList');

  if (sName) sName.textContent = res.student.name;
  if (sNis) sNis.textContent = `${res.student.nis} / ${res.student.nisn || '-'}`;
  if (sClass) sClass.textContent = res.student.class;

  if (list) {
    list.innerHTML = (res.grades || []).map((g, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${g.subject_name}</strong></td>
        <td><strong style="color:#1e40af;font-size:14px">${g.final_grade} (${g.predicate})</strong></td>
        <td>${g.notes}</td>
      </tr>
    `).join('');
  }

  if (box) {
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth' });
  }
}

// 12. Attendance
function renderStudentAttendance(list) {
  const tbody = document.getElementById('studentAttendanceTableBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(a => `
    <tr>
      <td><strong>${a.student_name}</strong></td>
      <td>${a.class_name}</td>
      <td><span class="badge ${a.status === 'Hadir' ? 'badge-success' : a.status === 'Sakit' ? 'badge-warning' : 'badge-danger'}">${a.status}</span></td>
      <td><small>${a.note || '-'}</small></td>
    </tr>
  `).join('');
}

function renderTeacherAttendance(list) {
  const tbody = document.getElementById('teacherAttendanceTableBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(a => `
    <tr>
      <td><strong>${a.teacher_name}</strong></td>
      <td>${a.check_in || '07:00'}</td>
      <td><span class="badge badge-success">${a.status}</span></td>
      <td><small>${a.note || 'Tepat Waktu'}</small></td>
    </tr>
  `).join('');
}

function openRecordAttendanceModal() {
  const stuOpts = appData.students.map(s => `<option value="${s.id}">${s.name} (${s.class})</option>`).join('');
  showGenericModal('Catat Presensi Siswa Harian', `
    <form onsubmit="event.preventDefault(); submitRecordAttendance();">
      <div class="form-group">
        <label class="form-label">Pilih Siswa</label>
        <select class="form-control" id="mAttStudentId">${stuOpts}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Status Kehadiran</label>
        <select class="form-control" id="mAttStatus">
          <option value="Hadir">Hadir Tepat Waktu</option>
          <option value="Sakit">Sakit (Keterangan Dokter / Orang Tua)</option>
          <option value="Izin">Izin (Keperluan Keluarga)</option>
          <option value="Alpa">Alpa / Tanpa Keterangan</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Keterangan Tambahan</label>
        <input class="form-control" id="mAttNote" placeholder="Tepat waktu jam 07:00">
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Simpan Presensi</button>
    </form>
  `);
}

async function submitRecordAttendance() {
  const body = {
    student_id: document.getElementById('mAttStudentId')?.value,
    status: document.getElementById('mAttStatus')?.value,
    note: document.getElementById('mAttNote')?.value
  };

  const res = await api('/api/attendance/students', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Presensi siswa berhasil dicatat!');
    await loadAllData();
  }
}

async function recordTeacherSelfAttendance() {
  const res = await api('/api/attendance/teachers', {
    method: 'POST',
    body: JSON.stringify({ teacher_id: 1, status: 'Hadir', note: 'Check-in mandiri guru' })
  });
  if (res && res.success) {
    showToast('Presensi guru berhasil terekam!');
    await loadAllData();
  }
}

// 13. Announcements
function renderAnnouncements(list) {
  const container = document.getElementById('announcementsContainer');
  const dashList = document.getElementById('dashboardAnnouncementsList');

  const html = list.map(a => `
    <div class="card" style="margin-bottom:0">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <span class="badge ${a.category === 'Akademik' ? 'badge-info' : 'badge-warning'}">${a.category}</span>
        <span style="font-size:12px;color:var(--text-muted)">Sasaran: <strong>${a.target_role}</strong></span>
      </div>
      <h3 style="font-size:17px;font-weight:700;margin-bottom:6px">${a.title}</h3>
      <p style="font-size:14px;color:#334155;margin-bottom:12px;white-space:pre-line">${a.content}</p>
      <div style="font-size:12px;color:var(--text-muted)">
        Diterbitkan oleh: <strong>${a.author}</strong> • ${new Date(a.created_at).toLocaleDateString('id-ID')}
      </div>
    </div>
  `).join('');

  if (container) container.innerHTML = html;
  if (dashList) {
    dashList.innerHTML = list.slice(0, 2).map(a => `
      <div style="padding:10px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-info" style="font-size:10px">${a.category}</span>
        <div style="font-weight:700;font-size:14px;margin:4px 0">${a.title}</div>
        <p style="font-size:12px;color:#475569;margin-bottom:4px">${a.content.substring(0, 110)}...</p>
        <small style="color:var(--text-muted)">${a.author}</small>
      </div>
    `).join('');
  }
}

function openAddAnnouncementModal() {
  showGenericModal('Terbitkan Pengumuman Resmi', `
    <form onsubmit="event.preventDefault(); submitAddAnnouncement();">
      <div class="form-group">
        <label class="form-label">Judul Pengumuman</label>
        <input class="form-control" id="mAnnTitle" required placeholder="Contoh: Libur Hari Besar Nasional">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Kategori</label>
          <select class="form-control" id="mAnnCat">
            <option value="Umum">Umum</option>
            <option value="Akademik">Akademik</option>
            <option value="Kegiatan">Kegiatan Sekolah</option>
            <option value="Mendesak">Mendesak / Darurat</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Sasaran Audiens</label>
          <select class="form-control" id="mAnnRole">
            <option value="ALL">Semua Warga Sekolah</option>
            <option value="GURU">Hanya Dewan Guru</option>
            <option value="ORANG_TUA">Hanya Orang Tua</option>
            <option value="SISWA">Hanya Siswa</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Isi Surat / Pengumuman</label>
        <textarea class="form-control" id="mAnnContent" required placeholder="Tuliskan isi pengumuman secara lengkap..."></textarea>
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Publikasikan Pengumuman</button>
    </form>
  `);
}

async function submitAddAnnouncement() {
  const body = {
    title: document.getElementById('mAnnTitle')?.value,
    category: document.getElementById('mAnnCat')?.value,
    target_role: document.getElementById('mAnnRole')?.value,
    content: document.getElementById('mAnnContent')?.value
  };

  const res = await api('/api/announcements', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Pengumuman berhasil diterbitkan!');
    await loadAllData();
  }
}

// 14. Messages
function renderMessages(list) {
  const container = document.getElementById('messagesListContainer');
  if (!container) return;
  container.innerHTML = list.map(m => `
    <div style="background:#fff;border:1px solid var(--border);padding:14px;border-radius:8px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <div>
          <strong style="color:#1e40af">${m.sender_name}</strong>
          <span style="font-size:12px;color:var(--text-muted)">kepada</span>
          <strong>${m.recipient_name}</strong>
        </div>
        <span style="font-size:11px;color:var(--text-muted)">${new Date(m.created_at).toLocaleDateString('id-ID')}</span>
      </div>
      <div style="font-weight:700;font-size:14px;margin-bottom:4px">${m.subject}</div>
      <p style="font-size:13px;color:#334155">${m.body}</p>
    </div>
  `).join('');
}

function openNewMessageModal() {
  showGenericModal('Tulis Pesan Internal', `
    <form onsubmit="event.preventDefault(); submitSendMessage();">
      <div class="form-group">
        <label class="form-label">Tujuan Penerima</label>
        <input class="form-control" id="mMsgTo" value="Budi Santoso, S.Pd (Wali Kelas)">
      </div>
      <div class="form-group">
        <label class="form-label">Perihal / Subjek</label>
        <input class="form-control" id="mMsgSub" required placeholder="Konsultasi Perkembangan Siswa">
      </div>
      <div class="form-group">
        <label class="form-label">Isi Pesan</label>
        <textarea class="form-control" id="mMsgBody" required placeholder="Tuliskan pesan Anda..."></textarea>
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Kirim Pesan</button>
    </form>
  `);
}

async function submitSendMessage() {
  const body = {
    recipient_name: document.getElementById('mMsgTo')?.value,
    subject: document.getElementById('mMsgSub')?.value,
    body: document.getElementById('mMsgBody')?.value
  };

  const res = await api('/api/messages', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Pesan berhasil dikirim!');
    await loadAllData();
  }
}

// 15. Letters
function renderLetters(list) {
  const tbody = document.getElementById('letterTableBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(l => `
    <tr>
      <td><code>${l.letter_number}</code></td>
      <td><span class="badge ${l.type === 'Keluar' ? 'badge-info' : 'badge-warning'}">${l.type}</span></td>
      <td><strong>${l.title}</strong><br><small style="color:var(--text-muted)">${l.description}</small></td>
      <td>${l.sender_or_recipient}</td>
      <td>${l.letter_date}</td>
      <td><span class="badge badge-success">${l.status}</span></td>
    </tr>
  `).join('');
}

function openAddLetterModal() {
  showGenericModal('Catat Agenda Surat Masuk / Keluar', `
    <form onsubmit="event.preventDefault(); submitAddLetter();">
      <div class="form-group">
        <label class="form-label">Nomor Surat Dinas</label>
        <input class="form-control" id="mLtrNum" placeholder="421.2/020/SD-MS1/IX/2026">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Jenis Surat</label>
          <select class="form-control" id="mLtrType">
            <option value="Keluar">Surat Keluar</option>
            <option value="Masuk">Surat Masuk</option>
            <option value="Surat Keterangan">Surat Keterangan Aktif</option>
            <option value="Surat Keputusan">Surat Keputusan (SK)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Tanggal Surat</label>
          <input type="date" class="form-control" id="mLtrDate" value="2026-09-29">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Perihal / Judul Surat</label>
        <input class="form-control" id="mLtrTitle" required placeholder="Undangan Rapat Dewan Guru">
      </div>
      <div class="form-group">
        <label class="form-label">Pengirim / Tujuan</label>
        <input class="form-control" id="mLtrTarget" placeholder="Dinas Pendidikan / Guru">
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Simpan Surat Dinas</button>
    </form>
  `);
}

async function submitAddLetter() {
  const body = {
    letter_number: document.getElementById('mLtrNum')?.value,
    type: document.getElementById('mLtrType')?.value,
    letter_date: document.getElementById('mLtrDate')?.value,
    title: document.getElementById('mLtrTitle')?.value,
    sender_or_recipient: document.getElementById('mLtrTarget')?.value
  };

  const res = await api('/api/admin/letters', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Surat dinas berhasil dicatat!');
    await loadAllData();
  }
}

// 16. Archives
function renderArchives(list) {
  const container = document.getElementById('archivesContainer');
  if (!container) return;
  container.innerHTML = list.map(a => `
    <div class="card" style="margin-bottom:0">
      <span class="badge badge-info" style="margin-bottom:8px">${a.category}</span>
      <h3 style="font-size:16px;font-weight:700;margin-bottom:6px">${a.title}</h3>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">
        No. Berkas: <strong>${a.document_number}</strong><br>
        Tahun: <strong>${a.year}</strong> • Ukuran: <strong>${a.file_size}</strong>
      </div>
      <a href="${a.file_url}" target="_blank" class="btn btn-secondary btn-sm" style="width:100%">🗄️ Buka Berkas Arsip</a>
    </div>
  `).join('');
}

function openAddArchiveModal() {
  showGenericModal('Tambah Dokumen Arsip Digital', `
    <form onsubmit="event.preventDefault(); submitAddArchive();">
      <div class="form-group">
        <label class="form-label">Nama Dokumen / Berkas</label>
        <input class="form-control" id="mArcTitle" required placeholder="Contoh: Laporan Evaluasi Diri Sekolah 2026">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Kategori Arsip</label>
          <select class="form-control" id="mArcCat">
            <option value="Kurikulum">Kurikulum</option>
            <option value="Akreditasi">Akreditasi</option>
            <option value="Kepegawaian">Kepegawaian</option>
            <option value="Sarpras & Keuangan">Sarpras & Keuangan</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Tahun</label>
          <input class="form-control" id="mArcYear" value="2026">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Nomor Surat Keputusan / Kode Dokumen</label>
        <input class="form-control" id="mArcDocNum" placeholder="SK-108/DISDIK/2026">
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Arsipkan Dokumen</button>
    </form>
  `);
}

async function submitAddArchive() {
  const body = {
    title: document.getElementById('mArcTitle')?.value,
    category: document.getElementById('mArcCat')?.value,
    year: document.getElementById('mArcYear')?.value,
    document_number: document.getElementById('mArcDocNum')?.value
  };

  const res = await api('/api/admin/archives', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Dokumen berhasil diarsipkan!');
    await loadAllData();
  }
}

// 17. Users & Audit
function renderUsers(list) {
  const tbody = document.getElementById('userTableBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(u => `
    <tr>
      <td><strong>${u.username}</strong></td>
      <td>${u.name}</td>
      <td><span class="role-pill ${u.role.toLowerCase().replace('_', '')}">${u.role}</span></td>
      <td>${u.email || '-'}</td>
      <td><span class="badge badge-success">${u.status}</span></td>
    </tr>
  `).join('');
}

function renderAuditLogs(list) {
  const tbody = document.getElementById('auditTableBody');
  if (!tbody) return;
  tbody.innerHTML = list.slice(0, 15).map(l => `
    <tr>
      <td><small>${new Date(l.created_at).toLocaleString('id-ID')}</small></td>
      <td><strong>${l.user_name}</strong></td>
      <td><span class="badge badge-gray">${l.role}</span></td>
      <td><code>${l.action}</code></td>
      <td>${l.detail}</td>
    </tr>
  `).join('');
}

function openAddUserModal() {
  showGenericModal('Tambah Akun Pengguna Baru', `
    <form onsubmit="event.preventDefault(); submitAddUser();">
      <div class="form-group">
        <label class="form-label">Username</label>
        <input class="form-control" id="mUsrName" required placeholder="guru.matematika">
      </div>
      <div class="form-group">
        <label class="form-label">Nama Lengkap</label>
        <input class="form-control" id="mUsrFull" required placeholder="Hj. Dewi Sartika, M.Pd">
      </div>
      <div class="form-group">
        <label class="form-label">Peran (Role)</label>
        <select class="form-control" id="mUsrRole">
          <option value="SUPER_ADMIN">SUPER ADMIN</option>
          <option value="ADMIN">ADMIN SEKOLAH</option>
          <option value="KEPALA_SEKOLAH">KEPALA SEKOLAH</option>
          <option value="GURU">GURU</option>
          <option value="SISWA">SISWA</option>
          <option value="ORANG_TUA">ORANG TUA</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Password Awal</label>
        <input class="form-control" id="mUsrPass" value="admin123">
      </div>
      <button class="btn btn-primary" type="submit" style="width:100%">Buat Akun Pengguna</button>
    </form>
  `);
}

async function submitAddUser() {
  const body = {
    username: document.getElementById('mUsrName')?.value,
    name: document.getElementById('mUsrFull')?.value,
    role: document.getElementById('mUsrRole')?.value,
    password: document.getElementById('mUsrPass')?.value
  };

  const res = await api('/api/users', { method: 'POST', body: JSON.stringify(body) });
  if (res && res.success) {
    closeGenericModal();
    showToast('Akun pengguna berhasil ditambahkan!');
    await loadAllData();
  } else {
    alert(res.message || 'Gagal membuat user');
  }
}

// 18. AI Assistant Tools (Batch AI System)
function switchAiTab(tabId, btn) {
  document.querySelectorAll('.ai-tab-content').forEach(c => c.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const target = document.getElementById(tabId);
  if (target) target.style.display = 'block';
  if (btn) btn.classList.add('active');
}

function populateAiStudentSelect() {
  const sel = document.getElementById('aiStudentSelect');
  if (!sel) return;
  sel.innerHTML = appData.students.map(s => `
    <option value="${s.id}">${s.name} (${s.class} - NIS: ${s.nis})</option>
  `).join('');
}

async function generateAiLessonPlan() {
  const btn = document.getElementById('btnGenLessonPlan');
  const out = document.getElementById('aiLessonPlanOutput');
  const subject = document.getElementById('aiSubject')?.value;
  const grade = document.getElementById('aiGrade')?.value;
  const duration = document.getElementById('aiDuration')?.value;
  const topic = document.getElementById('aiTopic')?.value;

  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ AI Sedang Menyusun Modul Ajar...';
  }

  const res = await api('/api/ai/generate-lesson-plan', {
    method: 'POST',
    body: JSON.stringify({ subject, grade, duration, topic })
  });

  if (btn) {
    btn.disabled = false;
    btn.textContent = '🚀 Susun Modul Ajar dengan AI';
  }

  if (res && res.success && res.data) {
    const c = res.data.content;
    out.style.display = 'block';
    out.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <span class="badge badge-success">Selesai Disusun</span>
          <h3 style="font-size:18px;font-weight:800;margin-top:6px">${res.data.topic}</h3>
          <p style="font-size:12px;color:var(--text-muted)">Mapel: ${res.data.subject} • ${res.data.grade} • Alokasi: ${res.data.duration}</p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Cetak Modul</button>
      </div>

      <div style="background:#fff;padding:16px;border-radius:8px;border:1px solid #bfdbfe;font-size:13px;line-height:1.7">
        <h4 style="font-size:14px;color:#1e40af;font-weight:700">A. Capaian Pembelajaran (CP)</h4>
        <p style="margin-bottom:12px">${c.capaian_pembelajaran}</p>

        <h4 style="font-size:14px;color:#1e40af;font-weight:700">B. Tujuan Pembelajaran (TP)</h4>
        <ul style="margin-left:20px;margin-bottom:12px">
          ${(c.tujuan_pembelajaran || []).map(tp => `<li>${tp}</li>`).join('')}
        </ul>

        <h4 style="font-size:14px;color:#1e40af;font-weight:700">C. Profil Pelajar Pancasila</h4>
        <div style="display:flex;gap:6px;margin-bottom:12px">
          ${(c.profil_pelajar_pancasila || ['Bernalar Kritis', 'Gotong Royong']).map(p => `<span class="badge badge-info">${p}</span>`).join('')}
        </div>

        <h4 style="font-size:14px;color:#1e40af;font-weight:700">D. Rincian Kegiatan Pembelajaran</h4>
        <p><strong>1. Kegiatan Pendahuluan:</strong> ${c.kegiatan_awal}</p>
        <p><strong>2. Kegiatan Inti (Berdiferensiasi):</strong> ${c.kegiatan_inti}</p>
        <p style="margin-bottom:12px"><strong>3. Kegiatan Penutup:</strong> ${c.kegiatan_penutup}</p>

        <h4 style="font-size:14px;color:#1e40af;font-weight:700">E. Asesmen & Media Pembelajaran</h4>
        <p><strong>Bentuk Asesmen:</strong> ${c.asesmen}</p>
        <p><strong>Rekomendasi Media:</strong> ${c.rekomendasi_media || 'Peralatan Konkret & Digital Muaraversa'}</p>
      </div>
    `;
    showToast('Modul Ajar Kurikulum Merdeka selesai disusun!');
    await loadAllData();
  }
}

function openGenerateSoalModal() {
  showSection('ai-assistant');
  switchAiTab('tab-soal');
}

async function generateAiQuestions() {
  const btn = document.getElementById('btnGenQuestions');
  const out = document.getElementById('aiQuestionsOutput');
  const subject = document.getElementById('aiQSubject')?.value;
  const grade = document.getElementById('aiQGrade')?.value;
  const difficulty = document.getElementById('aiQDifficulty')?.value;
  const topic = document.getElementById('aiQTopic')?.value;

  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ AI Sedang Membuat Butir Soal HOTS...';
  }

  const res = await api('/api/ai/generate-questions', {
    method: 'POST',
    body: JSON.stringify({ subject, grade, difficulty, topic, count: 3 })
  });

  if (btn) {
    btn.disabled = false;
    btn.textContent = '🚀 Buat Soal Otomatis & Simpan ke Bank Soal';
  }

  if (res && res.success && res.questions) {
    out.style.display = 'block';
    out.innerHTML = `
      <div style="background:#f0fdf4;border:1px solid #86efac;padding:16px;border-radius:8px;margin-bottom:12px">
        <h4 style="font-weight:800;color:#166534">✓ Berhasil Membuat ${res.count} Butir Soal ${difficulty}</h4>
        <p style="font-size:13px;color:#15803d">Soal langsung tersimpan ke Bank Soal & siap diujikan di Ujian CBT.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${res.questions.map((q, idx) => `
          <div style="background:#fff;padding:14px;border-radius:8px;border:1px solid var(--border);font-size:13px">
            <strong>Soal ${idx + 1}:</strong> ${q.question_text}
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0">
              <div>A. ${q.option_a}</div>
              <div>B. ${q.option_b}</div>
              <div>C. ${q.option_c}</div>
              <div>D. ${q.option_d}</div>
            </div>
            <div style="background:#f8fafc;padding:6px 10px;border-radius:6px;color:#1e40af">
              <strong>Kunci:</strong> Opsi ${q.correct_answer} • <em>${q.explanation}</em>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    showToast('Bank soal berhasil ditambahkan!');
    await loadAllData();
  }
}

async function runStudentAiAnalysis() {
  const studentId = document.getElementById('aiStudentSelect')?.value || 1;
  const out = document.getElementById('aiStudentAnalysisOutput');

  out.style.display = 'block';
  out.innerHTML = '⏳ Sedang menganalisis hasil belajar dan pola belajar siswa...';

  const res = await api('/api/ai/analyze-learning', {
    method: 'POST',
    body: JSON.stringify({ student_id: studentId })
  });

  if (res && res.success && res.analysis) {
    const a = res.analysis;
    out.innerHTML = `
      <h3 style="font-size:17px;font-weight:800;color:#1e3a8a;margin-bottom:8px">Laporan Analisis Belajar Siswa: ${res.student}</h3>
      <p style="font-size:13px;color:#334155;margin-bottom:12px">${a.ringkasan_perkembangan}</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;font-size:13px">
        <div style="background:#fff;padding:12px;border-radius:8px;border:1px solid #bbf7d0">
          <strong style="color:#166534">🌟 Kekuatan Akademik:</strong>
          <ul style="margin-left:16px;margin-top:6px">
            ${(a.kekuatan_akademik || []).map(k => `<li>${k}</li>`).join('')}
          </ul>
        </div>
        <div style="background:#fff;padding:12px;border-radius:8px;border:1px solid #fde68a">
          <strong style="color:#b45309">🎯 Area Pengembangan / Rekomendasi:</strong>
          <ul style="margin-left:16px;margin-top:6px">
            ${(a.area_pengembangan || []).map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div style="background:#eff6ff;padding:12px;border-radius:8px;font-size:13px;color:#1e40af">
        <p><strong>Tindakan Guru di Kelas:</strong> ${a.rekomendasi_guru}</p>
        <p style="margin-top:4px"><strong>Saran Pendampingan Orang Tua:</strong> ${a.rekomendasi_orang_tua}</p>
      </div>
    `;
    showToast('Analisis kecerdasan belajar siswa selesai!');
  }
}

async function sendAiChat() {
  const input = document.getElementById('chatInputText');
  const text = input?.value?.trim();
  if (!text) return;

  const box = document.getElementById('chatMessagesBox');
  input.value = '';

  // Append User message
  box.innerHTML += `
    <div style="margin-bottom:12px;text-align:right">
      <span class="badge badge-primary">Anda (${currentRole})</span>
      <div style="background:#eff6ff;padding:10px 14px;border-radius:8px;display:inline-block;text-align:left;max-width:80%;margin-top:4px">
        ${text}
      </div>
    </div>
  `;
  box.scrollTop = box.scrollHeight;

  const res = await api('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message: text, role: currentRole })
  });

  if (res && res.reply) {
    box.innerHTML += `
      <div style="margin-bottom:12px">
        <span class="badge badge-info">AI Asisten Muaraversa</span>
        <div style="background:#fff;padding:12px 14px;border-radius:8px;border:1px solid #e2e8f0;margin-top:4px;white-space:pre-line">
          ${res.reply}
        </div>
      </div>
    `;
    box.scrollTop = box.scrollHeight;
  }
}

// Modal generic utility
function showGenericModal(title, htmlContent) {
  const modal = document.getElementById('genericModal');
  const titleEl = document.getElementById('genericModalTitle');
  const bodyEl = document.getElementById('genericModalBody');

  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.innerHTML = htmlContent;
  if (modal) modal.classList.add('active');
}

function closeGenericModal() {
  const modal = document.getElementById('genericModal');
  if (modal) modal.classList.remove('active');
}

// Custom Toast notification
function showToast(message) {
  let toast = document.getElementById('appToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToastNotification';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = '#0f172a';
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '600';
    toast.style.transition = 'all 0.3s ease';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 3500);
}
