# MUARAVERSA Database Architecture

Database relasional produksi untuk platform ekosistem sekolah digital Muaraversa.

## Skema Tabel Relasional

1. `roles`: Master hak akses (SUPER_ADMIN, ADMIN, KEPALA_SEKOLAH, GURU, SISWA, ORANG_TUA).
2. `users`: Entitas pengguna, autentikasi password_hash, status, profil, avatar.
3. `sessions`: Token sesi login aktif dan masa kedaluwarsa.
4. `school_profile`: Data resmi satuan pendidikan (NPSN, Kepala Sekolah, Alamat, Akreditasi).
5. `academic_years`: Tahun ajaran & semester aktif.
6. `subjects`: Mata pelajaran & KKM.
7. `teachers`: Data dewan guru, NIP, mapel, nomor kontak, relasi `users(id)`.
8. `classes`: Rombongan belajar, tingkatan kelas, ruang, relasi wali kelas `teachers(id)`.
9. `students`: Peserta didik, NIS, NISN, jenis kelamin, relasi kelas `classes(id)` dan relasi orang tua `users(id)`.
10. `schedules`: Jadwal mingguan per rombel, hari, jam, relasi `teachers` dan `subjects`.
11. `materials`: Modul ajar, LKPD, ringkasan belajar digital.
12. `assignments`: Tugas siswa, deadline, bobot skor.
13. `submissions`: Pengumpulan tugas, lampiran, skor penilaian, umpan balik guru.
14. `quizzes`: Paket ujian Computer Based Test (CBT), durasi, passing grade KKM.
15. `questions`: Bank butir soal pilihan ganda, kunci jawaban, dan pembahasan.
16. `grades`: Buku nilai (Tugas, UTS, UAS, Nilai Akhir, Predikat, Catatan Kompetensi).
17. `student_attendance`: Presensi harian siswa (Hadir, Sakit, Izin, Alpa).
18. `teacher_attendance`: Presensi harian pendidik (Check-in, Check-out, Keterangan).
19. `announcements`: Pengumuman resmi sekolah dan target audiens peran.
20. `internal_messages`: Pesan internal antara orang tua dan wali kelas / admin.
21. `school_letters`: Agenda persuratan dinas masuk, keluar, dan surat keterangan.
22. `digital_archives`: Arsip dokumen digital (Kurikulum KOSP, Akreditasi, SK).
23. `ai_lesson_plans`: Arsip modul ajar Kurikulum Merdeka yang disusun oleh AI.
24. `ai_question_packs`: Arsip paket soal HOTS/AKM buatan AI.
25. `audit_logs`: Catatan keamanan dan aktivitas sistem.

## Migrasi & Seed

- Migrasi database tersimpan dalam direktori `/database/migrations/` (001 sampai 012).
- Seed data awal tersimpan dalam `/database/seed.sql`.
- Dalam runtime Express produksi, data tersimpan persisten di `/database/muaraversa_store.json` sehingga seluruh penambahan guru, siswa, nilai, presensi, dan modul ajar tersimpan aman dan tidak hilang saat restart.
