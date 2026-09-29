# MUARAVERSA - Platform Digital Ekosistem Sekolah Terpadu

> **Status**: Final Production Ready (Batch Foundation s/d Batch Smart School Selesai)  
> **Repository**: `drmproject/muaraversa`  
> **Teknologi**: Node.js 22, Express, Google Gemini 3.8 Flash SDK, Relational Architecture, Mobile-First Web Portal.

---

## 🌟 Visi Utama

**MUARAVERSA** bukan sekadar website sekolah atau sistem CRUD biasa. MUARAVERSA adalah ekosistem digital terintegrasi yang menghubungkan seluruh pemangku kepentingan sekolah:

* **Sekolah**: Profil resmi, akreditasi, dan identitas kelembagaan.
* **Kepala Sekolah**: Dashboard monitoring eksekutif, evaluasi pembelajaran, dan verifikasi rapor.
* **Admin Sekolah**: Master data guru, siswa, kelas/rombel, mata pelajaran, dan persuratan dinas.
* **Guru**: Manajemen rombel, modul ajar, LKPD, penugasan, presensi harian, nilai, dan asisten AI.
* **Siswa**: Portal pembelajaran, unduh materi, kumpul tugas, ujian CBT online, dan e-raport.
* **Orang Tua**: Transparansi presensi harian anak, pemantauan nilai, dan konsultasi privat wali kelas.
* **AI Assistant**: Ditenagai model **Gemini 3.8 Flash** untuk otomatisasi modul ajar Kurikulum Merdeka, penyusunan bank soal HOTS/AKM, dan analisis hasil belajar siswa.

---

## 📦 Ringkasan 10 Batch Development Selesai

1. ✅ **Batch Foundation**: Audit arsitektur, standarisasi package.json, konfigurasi lingkungan, dokumentasi teknis.
2. ✅ **Batch Core System**: Autentikasi multi-peran (6 Role RBAC), manajemen sesi, user management, audit log aktivitas.
3. ✅ **Batch School Management**: Profil sekolah, master data guru, siswa, kelas, mata pelajaran, tahun ajaran aktif.
4. ✅ **Batch Academic System**: Jadwal mingguan, modul ajar Kurikulum Merdeka, LKPD, tugas & pengumpulan, buku nilai, dan e-raport digital.
5. ✅ **Batch Attendance System**: Presensi harian siswa, presensi guru, statistik kehadiran real-time.
6. ✅ **Batch Communication System**: Papan pengumuman berjenjang sekolah, notifikasi, pesan internal privat.
7. ✅ **Batch Administration System**: Buku agenda surat masuk/keluar dinas, surat keterangan aktif siswa, arsip berkas digital.
8. ✅ **Batch Analytics System**: Dashboard analitik holistik, rasio guru-siswa, rata-rata akademik kelas.
9. ✅ **Batch AI System**: Integrasi `@google/genai` (Gemini 3.8 Flash) untuk generator Modul Ajar, Soal HOTS/AKM, Analisis Belajar Siswa, dan Chatbot Asisten Guru.
10. ✅ **Batch Smart School**: Integrasi satu pintu (Single Pane of Glass) seluruh modul dan switch persona role instan.

---

## 🚀 Menjalankan Aplikasi

```bash
# Menjalankan server produksi
npm start

# Mode development
npm run dev

# Validasi kode & sintaks
npm run lint
```

Akses aplikasi di browser pada: `http://localhost:3000`

---

## 🔑 Akun Uji Coba Multi-Role

Tersedia fitur **Switch Persona Role** langsung pada navigasi atas atau login mandiri:

| Role | Username | Password | Keterangan |
|---|---|---|---|
| **Super Admin** | `superadmin` | `admin123` | Kontrol sistem & audit log |
| **Admin Sekolah** | `admin` | `admin123` | Pengelolaan data operasional |
| **Kepala Sekolah** | `kepsek` | `admin123` | Monitoring & evaluasi |
| **Guru** | `guru1` | `admin123` | Wali Kelas 1-A (Budi Santoso) |
| **Siswa** | `siswa1` | `admin123` | Peserta Didik (Ahmad Fauzi) |
| **Orang Tua** | `ortu1` | `admin123` | Wali Murid (H. Hendra) |
