# 🚀 Quick Testing Reference

## Run Tests
```powershell
npm test                    # Run all tests
npm run test:watch         # Auto-rerun on changes
npm run test:coverage      # With coverage report
npm run test:report        # Run & open HTML report
```

## Before First Run
1. Update credentials in `tests/helpers/auth.helper.ts`
2. Ensure MySQL database is running
3. Run `npm install` if dependencies missing

## Test Files
- `tests/auth.test.ts` - Authentication (login, profile)
- `tests/aircraft.test.ts` - Aircraft CRUD + authorization
- `tests/tasks.test.ts` - Tasks CRUD + validation
- `tests/personnel.test.ts` - Personnel CRUD + shifts
- `tests/archive.test.ts` - Archive system (manual/scheduled)

## What You'll See
✅ **Passing Test**: Green checkmark, feature works correctly
❌ **Failing Test**: Red X, feature has issues (see error details)

## Common Fixes
- **401 Unauthorized**: Update credentials in `auth.helper.ts`
- **Cannot connect**: Check MySQL is running
- **404 Not Found**: Verify routes in `app.ts`
- **Validation Error**: Check test data matches requirements

## View Results
- **Console**: Instant feedback, pass/fail counts
- **HTML Report**: `test-report/index.html` (opens automatically with `npm run test:report`)
- **Coverage**: `coverage/index.html` (shows code coverage %)

## Coverage Threshold: 40%
All files must have at least 40% of:
- Statements executed
- Branches tested
- Functions called
- Lines covered

---
See `TESTING_GUIDE.md` for full documentation
