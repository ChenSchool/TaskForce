# Version Control Summary — TaskForce

Project: TaskForce
Module: API + React UI

## Versioning Scheme
We use a 4-part semantic versioning scheme: Major.Minor.Patch.Build
- Major: Breaking changes / major feature sets
- Minor: New features / iterative improvements
- Patch: Bug fixes
- Build: Internal build/iteration number

---

## Releases

### v1.0.0.0 — Initial integration (Initial application)
- Release date: 2025-09-XX (initial integration date)
- Author: Christian Contreras
- Summary: First integrated release combining the React frontend and the TaskForce TypeScript API back end. Core routes and UI lists implemented for Aircraft, Tasks, Personnel, and Assignments.
- Known issues:
  - Database was inaccessible from the API instance (incorrect connector or environment configuration). This prevented data retrieval from the UI.
- Impact: UI lists could not load data in initial integration due to DB connectivity issue.
- Related test cases: Basic connectivity tests failed for GET endpoints due to DB access (see Test Cases 001-005 in test-results-taskforce.csv).

### v1.0.0.1 — API connection fixes (DB connectivity resolved)
- Release date: 2025-09-28
- Author: Christian Contreras
- Summary: Patch release fixing the API's database connection and aligning front-end API endpoints. Standardized HTTP client usage (Axios) on the React side and corrected endpoint paths to match the API routes. Fixed UI assignment component to match API response structure.
- Changes:
  - Fixed MySQL connector initialization and environment variable loading (ensure .env PORT and DB settings used).
  - API port configured to `5000` in `.env` and `src/app.ts` reads `process.env.PORT`.
  - React `dataSource.js` baseURL set to `http://localhost:5000`.
  - Replaced fetch() calls in `src/api/*` with Axios and updated BASE paths to `/aircraft`, `/tasks`, `/personnel`, `/assignments`.
  - Updated `ListAssignment.jsx` to render the flat assignment view returned by the API.
- Impact: API returned proper JSON responses; React UI lists successfully display data. Eliminated `Cannot read properties of undefined (reading 'map')` error in assignments list.
- Related test cases: All GET tests and UI list tests pass after fixes (see test-results-taskforce.csv). Create/Delete manual tests remain available for validation.

---

## Deployment / Release notes
- To roll back: re-deploy commit tagged `v1.0.0.0` and restore previous DB connector settings.
- Recommended next steps: add automated integration tests (Postman/Newman or Jest supertest) to run basic GET/POST/DELETE smoke tests on CI before merging.

## Tags / Branching
- Branching model: Use `main` for releases and `feature/*` or `hotfix/*` for changes. Tag releases as `v1.0.0.0`, `v1.0.0.1`.

---

## Contact
- Christian Contreras
