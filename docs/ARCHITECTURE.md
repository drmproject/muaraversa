# Muaraversa Architecture

## Frontend
User interface application.

Structure:
- Public interface
- Admin interface
- Shared assets

## Backend
API service menggunakan Cloudflare Worker.

Structure:
- `worker.js` sebagai entry point
- `routes/` untuk endpoint API
- `services/` untuk logic pendukung
- `database/` untuk konfigurasi dan migrasi data

## Database
Cloudflare D1.

Digunakan untuk:
- User management
- Student data
- Teacher data
- Class data
- School profile

## AI Engine
Modul kecerdasan buatan untuk fitur pembelajaran.
