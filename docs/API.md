# MUARAVERSA API Reference (Final Production)

Daftar endpoint RESTful API terstruktur untuk seluruh ekosistem Muaraversa.

## 1. System & Authentication
- `GET /api/health` - Status kesehatan sistem & ketersediaan AI engine.
- `GET /api` - Metadata ekosistem dan daftar modul aktif.
- `POST /api/login` atau `POST /api/auth/login` - Autentikasi akun pengguna (`username`, `password`).
- `GET /api/auth/me` - Informasi profil pengguna aktif berdasarkan Bearer token.
- `POST /api/auth/logout` - Terminasi sesi aktif pengguna.
- `POST /api/auth/switch-demo-role` - Switch instan persona demo untuk evaluasi peran (`role`).

## 2. User & Hak Akses
- `GET /api/users` - Mengambil daftar pengguna sistem (opsional filter `?role=`).
- `POST /api/users` - Menambahkan pengguna baru.
- `GET /api/audit-logs` - Mengambil catatan log audit keamanan sistem.

## 3. Manajemen Sekolah (School Management)
- `GET /api/school` - Profil resmi sekolah (NPSN, alamat, kepala sekolah, akreditasi).
- `POST /api/school` - Memperbarui profil resmi sekolah.
- `GET /api/teachers` - Daftar dewan guru pengajar.
- `POST /api/teachers` - Tambah data guru baru (otomatis membuat akun login).
- `PUT /api/teachers/:id` - Edit data guru.
- `DELETE /api/teachers/:id` - Hapus guru.
- `GET /api/students` - Daftar peserta didik aktif (opsional filter `?class_id=`).
- `POST /api/students` - Tambah siswa baru.
- `PUT /api/students/:id` - Edit data siswa.
- `DELETE /api/students/:id` - Hapus siswa.
- `GET /api/classes` - Daftar rombel / kelas beserta wali kelas.
- `POST /api/classes` - Tambah kelas baru.
- `PUT /api/classes/:id` - Edit kelas.
- `DELETE /api/classes/:id` - Hapus kelas.
- `GET /api/subjects` - Daftar mata pelajaran dan KKM.
- `POST /api/subjects` - Tambah mata pelajaran baru.

## 4. Akademik & Pembelajaran (Academic System)
- `GET /api/schedules` - Jadwal pelajaran (opsional filter `?class_id=`).
- `POST /api/schedules` - Tambah jadwal pelajaran mingguan.
- `GET /api/materials` - Daftar modul ajar Kurikulum Merdeka & LKPD.
- `POST /api/materials` - Unggah materi/LKPD baru.
- `GET /api/assignments` - Daftar tugas siswa aktif.
- `POST /api/assignments` - Terbitkan tugas baru.
- `GET /api/submissions` - Riwayat pengumpulan tugas siswa.
- `POST /api/submissions` - Pengumpulan tugas oleh siswa.
- `PUT /api/submissions/:id/grade` - Guru memberikan penilaian & umpan balik tugas.
- `GET /api/grades` - Buku nilai siswa (opsional filter `?student_id=`).
- `POST /api/grades` - Input nilai akhir (Tugas, UTS, UAS, Predikat).
- `GET /api/report-cards/:student_id` - Cetak laporan E-Raport komprehensif siswa.

## 5. Ujian CBT & Bank Soal
- `GET /api/quizzes` - Daftar paket ujian CBT online beserta butir soal.
- `POST /api/quizzes` - Buat paket ujian CBT baru.
- `POST /api/quizzes/:id/questions` - Tambah soal ke bank soal ujian.
- `POST /api/quizzes/:id/submit` - Kirim jawaban siswa & koreksi otomatis.

## 6. Presensi & Kehadiran (Attendance System)
- `GET /api/attendance/students` - Presensi harian siswa (opsional filter `?date=` dan `?class_id=`).
- `POST /api/attendance/students` - Catat presensi kehadiran siswa.
- `GET /api/attendance/teachers` - Presensi harian dewan guru.
- `POST /api/attendance/teachers` - Check-in kehadiran guru.

## 7. Komunikasi & Informasi
- `GET /api/announcements` - Papan pengumuman resmi sekolah.
- `POST /api/announcements` - Terbitkan pengumuman baru.
- `GET /api/messages` - Saluran pesan internal antar pengguna.
- `POST /api/messages` - Kirim pesan internal baru.

## 8. Persuratan & Arsip (Administration System)
- `GET /api/admin/letters` - Agenda persuratan dinas masuk dan keluar.
- `POST /api/admin/letters` - Catat surat dinas baru.
- `GET /api/admin/archives` - Arsip digital dokumen sekolah (KOSP, Akreditasi, SK).
- `POST /api/admin/archives` - Simpan berkas arsip digital.

## 9. Analitik & Dashboard
- `GET /api/dashboard` atau `GET /api/analytics/dashboard` - Statistik gabungan holistik.

## 10. AI Assistant Guru & Smart School
- `POST /api/ai/generate-lesson-plan` - Otomatisasi penyusunan Modul Ajar RPP Kurikulum Merdeka.
- `POST /api/ai/generate-questions` - Generator Bank Soal HOTS / AKM otomatis.
- `POST /api/ai/analyze-learning` - Analisis capaian belajar, diagnosis kelemahan & rekomendasi.
- `POST /api/ai/chat` - Konsultasi interaktif asisten cerdas guru dan sekolah.
