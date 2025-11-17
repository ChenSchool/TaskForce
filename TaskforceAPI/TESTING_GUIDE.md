# TaskForce API Testing Guide

## 📋 Overview
This guide explains how to run and use the automated testing system for the TaskForce API. The tests verify all CRUD operations, authentication, authorization, and the archive system.

## 🚀 Quick Start

### 1. First Time Setup
```powershell
# Navigate to the API directory
cd "c:\Users\chris\OneDrive - Grand Canyon University\School\CST-452_Senior Project II\TaskForce\TaskforceAPI"

# Install dependencies (if not already done)
npm install
```

### 2. Update Test Credentials
Before running tests, update the credentials in `tests/helpers/auth.helper.ts`:
```typescript
// Line 6-7: Replace with your actual admin credentials
username: 'your_admin_username',
password: 'your_admin_password'

// Line 14-15: Replace with your actual supervisor credentials  
username: 'your_supervisor_username',
password: 'your_supervisor_password'
```

### 3. Ensure Database is Running
Make sure your MySQL database is running and the `taskforce_tracker` database exists with all tables.

## 🧪 Running Tests

### Run All Tests
```powershell
npm test
```

### Run Tests in Watch Mode (auto-rerun on file changes)
```powershell
npm run test:watch
```

### Run Tests with Coverage Report
```powershell
npm run test:coverage
```

### Run Tests and Open HTML Report
```powershell
npm run test:report
```

## 📊 Understanding Test Results

### Console Output
When you run `npm test`, you'll see:
- ✓ Green checkmarks for passing tests
- ✗ Red X marks for failing tests
- Test suite summaries with pass/fail counts
- Execution time for each test

Example:
```
PASS  tests/auth.test.ts
  Authentication Tests
    POST /auth/login
      ✓ should login with valid credentials (45ms)
      ✓ should fail with invalid credentials (32ms)
      ✓ should fail with missing credentials (12ms)
    GET /auth/me
      ✓ should get profile with valid token (18ms)
      ✓ should fail without token (10ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        2.456 s
```

### HTML Report
After running `npm run test:report`, an HTML report opens automatically showing:
- **Dashboard**: Overall pass/fail statistics with charts
- **Test Suites**: Each test file with visual indicators
- **Individual Tests**: Detailed results for each test case
- **Execution Time**: Performance metrics
- **Error Details**: Stack traces for any failures

Report location: `TaskforceAPI/test-report/index.html`

### Coverage Report
The coverage report shows:
- **Statements**: % of code lines executed
- **Branches**: % of if/else paths tested
- **Functions**: % of functions called
- **Lines**: % of source code lines tested

Coverage HTML report location: `TaskforceAPI/coverage/index.html`

## 📁 Test Files Explained

### `tests/auth.test.ts`
Tests authentication endpoints:
- ✅ Login with valid credentials
- ❌ Login with invalid credentials
- ❌ Login with missing credentials
- ✅ Get user profile with token
- ❌ Get user profile without token

### `tests/aircraft.test.ts`
Tests aircraft CRUD operations:
- GET all aircraft (admin & non-admin)
- POST create aircraft (admin only)
- PUT update aircraft (admin only)
- DELETE aircraft (admin only)
- Authorization checks

### `tests/tasks.test.ts`
Tests task CRUD operations:
- GET all tasks
- POST create task with validation
- PUT update task
- DELETE task
- Invalid input handling

### `tests/personnel.test.ts`
Tests personnel CRUD operations:
- GET all personnel
- POST create personnel (with shift/role)
- PUT update personnel
- DELETE personnel
- Validation for required fields

### `tests/archive.test.ts`
Tests archive system:
- GET archive schedules
- POST create schedule (with shift)
- POST manual archive (shift-based)
- GET archive logs
- GET archived assignments
- Authorization checks
- Invalid shift handling

## 🔧 Troubleshooting

### Test Failures

#### "Cannot connect to database"
- Ensure MySQL is running
- Check `.env` file has correct database credentials
- Verify `taskforce_tracker` database exists

#### "401 Unauthorized" in tests
- Update credentials in `tests/helpers/auth.helper.ts`
- Ensure admin and supervisor users exist in database
- Check that passwords match

#### "404 Not Found"
- Ensure API server routes are correctly defined
- Check that route paths match test requests
- Verify route files are imported in `app.ts`

#### "Validation Error"
- Check test data matches model requirements
- Verify shift values are '1st', '2nd', or '3rd'
- Ensure required fields are provided

### Jest Issues

#### "Cannot find module 'supertest'"
```powershell
npm install --save-dev supertest @types/supertest
```

#### "Cannot find name 'describe'"
```powershell
npm install --save-dev @types/jest
```

#### "Module has no default export"
- Already fixed in `app.ts` with `export default app;`

## 📈 Coverage Goals

Current coverage thresholds (in `jest.config.js`):
- Branches: 40%
- Functions: 40%
- Lines: 40%
- Statements: 40%

To increase thresholds, edit `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 60,    // Increase to 60%
    functions: 60,
    lines: 60,
    statements: 60
  }
}
```

## 🎯 What Gets Tested

### ✅ Authentication
- Login (valid/invalid credentials)
- Token generation
- Profile retrieval
- Authorization headers

### ✅ Authorization
- Admin-only routes
- Manager/Supervisor access
- Public vs protected endpoints

### ✅ CRUD Operations
- **Aircraft**: All CRUD operations
- **Tasks**: All CRUD operations
- **Personnel**: All CRUD operations
- **Archive**: Manual & scheduled archiving

### ✅ Validation
- Required fields
- Data types
- Enum values (shifts: 1st, 2nd, 3rd)
- Invalid inputs

### ✅ Error Handling
- 400 Bad Request (invalid data)
- 401 Unauthorized (missing token)
- 403 Forbidden (insufficient permissions)
- 404 Not Found (missing resources)

## 🔄 Adding New Tests

To add tests for a new feature:

1. Create test file: `tests/your-feature.test.ts`
2. Import dependencies:
   ```typescript
   import request from 'supertest';
   import app from '../src/app';
   import { getAuthTokens, authHeader } from './helpers/auth.helper';
   ```
3. Write test suite:
   ```typescript
   describe('Your Feature Tests', () => {
     let adminToken: string;

     beforeAll(async () => {
       const tokens = await getAuthTokens(app);
       adminToken = tokens.adminToken;
     });

     it('should do something', async () => {
       const response = await request(app)
         .get('/your-endpoint')
         .set(authHeader(adminToken));

       expect(response.status).toBe(200);
       expect(response.body).toHaveProperty('data');
     });
   });
   ```

## 📚 Best Practices

1. **Run tests before committing**: Ensure all tests pass
2. **Write tests for new features**: Add tests when adding endpoints
3. **Check coverage**: Aim for >40% coverage minimum
4. **Update credentials**: Keep test credentials in sync with database
5. **Review HTML report**: Visual inspection helps spot patterns
6. **Clean test data**: Tests should clean up created records

## 🎨 Viewing Results Visually

### Method 1: HTML Report (Recommended)
```powershell
npm run test:report
```
- Opens browser with beautiful dashboard
- Color-coded pass/fail indicators
- Interactive navigation
- Execution time charts

### Method 2: Coverage Report
```powershell
npm run test:coverage
# Then open: coverage/index.html
```
- Shows code coverage by file
- Highlights untested lines
- Branch coverage details

### Method 3: Console (Quick Check)
```powershell
npm test
```
- Fast feedback in terminal
- Good for CI/CD pipelines
- Shows pass/fail immediately

## 🚨 Important Notes

1. **Tests run against real database**: Use test database if available
2. **Admin access required**: Some tests need admin authentication
3. **Port conflicts**: Ensure port 3000 isn't already in use
4. **Archive tests create data**: Manual archive tests will archive assignments
5. **Test isolation**: Each test should be independent

## 📞 Need Help?

If tests aren't working:
1. Check console output for specific errors
2. Review `TESTING_GUIDE.md` troubleshooting section
3. Verify database connection in `.env`
4. Ensure all migrations are run
5. Check that test credentials match database users

---

**Happy Testing! 🎉**
