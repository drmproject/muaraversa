-- Muaraversa Seed Data (Final Production)
-- Complete seed for: Super Admin, Admin Sekolah, Kepala Sekolah, Guru, Siswa, Orang Tua

-- Roles
INSERT OR IGNORE INTO roles (id, name) VALUES
(1, 'SUPER_ADMIN'),
(2, 'ADMIN'),
(3, 'KEPALA_SEKOLAH'),
(4, 'GURU'),
(5, 'SISWA'),
(6, 'ORANG_TUA');

-- Default School
INSERT OR REPLACE INTO school_profile 
(id, school_name, npsn, address, district, city, province, postal_code, phone, email, website, principal_name, principal_nip, accreditation)
VALUES
(1, 'SDN Muarasari 1', '20219876', 'Jl. Muarasari No. 45', 'Bogor Selatan', 'Kota Bogor', 'Jawa Barat', '16137', '0251-8321456', 'sdn.muarasari1@sch.id', 'https://muarasari1.sch.id', 'Dra. Hj. Nurjanah, M.Pd.', '196805121992032001', 'A');

-- Users
INSERT OR REPLACE INTO users (id, username, password_hash, name, email, role, status, phone) VALUES
(1, 'superadmin', 'admin123', 'M. Fadillah, S.Kom (Super Admin)', 'superadmin@muaraversa.sch.id', 'SUPER_ADMIN', 'active', '081234567801'),
(2, 'admin', 'admin123', 'Siti Rahmawati, A.Md (Admin Sekolah)', 'admin@muaraversa.sch.id', 'ADMIN', 'active', '081234567802'),
(3, 'kepsek', 'admin123', 'Dra. Hj. Nurjanah, M.Pd. (Kepala Sekolah)', 'kepsek@muaraversa.sch.id', 'KEPALA_SEKOLAH', 'active', '081234567803'),
(4, 'guru1', 'admin123', 'Budi Santoso, S.Pd', 'budi.santoso@muaraversa.sch.id', 'GURU', 'active', '081234567804'),
(5, 'guru2', 'admin123', 'Siti Aminah, M.Pd', 'siti.aminah@muaraversa.sch.id', 'GURU', 'active', '081234567805'),
(6, 'guru3', 'admin123', 'Asep Saepudin, S.Kom', 'asep.saepudin@muaraversa.sch.id', 'GURU', 'active', '081234567806'),
(7, 'siswa1', 'admin123', 'Ahmad Fauzi', 'ahmad.fauzi@siswa.muaraversa.sch.id', 'SISWA', 'active', '081234567807'),
(8, 'siswa2', 'admin123', 'Nurul Hidayah', 'nurul.hidayah@siswa.muaraversa.sch.id', 'SISWA', 'active', '081234567808'),
(9, 'siswa3', 'admin123', 'Rizky Pratama', 'rizky.pratama@siswa.muaraversa.sch.id', 'SISWA', 'active', '081234567809'),
(10, 'ortu1', 'admin123', 'H. Hendra Gunawan (Orang Tua Ahmad)', 'hendra.gunawan@gmail.com', 'ORANG_TUA', 'active', '081234567810');

-- Academic Year
INSERT OR REPLACE INTO academic_years (id, year_name, semester, is_active) VALUES
(1, '2024/2025', 'Ganjil', 1),
(2, '2024/2025', 'Genap', 0);

-- Subjects
INSERT OR REPLACE INTO subjects (id, code, name, category, kkm) VALUES
(1, 'MAT-01', 'Matematika', 'Wajib', 75),
(2, 'IND-01', 'Bahasa Indonesia', 'Wajib', 75),
(3, 'IPA-01', 'Ilmu Pengetahuan Alam', 'Wajib', 75),
(4, 'IPS-01', 'Ilmu Pengetahuan Sosial', 'Wajib', 75),
(5, 'PAI-01', 'Pendidikan Agama Islam', 'Wajib', 80),
(6, 'TIK-01', 'Informatika & TIK', 'Pilihan', 75);

-- Teachers
INSERT OR REPLACE INTO teachers (id, user_id, nip, name, subject, phone, email, status) VALUES
(1, 4, '198501012010011001', 'Budi Santoso, S.Pd', 'Matematika', '081234567804', 'budi.santoso@muaraversa.sch.id', 'PNS'),
(2, 5, '198803152012022002', 'Siti Aminah, M.Pd', 'Bahasa Indonesia', '081234567805', 'siti.aminah@muaraversa.sch.id', 'PNS'),
(3, 6, '199004202014031003', 'Asep Saepudin, S.Kom', 'Informatika & TIK', '081234567806', 'asep.saepudin@muaraversa.sch.id', 'PPPK');

-- Classes
INSERT OR REPLACE INTO classes (id, school_id, name, grade, room, teacher_id, academic_year_id) VALUES
(1, 1, 'Kelas 1-A', '1', 'Ruang 101', 1, 1),
(2, 1, 'Kelas 1-B', '1', 'Ruang 102', 2, 1),
(3, 1, 'Kelas 2-A', '2', 'Ruang 201', 3, 1);

-- Students
INSERT OR REPLACE INTO students (id, user_id, nis, nisn, name, gender, birth_place, birth_date, class_id, parent_id, address, status) VALUES
(1, 7, '1001', '0087654321', 'Ahmad Fauzi', 'L', 'Bogor', '2016-04-10', 1, 10, 'Jl. Raya Tajur No. 12, Bogor', 'Aktif'),
(2, 8, '1002', '0087654322', 'Nurul Hidayah', 'P', 'Bogor', '2016-08-22', 1, NULL, 'Jl. Ciawi Sejahtera No. 5', 'Aktif'),
(3, 9, '1003', '0087654323', 'Rizky Pratama', 'L', 'Bogor', '2015-11-05', 3, NULL, 'Jl. Pajajaran Indah No. 18', 'Aktif');

-- Schedules
INSERT OR REPLACE INTO schedules (id, class_id, subject_id, teacher_id, day, time_start, time_end, room) VALUES
(1, 1, 1, 1, 'Senin', '07:30', '09:00', 'Ruang 101'),
(2, 1, 2, 2, 'Senin', '09:15', '10:45', 'Ruang 101'),
(3, 1, 3, 1, 'Selasa', '07:30', '09:00', 'Lab Sains'),
(4, 1, 6, 3, 'Rabu', '08:00', '09:30', 'Lab Komputer');

-- Materials
INSERT OR REPLACE INTO materials (id, class_id, subject_id, teacher_id, title, type, description, file_url) VALUES
(1, 1, 1, 1, 'Pengenalan Bilangan Cacah 1 sampai 100', 'Modul', 'Modul ajar Kurikulum Merdeka pengenalan konsep angka dan pola bilangan dasar.', '/docs/modul-matematika-1.pdf'),
(2, 1, 2, 2, 'Membaca Kalimat Sederhana dan Suku Kata', 'LKPD', 'Lembar Kerja Peserta Didik untuk latihan menyusun suku kata bergambar.', '/docs/lkpd-bahasa-1.pdf'),
(3, 1, 6, 3, 'Dasar Pengoperasian Komputer dan Mouse', 'Modul', 'Mengenal perangkat keras dan etika digital sehat bagi siswa sekolah dasar.', '/docs/modul-tik-dasar.pdf');

-- Assignments
INSERT OR REPLACE INTO assignments (id, class_id, subject_id, teacher_id, title, description, deadline, max_score) VALUES
(1, 1, 1, 1, 'Latihan Berhitung Penjumlahan 1-20', 'Kerjakan soal latihan di buku tulis hal 15-17 lalu laporkan jawabannya.', '2026-10-15T23:59:00Z', 100),
(2, 1, 2, 2, 'Membaca Cerita Fabel Kancil dan Buaya', 'Rekam bacaan atau tuliskan 3 pesan moral dari fabel.', '2026-10-18T23:59:00Z', 100);

-- Submissions
INSERT OR REPLACE INTO submissions (id, assignment_id, student_id, submission_text, score, feedback, submitted_at, graded_at) VALUES
(1, 1, 1, 'Sudah dikerjakan di buku tulis dan semua 10 soal sudah selesai dengan teliti.', 95, 'Sangat rapi dan tepat, pertahankan ketelitian!', '2026-09-28T09:00:00Z', '2026-09-28T14:00:00Z');

-- Quizzes & Questions
INSERT OR REPLACE INTO quizzes (id, class_id, subject_id, teacher_id, title, duration_minutes, passing_grade, is_active) VALUES
(1, 1, 1, 1, 'Kuis Formatif Matematika 1: Penjumlahan & Pengurangan', 30, 75, 1);

INSERT OR REPLACE INTO questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(1, 1, 'Berapakah hasil dari 14 + 18?', '30', '32', '34', '36', 'B', '14 + 18 = 32.'),
(2, 1, 'Ibu membeli 25 butir telur, pecah 6 butir. Berapakah sisa telur ibu?', '18', '19', '20', '21', 'B', '25 - 6 = 19 butir telur.');

-- Grades
INSERT OR REPLACE INTO grades (id, student_id, subject_id, academic_year_id, tugas_avg, uts, uas, final_grade, predicate, notes) VALUES
(1, 1, 1, 1, 92.5, 90.0, 94.0, 92.2, 'A', 'Kemampuan pemecahan masalah numerik sangat unggul.'),
(2, 1, 2, 1, 88.0, 85.0, 90.0, 87.7, 'A', 'Sangat lancar membaca teks naratif dan memahami isi bacaan.'),
(3, 1, 6, 1, 95.0, 92.0, 96.0, 94.4, 'A', 'Sangat terampil menggunakan aplikasi edukatif komputer.');

-- Student Attendance
INSERT OR REPLACE INTO student_attendance (id, student_id, class_id, date, status, note, recorded_by) VALUES
(1, 1, 1, '2026-09-29', 'Hadir', 'Tepat waktu', 1),
(2, 2, 1, '2026-09-29', 'Hadir', 'Tepat waktu', 1),
(3, 3, 3, '2026-09-29', 'Sakit', 'Surat dokter terlampir', 3);

-- Teacher Attendance
INSERT OR REPLACE INTO teacher_attendance (id, teacher_id, date, check_in, check_out, status, note) VALUES
(1, 1, '2026-09-29', '06:45', '14:30', 'Hadir', 'Mengajar tepat waktu'),
(2, 2, '2026-09-29', '06:50', '14:30', 'Hadir', 'Mengajar tepat waktu'),
(3, 3, '2026-09-29', '07:00', '14:30', 'Hadir', 'Piket perpustakaan & lab');

-- Announcements
INSERT OR REPLACE INTO announcements (id, title, content, category, target_role, author_id) VALUES
(1, 'Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil', 'Diberitahukan kepada seluruh guru, siswa, dan orang tua bahwa PTS Ganjil akan dimulai tanggal 12 Oktober 2026. Jadwal lengkap dapat diakses pada menu Jadwal.', 'Akademik', 'ALL', 3),
(2, 'Rapat Koordinasi Komite Sekolah dan Sosialisasi Program Smart School', 'Undangan terbuka kepada seluruh orang tua siswa untuk hadir dalam sosialisasi ekosistem digital Muaraversa pada hari Sabtu mendatang.', 'Umum', 'ORANG_TUA', 3);

-- School Letters
INSERT OR REPLACE INTO school_letters (id, letter_number, type, title, sender_or_recipient, letter_date, description, status) VALUES
(1, '421.2/015/SD-MS1/IX/2026', 'Keluar', 'Surat Undangan Sosialisasi Kurikulum Merdeka', 'Dinas Pendidikan Kota Bogor', '2026-09-20', 'Undangan permohonan narasumber workshop guru.', 'Disetujui'),
(2, '421.1/108/DISDIK/2026', 'Masuk', 'Pemberitahuan Akreditasi dan Evaluasi Diri Sekolah', 'Badan Akreditasi Nasional', '2026-09-25', 'Jadwal visitasi asesmen lapangan akreditasi.', 'Diproses');

-- Digital Archives
INSERT OR REPLACE INTO digital_archives (id, title, category, document_number, year, file_size, file_url, uploaded_by) VALUES
(1, 'Kurikulum Operasional Satuan Pendidikan (KOSP) 2026', 'Kurikulum', 'SK-042/KOSP/2026', '2026', '4.2 MB', '/docs/KOSP-2026.pdf', 1),
(2, 'Sertifikat Akreditasi Predikat A SDN Muarasari 1', 'Akreditasi', 'BAN-SM/982/2023', '2023-2028', '1.8 MB', '/docs/Sertifikat-Akreditasi.pdf', 1);
