# Task Management System

A full-stack task management application built with Go, TypeScript, and PostgreSQL.

## ✨ Features

- ✅ User registration and login with JWT authentication
- ✅ Create, edit, delete tasks
- ✅ Task assignment and status tracking (To Do, In Progress, Done)
- ✅ Filter tasks by status and date range
- ✅ Pagination support
- ✅ Responsive web interface
- ✅ REST API backend
- ✅ Real-time form validation

## 🏗️ Tech Stack

### Backend
- **Language**: Go 1.21+
- **Framework**: Gin Web Framework
- **ORM**: GORM
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Token)
- **API**: REST API

### Frontend
- **Framework**: Next.js 16.0.1
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Alerts**: SweetAlert2
- **State Management**: React Hooks

### Database
- **DBMS**: PostgreSQL 12+
- **Schema**: Pre-defined with migrations

## 📁 Folder Structure

```
task-management/
├── backend/                 # Go REST API
│   ├── cmd/app/            # Application entry point
│   ├── config/             # Database configuration
│   ├── internal/
│   │   ├── controller/     # Request handlers
│   │   ├── delivery/       # Route definitions
│   │   ├── dto/            # Data transfer objects
│   │   ├── helper/         # Utility functions
│   │   ├── middleware/     # CORS, Auth, Logger
│   │   ├── models/         # Database models
│   │   ├── repository/     # Data access layer
│   │   ├── service/        # Business logic
│   │   └── utils/          # Crypto, UUID utilities
│   ├── .env.example        # Environment template
│   └── go.mod              # Go dependencies
│
├── frontend/               # Next.js web app
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/        # API routes
│   │   │   ├── dashboard/  # Main dashboard
│   │   │   ├── login/      # Login page
│   │   │   └── layout.tsx  # Root layout
│   │   └── helper/         # API configuration
│   ├── .env.example        # Environment template
│   ├── .env.local          # Local environment
│   ├── package.json        # Node dependencies
│   └── tsconfig.json       # TypeScript config
│
├── db.sql                  # Database schema
├── SETUP.md                # Detailed setup guide
├── run-backend.sh          # Backend startup script (Linux/Mac)
├── run-backend.bat         # Backend startup script (Windows)
├── run-frontend.sh         # Frontend startup script (Linux/Mac)
├── run-frontend.bat        # Frontend startup script (Windows)
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Go 1.21+
- Node.js 18+
- PostgreSQL 12+

### 1. Database Setup

```bash
# Create database
createdb task_management

# Import schema
psql -U postgres -d task_management -f db.sql
```

### 2. Backend Setup

```bash
# Linux/Mac
./run-backend.sh

# Windows
run-backend.bat
```

Backend runs on `http://localhost:8080`

### 3. Frontend Setup

In a new terminal:

```bash
# Linux/Mac
./run-frontend.sh

# Windows
run-frontend.bat
```

Frontend runs on `http://localhost:3000`

### 4. Login

Use one of the pre-configured accounts:
- Email: `yoga@company.com`
- Email: `yogaanjay@company.com`
- Email: `test@example.com`

## 📖 Detailed Setup

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/change-password` - Change password (protected)

### Tasks
- `GET /api/task/list` - Get all tasks (paginated)
- `POST /api/task` - Create new task
- `GET /api/task/{id}` - Get task by ID
- `PUT /api/task/{id}` - Update task
- `DELETE /api/task/{id}` - Delete task
- `POST /api/task/byfilter` - Filter tasks by status and date

## 🧪 Testing with Postman

1. Import `task-management.postman_collection.json` into Postman
2. Set `{{base_url}}` to `http://localhost:8080`
3. Test all endpoints

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with crypto
- ✅ CORS protection
- ✅ Email uniqueness validation
- ✅ Account activation/deactivation
- ✅ Last login tracking

## 📊 Database Schema

### accounts table
- `id` - Primary key
- `name` - User name
- `email` - Unique email
- `password` - Hashed password
- `is_active` - Account status
- `last_login` - Last login timestamp
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### Tasks table
- `id` - Primary key
- `create_accounts_id` - Creator user ID (FK)
- `update_accounts_id` - Last updater user ID (FK)
- `accounts_id` - Task owner user ID (FK)
- `title` - Task title
- `description` - Task description
- `status` - Task status (todo, in_progress, done)
- `deadline` - Task deadline

## 🐛 Troubleshooting

### Backend Connection Error
```
Cannot connect to postgres database
```
**Solution**: Check `.env` file and ensure PostgreSQL is running

### Frontend Connection Error
```
Koneksi Gagal - Tidak dapat terhubung ke server backend
```
**Solution**: Ensure backend is running on `http://localhost:8080`

### Port Already in Use
**Solution**: Change port in `.env` or kill the process using the port

## 📚 Additional Resources

- [Go Documentation](https://golang.org/doc/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Gin Web Framework](https://gin-gonic.com/)
- [GORM Documentation](https://gorm.io/)

## 📝 Environment Variables

### Backend (.env)
```env
DB_DRIVER=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
APP_PORT=8080
JWT_SECRET=your_secret_key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues and questions:
1. Check the [SETUP.md](./SETUP.md) guide
2. Review the API documentation in Postman
3. Check application logs for errors

---

**Happy coding! 🎉**
