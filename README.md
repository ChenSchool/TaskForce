# TaskForce - Aircraft Maintenance Task Management System

A full-stack web application for managing aircraft maintenance tasks, personnel assignments, and training records with shift-based workflows.

## Project Overview

TaskForce is an enterprise-grade maintenance management system designed for aircraft maintenance operations. It provides comprehensive tools for tracking tasks, managing personnel, scheduling shifts, and maintaining training records across multiple aircraft and maintenance teams.

### Key Features

- **Task Management**: Create, assign, and track maintenance tasks across three shifts (1st, 2nd, 3rd)
- **Personnel Management**: Track personnel information, specialties, roles, and shift assignments
- **Training Tracker**: Monitor training progress and completion status for all personnel
- **Assignment System**: Multi-personnel task assignments with role-based responsibilities
- **Archive System**: Automated and manual archiving of completed work with scheduling
- **Dashboard Analytics**: Real-time statistics and data visualization
- **User Management**: Role-based access control (Manager, Supervisor, Task Viewer)
- **Dark Mode**: User-customizable light/dark theme with persistent preferences
- **Audit Logging**: Comprehensive activity tracking for compliance and debugging
- **Export Features**: CSV and PDF export capabilities for reporting

## Architecture

### Tech Stack

**Frontend** (`react_taskforce/`)
- React 19.1.0
- React Router 7.6.0 (client-side routing)
- Bootstrap 5.3.6 (UI framework)
- Axios (HTTP client)
- React Toastify (notifications)
- Recharts (data visualization)
- jsPDF + Papa Parse (export functionality)

**Backend** (`TaskforceAPI/`)
- Node.js with TypeScript
- Express 5.1.0 (REST API)
- MySQL 2.18.1 (database)
- JWT (authentication)
- Bcrypt (password hashing)
- Express Validator (input validation)
- Helmet (security headers)
- Express Rate Limit (DDoS protection)
- Node-Cron (scheduled tasks)

**Testing**
- Jest 29.7.0 (test framework)
- Supertest 7.0.0 (API testing)
- 173 automated test cases covering:
  - Authentication & Authorization
  - CRUD operations for all entities
  - SQL injection prevention
  - Performance benchmarks
  - Concurrent request handling

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL Server (v8.0+)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ChenSchool/TaskForce.git
cd TaskForce
```

2. **Set up the Backend API**

```bash
cd TaskforceAPI
npm install

# Create .env file with your configuration
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secrets
```

**Environment Variables** (`.env`):
```env
MY_SQL_DB_HOST=localhost
MY_SQL_DB_USERNAME=root
MY_SQL_DB_PASSWORD=your_password
MY_SQL_DB_DATABASE=taskforce_tracker
MY_SQL_DB_PORT=3306
PORT=5000
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
NODE_ENV=development
```

3. **Initialize Database**

```bash
# Run database setup script
mysql -u root -p < scripts/taskforce_tracker.sql

# (Optional) Seed test users
npm run test:seed
```

4. **Set up the Frontend**

```bash
cd ../react_taskforce
npm install
```

5. **Start Development Servers**

**Backend (Terminal 1):**
```bash
cd TaskforceAPI
npm run dev
# API runs on http://localhost:5000
```

**Frontend (Terminal 2):**
```bash
cd react_taskforce
npm start
# React app opens at http://localhost:3000
```

## Testing

The project includes 173 comprehensive automated tests:

```bash
cd TaskforceAPI

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Generate HTML coverage report
npm run test:report
```

**Test Coverage:**
- Aircraft CRUD (17 tests)
- Tasks CRUD with shift validation (31 tests)
- Personnel management (29 tests)
- Assignments (15 tests)
- Training records (19 tests)
- Users & authentication (27 tests)
- Archive scheduling (14 tests)
- Performance benchmarks (21 tests)

## Project Structure

```
TaskForce/
├── react_taskforce/              # Frontend React Application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── api/                  # API service modules
│   │   ├── components/           # React components
│   │   ├── context/              # React context (Auth, etc.)
│   │   ├── utils/                # Utility functions (validation, export)
│   │   ├── App.js               # Main app component
│   │   └── routes.js            # Route definitions
│   └── package.json
│
├── TaskforceAPI/                 # Backend Node.js API
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── dao/                 # Data Access Objects
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # TypeScript interfaces
│   │   ├── queries/             # SQL queries
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic & schedulers
│   │   ├── utils/               # Utility functions
│   │   ├── validators/          # Input validation rules
│   │   └── app.ts               # Express app setup
│   ├── tests/                   # Jest test suites
│   ├── scripts/                 # Database scripts
│   └── package.json
│
└── README.md
```

## Security Features

- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Password Hashing**: Bcrypt with salt rounds for password storage
- **Role-Based Access Control**: Three user roles with different permissions
- **SQL Injection Prevention**: Parameterized queries throughout
- **Rate Limiting**: Protection against brute force and DDoS attacks
- **Input Validation**: Express-validator on all API endpoints
- **Security Headers**: Helmet middleware for HTTP header security
- **Audit Logging**: All CRUD operations logged with user tracking
- **CORS Protection**: Configured origin whitelist
- **Remember Me Option**: Optional persistent login with explicit consent

## Features in Detail

### Dashboard
- Real-time task statistics by status
- Personnel distribution by shift
- Recent activity logs
- Quick access to all modules

### Task Management
- Create/Edit/Delete tasks
- Aircraft association
- Shift assignment (1st, 2nd, 3rd)
- Status tracking (Pending, In Progress, Completed)
- Multi-personnel assignments

### Personnel Management
- Track employee information
- Specialty and role assignment
- Shift management
- Training history integration

### Training System
- Training phase tracking (I, II, III, IV, V)
- Progress percentage monitoring
- Completion date tracking
- Personnel-specific training records

### Archive System
- Manual archiving by shift
- Automated scheduled archiving
- Archive log history
- Date range filtering
- Restore capabilities

## Deployment

### Production Build

**Frontend:**
```bash
cd react_taskforce
npm run build
# Creates optimized build in /build directory
```

**Backend:**
```bash
cd TaskforceAPI
# Set NODE_ENV=production in .env
npm start
```

### Recommended Hosting Options

**Frontend:**
- Cloudflare Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

**Backend:**
- Railway
- Heroku
- DigitalOcean App Platform
- AWS EC2 / Elastic Beanstalk
- Render

**Database:**
- AWS RDS (MySQL)
- DigitalOcean Managed Database
- PlanetScale
- MySQL on VPS

## API Documentation

**Base URL:** `http://localhost:5000`

**Authentication Endpoints:**
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user

**Entity Endpoints:**
- `/aircraft` - Aircraft CRUD operations
- `/tasks` - Task management
- `/personnel` - Personnel management
- `/assignments` - Task assignments
- `/training` - Training records
- `/users` - User management (admin only)
- `/archives` - Archive management
- `/archive-schedule` - Automated scheduling
- `/audit-logs` - Activity logs (manager/supervisor)
- `/dashboard` - Dashboard statistics

All endpoints (except auth) require JWT Bearer token in Authorization header.

## User Roles & Permissions

| Feature | Task Viewer | Supervisor | Manager |
|---------|------------|------------|---------|
| View Dashboard | Yes | Yes | Yes |
| View Entities | Yes | Yes | Yes |
| Create/Edit Entities | No | Yes | Yes |
| Delete Entities | No | Yes | Yes |
| Manage Users | No | No | Yes |
| Manage Archives | No | Yes | Yes |
| View Audit Logs | No | Yes | Yes |

## Known Issues

None at this time. Please report issues on the GitHub repository.

## License

ISC License

## Author

Christian Contreras - CST-452 Senior Project

## Acknowledgments

- Bootstrap for UI components
- React community for excellent documentation
- Express.js for robust backend framework
- MySQL for reliable data storage
