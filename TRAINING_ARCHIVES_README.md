# Training and Archives Implementation

This document describes the Training Records and Archives functionality implemented for the TaskForce application.

## Overview

Two new modules have been added to support requirements **008** (Training records CRUD and progress tracking) and **009** (Archive creation and retrieval endpoints):

1. **Training Records**: Track personnel training phases and progress
2. **Archives**: Manually archive completed tasks, assignments, and training records

## Database Schema (Existing Tables)

### Training Table (Existing)
```sql
CREATE TABLE training (
  id INT AUTO_INCREMENT PRIMARY KEY,
  personnel_id INT,
  phase VARCHAR(50),
  progress INT,
  complete TINYINT(1)
);
```

**Fields:**
- `id` - Auto-increment primary key
- `personnel_id` - Foreign key to personnel table
- `phase` - Training phase name (e.g., "Phase 1", "Initial", "Advanced")
- `progress` - Progress percentage (0-100)
- `complete` - Boolean flag (0 = in progress, 1 = complete)

### Archive Table (Existing)
```sql
CREATE TABLE archive (
  id INT AUTO_INCREMENT PRIMARY KEY,
  snapshot_date DATE,
  snapshot_time TIME,
  shift ENUM('1st', '2nd', '3rd'),
  aircraft_tail VARCHAR(20),
  data_json JSON
);
```

**Fields:**
- `id` - Auto-increment primary key
- `snapshot_date` - Date of the archive snapshot
- `snapshot_time` - Time of the archive snapshot
- `shift` - Shift when archive was created (1st, 2nd, or 3rd)
- `aircraft_tail` - Optional aircraft tail number filter
- `data_json` - JSON blob containing archived tasks, assignments, and training

## Backend Implementation

### Training Module

**Files Created:**
- `models/training.model.ts` - TypeScript interfaces
- `queries/training.queries.ts` - SQL queries
- `dao/training.dao.ts` - Data access layer
- `controllers/training.controller.ts` - Request handlers
- `routes/training.routes.ts` - API routes

**API Endpoints:**
- `GET /training` - Get all training records
- `GET /training/:id` - Get training by ID
- `GET /training/personnel/:personnelId` - Get training for specific personnel
- `GET /training/stats` - Get training statistics
- `POST /training` - Create new training record
- `PUT /training/:id` - Update training record
- `DELETE /training/:id` - Delete training record

### Archives Module

**Files Created:**
- `models/archives.model.ts` - TypeScript interfaces
- `queries/archives.queries.ts` - SQL queries
- `dao/archives.dao.ts` - Data access layer
- `controllers/archives.controller.ts` - Request handlers
- `routes/archives.routes.ts` - API routes

**API Endpoints:**
- `GET /archives` - Get all archives
- `GET /archives/:id` - Get archive by ID (includes archived data)
- `POST /archives` - Create new archive (manual)
- `DELETE /archives/:id` - Delete archive

**Archive Creation Request:**
```json
{
  "archive_type": "all|tasks|assignments|training",
  "archived_by": "Username",
  "notes": "Optional notes",
  "cutoff_date": "2024-01-01"
}
```

## Frontend Implementation

### Training Components

**Files Created:**
- `components/ListTraining.jsx` - View all training records
- `components/CreateEditTraining.jsx` - Create/edit training records
- `api/training.js` - API client functions

**Features:**
- View training records with status badges
- Visual progress bars (0-100%)
- Filter by personnel
- Simple complete/incomplete status
- Phase-based training tracking (Phase 1, Phase 2, Advanced, etc.)

### Archives Components

**Files Created:**
- `components/ListArchives.jsx` - View archives and create new ones
- `components/ViewArchive.jsx` - View archived data details
- `api/archives.js` - API client functions

**Features:**
- Manual archive creation modal
- Shift-based archiving (1st, 2nd, 3rd shift)
- Optional aircraft tail filter
- Cutoff date selection (default: 90 days ago)
- View archived data in formatted tables
- Archive metadata display (date, time, shift, aircraft)

## Setup Instructions

### 1. Database Already Set Up

Your existing database already has the `training` and `archive` tables configured correctly. No migration needed!

### 2. Restart Backend

The backend routes are already registered. Just restart your API server:

```powershell
cd "c:\Users\chris\OneDrive - Grand Canyon University\School\CST-452_Senior Project II\TaskForce\TaskforceAPI"
npm start
```

### 3. Restart Frontend

The routes are added to App.js and Navbar. Restart your React app:

```powershell
cd "c:\Users\chris\OneDrive - Grand Canyon University\School\CST-452_Senior Project II\TaskForce\react_taskforce"
npm start
```

### 4. Access New Features

Navigate to:
- **Training**: http://localhost:3000/training
- **Archives**: http://localhost:3000/archives

## Usage Examples

### Creating a Training Record

1. Click "Training" in the navigation
2. Click "+ New Training"
3. Fill in:
   - Select personnel member
   - Enter training phase (e.g., "Phase 1", "Initial Training")
   - Set progress percentage (0-100)
   - Check "Mark as Complete" when finished
4. Click "Save"

### Creating an Archive

1. Click "Archives" in the navigation
2. Click "+ Create Archive"
3. Configure:
   - Select shift (1st, 2nd, or 3rd)
   - Optionally enter aircraft tail number (leave blank for all)
   - Set cutoff date (completed records before this date)
4. Click "Create Archive"
5. The system will archive all completed tasks, assignments, and training

### Viewing Archived Data

1. Go to Archives list
2. Click "View" on any archive
3. See all archived records organized by type
4. Data is preserved in JSON format

## Important Notes

⚠️ **CRON Job Not Implemented**: The automatic archiving (requirement 014) is **NOT** yet implemented. This is intentional to prevent accidental data archiving during development. All archiving must be done manually through the UI.

✅ **Safe to Test**: You can safely create archives without worrying about data loss - archived data is copied, not moved. Original records remain in their tables.

## Testing Checklist

- [ ] Create training records for different personnel
- [ ] Update training progress and status
- [ ] Delete training records
- [ ] Create archive of all types
- [ ] View archived data
- [ ] Delete an archive
- [ ] Verify navigation links work
- [ ] Test with empty states

## Next Steps

After testing the Training and Archives modules:

1. Implement authentication and RBAC (requirements 006, 007)
2. Add export functionality (requirement 010)
3. Implement CRON job for automatic archiving (requirement 014)
4. Add audit logging (requirement 013)
5. Implement dashboard views (requirement 011)

## Troubleshooting

**Issue**: API returns 500 error
- Check that database tables exist
- Verify foreign key relationships
- Check backend console for detailed errors

**Issue**: Frontend shows empty lists
- Verify backend is running on port 3000 (API)
- Check browser console for API errors
- Ensure CORS is enabled in backend

**Issue**: Cannot create training record
- Ensure personnel records exist
- Check that required fields are filled
- Verify personnel_id is valid
