# Task Management System - Setup Guide

Panduan lengkap untuk setup dan menjalankan aplikasi Task Management System.

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- **Go** (versi 1.19 atau lebih tinggi) - [Download](https://golang.org/dl/)
- **Node.js** (versi 18 atau lebih tinggi) - [Download](https://nodejs.org/)
- **PostgreSQL** (versi 12 atau lebih tinggi) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## 🗄️ Database Setup

### 1. Buat Database PostgreSQL

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database baru
CREATE DATABASE task_management;

# Keluar dari psql
\q
```

### 2. Import Schema Database

```bash
# Dari root directory project
psql -U postgres -d task_management -f db.sql
```

Atau jika menggunakan password:

```bash
psql -U postgres -d task_management -W -f db.sql
```

## 🔧 Backend Setup

### 1. Navigate ke Backend Directory

```bash
cd backend
```

### 2. Setup Environment Variables

Buat file `.env` di folder `backend/`:

```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi database Anda:

```env
# Database Configuration
DB_DRIVER=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management

# Application Configuration
APP_PORT=8080

# JWT Configuration
JWT_SECRET=your_secret_key_here_change_in_production
```

### 3. Install Go Dependencies

```bash
go mod download
go mod tidy
```

### 4. Run Backend Server

```bash
go run ./cmd/app/main.go
```

Backend akan berjalan di `http://localhost:8080`

**Output yang diharapkan:**
```
We are connected to the postgres database
[GIN-debug] Loaded HTML Templates (0): 
[GIN-debug] Listening and serving HTTP on :8080
```

## 🎨 Frontend Setup

### 1. Navigate ke Frontend Directory

```bash
cd frontend
```

### 2. Setup Environment Variables

Buat file `.env.local` di folder `frontend/`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 3. Install Node Dependencies

```bash
npm install
# atau
yarn install
```

### 4. Run Frontend Development Server

```bash
npm run dev
# atau
yarn dev
```

Frontend akan berjalan di `http://localhost:3000`

**Output yang diharapkan:**
```
> frontend@0.1.0 dev
> next dev --webpack

  ▲ Next.js 16.0.1
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

## 🧪 Testing the Application

### 1. Akses Frontend

Buka browser dan navigasi ke: `http://localhost:3000`

### 2. Login dengan Credentials

Gunakan salah satu akun yang sudah ada di database:

**Akun 1:**
- Email: `yoga@company.com`
- Password: `password123` (atau sesuai dengan yang ada di database)

**Akun 2:**
- Email: `yogaanjay@company.com`
- Password: `password123`

**Akun 3:**
- Email: `test@example.com`
- Password: `password123`

### 3. Test Features

- ✅ Login dengan email dan password
- ✅ Lihat daftar tasks di dashboard
- ✅ Buat task baru
- ✅ Edit task
- ✅ Hapus task
- ✅ Filter tasks berdasarkan status dan tanggal
- ✅ Logout

## 📡 API Testing dengan Postman

### 1. Import Postman Collection

- Buka Postman
- Click `Import`
- Pilih file `task-management.postman_collection.json`
- Collection akan ter-import

### 2. Test Endpoints

**Authentication:**
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru

**Tasks:**
- `GET /api/task/list` - Get all tasks (paginated)
- `POST /api/task` - Create task
- `GET /api/task/{id}` - Get task by ID
- `PUT /api/task/{id}` - Update task
- `DELETE /api/task/{id}` - Delete task
- `POST /api/task/byfilter` - Filter tasks

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database

**Error:**
```
Cannot connect to postgres database
This is the error: connection refused
```

**Solusi:**
1. Pastikan PostgreSQL sudah running
2. Cek konfigurasi `.env` (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD)
3. Pastikan database `task_management` sudah dibuat

### Frontend tidak bisa connect ke backend

**Error:**
```
Koneksi Gagal - Tidak dapat terhubung ke server backend
```

**Solusi:**
1. Pastikan backend sudah running di `http://localhost:8080`
2. Cek `.env.local` di frontend: `NEXT_PUBLIC_BACKEND_URL=http://localhost:8080`
3. Cek CORS settings di backend

### Port sudah digunakan

**Error:**
```
listen tcp :8080: bind: address already in use
```

**Solusi:**
1. Ubah port di `.env` backend: `APP_PORT=8081`
2. Atau kill process yang menggunakan port tersebut

### Password tidak cocok saat login

**Solusi:**
1. Password di database sudah di-hash
2. Gunakan credentials yang sudah ada di `db.sql`
3. Atau register akun baru melalui aplikasi

## 📁 Project Structure

```
task-management/
├── backend/
│   ├── cmd/
│   │   ├── app/main.go              # Entry point
│   │   └── migrate/migrate.go       # Database migration
│   ├── config/
│   │   └── database-config.go       # Database configuration
│   ├── internal/
│   │   ├── controller/              # Business logic handlers
│   │   ├── delivery/api/            # Route definitions
│   │   ├── dto/                     # Data Transfer Objects
│   │   ├── helper/                  # Utility functions
│   │   ├── middleware/              # CORS, Auth, Logger
│   │   ├── models/                  # Database models
│   │   ├── repository/              # Data access layer
│   │   ├── service/                 # Business logic services
│   │   └── utils/                   # Crypto, UUID, Time utilities
│   ├── .env.example                 # Environment variables template
│   └── go.mod                       # Go dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/                 # API routes
│   │   │   ├── dashboard/           # Dashboard page
│   │   │   ├── login/               # Login page
│   │   │   └── layout.tsx           # Root layout
│   │   └── helper/
│   │       └── api.tsx              # API configuration
│   ├── .env.example                 # Environment variables template
│   ├── .env.local                   # Local environment variables
│   ├── package.json                 # Node dependencies
│   └── tsconfig.json                # TypeScript configuration
│
├── db.sql                           # Database schema
├── SETUP.md                         # Setup guide (this file)
└── README.md                        # Project overview
```

## 🚀 Production Deployment

### Backend Deployment

1. Build binary:
```bash
cd backend
go build -o task-management ./cmd/app
```

2. Set environment variables untuk production
3. Run binary:
```bash
./task-management
```

### Frontend Deployment

1. Build Next.js:
```bash
cd frontend
npm run build
```

2. Deploy ke Vercel, Netlify, atau server lain

## 📚 Additional Resources

- [Go Documentation](https://golang.org/doc/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Gin Web Framework](https://gin-gonic.com/)
- [GORM Documentation](https://gorm.io/)

## 💡 Tips

- Gunakan `.env` untuk development, jangan commit ke git
- Selalu update dependencies: `go mod tidy` dan `npm update`
- Backup database secara berkala
- Monitor logs untuk debugging

## 📞 Support

Jika ada masalah, cek:
1. Console logs di backend dan frontend
2. Network tab di browser DevTools
3. Database connection
4. Environment variables

---

**Happy coding! 🎉**
