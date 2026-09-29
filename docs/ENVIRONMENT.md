# MUARAVERSA Environment Configuration

Konfigurasi environment variabel untuk deployment produksi.

## Variabel Environment

```bash
# Port Web Server (Wajib di port 3000 untuk preview AI Studio)
PORT=3000

# Base URL API
API_URL=http://localhost:3000

# Nama dan Versi Aplikasi
APP_NAME=Muaraversa
APP_VERSION=1.0.0

# Google Gemini AI API Key (Opsional - Jika tidak diset, sistem otomatis menggunakan Smart Pedagogical Fallback Engine)
GEMINI_API_KEY=
```

File `.env.example` telah disediakan pada root direktori.
