# Muaraversa Environment Setup

## Project

Name:
Muaraversa

Version:
0.1.0

Status:
Foundation cleanup completed

## Frontend

Technology:

- HTML
- CSS
- JavaScript

Folder:

frontend/

Deployment target:

- Cloudflare Pages

## Backend

Technology:

- Cloudflare Worker

Folder:

backend/

Deployment target:

- Cloudflare Workers

Development command:

```bash
npm run dev
```

Deploy command:

```bash
npm run deploy
```

## Database

Technology:

- Cloudflare D1 Database

Schema source:

- database/migrations/

## Environment Checklist

Before deployment:

- Configure Cloudflare account
- Configure Worker bindings
- Configure D1 database binding
- Verify API endpoint
- Test authentication flow

## Development Flow

Frontend
↓
Backend API
↓
Database
↓
AI Engine

## Deployment

Backend deployment uses:

- Cloudflare Worker
- Cloudflare D1 Database

Frontend deployment uses:

- Cloudflare Pages
