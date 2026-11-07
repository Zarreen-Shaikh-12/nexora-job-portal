# Job Portal & Recruitment Management System

A MERN-stack recruitment platform connecting Job Seekers, Employers and Administrators, with a
transparent skill-based **ATS match score**. Built as a C-DAC academic project.

## Features

- **Job Seekers:** register, manage profile and skills, browse and search jobs, apply, see an
  individual match score per application, track status (Applied / Shortlisted / Rejected).
- **Employers:** company profile, post / edit / close / delete jobs, view applicants **ranked by match
  score**, see matched and missing skills, shortlist or reject.
- **Admins:** platform statistics, user management (deactivate / delete), job moderation, contact
  message inbox.
- **Security:** JWT in HTTP-only cookies, bcrypt password hashing, role-based authorization on every
  protected route, input validation, regex escaping, mass-assignment protection, Helmet headers.

## ATS match score

`Score = (matched skills / total job requirements) x 100`, rounded to a whole number.
Skills are lowercased, trimmed and de-duplicated before comparison. The score is calculated **on the
server** when a candidate applies and stored as a snapshot (`backend/utils/matchScore.js`).
It is a keyword-based estimate from the skills a candidate lists. It does not read resume files and is
not a full professional ATS parser.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router DOM, Context API, Tailwind CSS, Axios |
| Backend | Node.js, Express.js (MVC) |
| Database | MongoDB (Atlas) with Mongoose |
| Auth | JWT (HTTP-only cookie), bcryptjs |
| Tools | Postman, Git, GitHub |

## Prerequisites

- Node.js 20.19+ (`node -v`)
- A MongoDB connection string (MongoDB Atlas free cluster, or local MongoDB)
- If using Atlas: your current IP address must be allowed under **Network Access**

## Setup and run

**1. Backend** (terminal 1)

```bash
cd backend
npm install
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
```

Edit `backend/.env`: set `MONGO_URI` and a random `JWT_SECRET`. Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then load the demo data and start the server:

```bash
npm run seed                  # resets the database to demo data
npm run dev                   # http://localhost:5000
```

**2. Frontend** (terminal 2)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev                   # http://localhost:5173
```

Open **http://localhost:5173** (use `localhost`, not `127.0.0.1`, because CORS compares origins exactly).

## Demo accounts (development only)

Password for every account: `Password@123`

| Role | Email |
|---|---|
| Admin | admin@jobportal.com |
| Employer | priya@techcorp.com, rahul@innovatech.com, sneha@datawise.com |
| Job Seeker | asha@demo.com, kiran@demo.com, neha@demo.com, arjun@demo.com, divya@demo.com, rohan@demo.com |

`npm run seed` deletes all existing data first and refuses to run when `NODE_ENV=production`.

## API summary

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout` |
| Jobs | `GET /api/jobs`, `GET /api/jobs/my-jobs`, `GET /api/jobs/:id`, `POST /api/jobs`, `PUT /api/jobs/:id`, `DELETE /api/jobs/:id` |
| Applications | `POST /api/applications/apply`, `GET /api/applications/my-applications`, `GET /api/applications/job/:jobId`, `PATCH /api/applications/:id/status` |
| Contact | `POST /api/contact`, `GET /api/contact` (Admin), `PATCH /api/contact/:id/status` (Admin) |
| Users / Stats | `PUT /api/users/profile`, `GET /api/stats` |
| Admin | `GET /api/admin/stats`, `GET /api/admin/users`, `PATCH /api/admin/users/:id/status`, `DELETE /api/admin/users/:id` |

## Project structure

```
backend/   config/ controllers/ middleware/ models/ routes/ scripts/ utils/ validators/ server.js
frontend/  src/ components/ context/ hooks/ layouts/ pages/ routes/ services/ utils/
```

## Automated checks

```bash
cd backend
node scripts/testMatchScore.js   # 9 unit tests for the matching engine (no database needed)
node scripts/testRace.js         # 5 simultaneous inserts: exactly one succeeds (unique index)
```

API behaviour was tested manually with Postman, and the UI was tested manually in the browser.
There are no automated frontend tests.

## Known limitations

- Resume is a **link**, not a file upload.
- Matching is exact keyword matching: `nodejs` and `node.js` are different skills. Resume content is not read.
- Match scores are snapshots taken at apply time and are not recalculated if a profile or job changes.
- Salary has a range but no period (per month / per year).
- No password reset, email notifications, or rate limiting.
- Not deployed. Evaluated locally.
- Two backend checks were not run: an Admin trying to delete another Admin, and the expired-token message.

## Future enhancements

Resume file upload and parsing, skill synonyms (`js` = `javascript`), recalculating scores, email
notifications, saved jobs, rate limiting, password reset, automated test suites, and cloud deployment
(Vercel + Render + MongoDB Atlas).
