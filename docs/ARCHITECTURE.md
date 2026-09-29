# MUARAVERSA System Architecture (Final Production)

Platform Digital Ekosistem Sekolah Terpadu: Menghubungkan Sekolah, Kepala Sekolah, Admin, Guru, Siswa, Orang Tua, Data Akademik, Administrasi, Pembelajaran, Komunikasi, Analitik, dan Asisten AI.

## 1. Arsitektur Komprehensif (High-Level Overview)

```
+----------------------------------------------------------------------------------+
|                            MUARAVERSA CLIENT PORTAL                              |
|   (Mobile-First Responsive Web, Single-Pane Executive Dashboard & Unified UI)     |
|   [Super Admin] [Admin Sekolah] [Kepala Sekolah] [Guru] [Siswa] [Orang Tua]      |
+----------------------------------------+-----------------------------------------+
                                         | REST API (JSON / HTTP)
                                         v
+----------------------------------------------------------------------------------+
|                              EXPRESS APPLICATION ENGINE                          |
|  - Role-Based Access Control (RBAC) & Multi-Role Session Manager                |
|  - Academic, Attendance, CBT, Grade & Administration Controllers                |
|  - Audit Log & System Health Monitor                                            |
+-------------------+--------------------------------------+-----------------------+
                    |                                      |
                    v                                      v
+------------------------------------+   +-----------------------------------------+
|    RELATIONAL DATA STORE           |   |       MUARAVERSA AI SMART ENGINE        |
|  - Users, Teachers, Students       |   |  - Google Gemini 3.8 Flash SDK          |
|  - Classes, Subjects, Schedules    |   |  - Modul Ajar RPP Kurikulum Merdeka     |
|  - Assignments, Quizzes & Grades   |   |  - Generator Soal HOTS / AKM Otomatis   |
|  - Attendance, Letters & Archives  |   |  - Analisis Capaian Belajar Siswa       |
|  - Persistent Store: JSON/SQLite   |   |  - Asisten Konsultasi Guru Interaktif   |
+------------------------------------+   +-----------------------------------------+
```

## 2. Implementasi 10 Batch Development

1. **Batch Foundation**:
   - Struktur repositori rapi, konfigurasi environment standar, dokumentasi teknis menyeluruh, script start/dev/lint.
2. **Batch Core System**:
   - Autentikasi multi-peran, sesi login, proteksi RBAC, switch persona instan, audit logging.
3. **Batch School Management**:
   - Pengelolaan profil sekolah, rombongan belajar (kelas), data guru, data siswa, kurikulum mapel, tahun ajaran aktif.
4. **Batch Academic System**:
   - Jadwal mingguan terstruktur, modul ajar, lembar kerja siswa (LKPD), tugas & pengumpulan tugas, buku nilai & e-raport digital berpredikat.
5. **Batch Attendance System**:
   - Presensi digital harian siswa & guru, rekapitulasi kehadiran real-time, persentase kehadiran sekolah.
6. **Batch Communication System**:
   - Publikasi pengumuman berjenjang (Semua, Guru, Siswa, Orang Tua), saluran pesan internal privat antara orang tua dan wali kelas.
7. **Batch Administration System**:
   - Agenda persuratan dinas masuk dan keluar, penerbitan surat keterangan aktif siswa, arsip digital berkas KOSP dan akreditasi.
8. **Batch Analytics System**:
   - Dashboard analitik terpadu, rasio siswa-guru, persentase kelulusan KKM, grafik performa akademik.
9. **Batch AI System**:
   - Integrasi `@google/genai` (model `gemini-3.8-flash`) dengan fallback pedagogis:
     - Pembuat Modul Ajar RPP Kurikulum Merdeka otomatis
     - Generator Paket Soal HOTS / AKM mandiri
     - Analisis Profil & Rekomendasi Belajar Siswa
     - Chat Asisten Cerdas Guru
10. **Batch Smart School**:
    - Satu portal ekosistem terpadu, responsive lintas perangkat, cetak raport & dokumen, siap produksi.

## 3. Matriks 6 Peran (Role-Based Access Control)

| Modul & Fitur | SUPER ADMIN | ADMIN SEKOLAH | KEPALA SEKOLAH | GURU | SISWA | ORANG TUA |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Konfigurasi & Audit Log | ✓ | - | - | - | - | - |
| Master Data Sekolah | ✓ | ✓ | Baca | Baca | - | - |
| Manajemen Guru & Siswa | ✓ | ✓ | Baca | Baca | - | - |
| Evaluasi & Analitik Sekolah | ✓ | ✓ | ✓ | - | - | - |
| Modul Ajar & LKPD | ✓ | ✓ | Baca | Kelola | Baca/Unduh | - |
| Tugas & Penilaian | ✓ | ✓ | Baca | Kelola | Kerjakan | Pantau |
| Ujian CBT Online | ✓ | ✓ | Baca | Kelola | Kerjakan | Pantau |
| Raport Digital (E-Raport) | ✓ | ✓ | Verifikasi | Input | Lihat | Lihat |
| Presensi Harian | ✓ | ✓ | Rekap | Catat | Rekap Diri | Pantau Anak |
| Pengumuman Sekolah | ✓ | ✓ | ✓ | Baca | Baca | Baca |
| Pesan Internal | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Persuratan & Arsip | ✓ | ✓ | Disposisi | - | - | - |
| AI Assistant Guru | ✓ | ✓ | ✓ | ✓ | - | - |
