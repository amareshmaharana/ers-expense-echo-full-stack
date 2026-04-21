# ExpenseEcho Portal 💼

Enterprise-ready Employee Reimbursement System (ERS) built with a modern React frontend and a Node.js + Express + MongoDB backend.

ExpenseEcho streamlines the complete reimbursement lifecycle:
submission -> multi-level approval -> payout -> reporting.

## ✨ Highlights

- 🧑‍💼 Role-based workspaces for `Employee`, `Manager`, `Director`, `Accountant`, and `Admin`
- 🧾 Reimbursement submission with receipt upload (JPG/PNG/WEBP/PDF up to 6MB)
- 🔄 Multi-stage approval flow with audit trail and status timeline
- 🔐 JWT authentication + protected routes + role authorization middleware
- 📊 Dashboard summaries for totals, status buckets, and recent activity
- 👥 Admin user management and system activity feed
- ☁️ Optional Cloudinary integration for receipt storage
- 📧 Optional SMTP notifications for reimbursement events
- 🌱 Automatic demo data seeding on first backend startup

## 🧱 Tech Stack

### Frontend (`client`)

- React 19
- Vite 8
- React Router DOM 7
- Axios
- Tailwind CSS
- Lucide React icons

### Backend (`server`)

- Node.js + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Input validation (`express-validator`)
- File uploads (`multer`)
- Cloudinary SDK
- Nodemailer

## 🏗️ Project Structure

```text
ERS-APP/
├─ client/                  # React app (UI, routing, auth context)
│  ├─ src/
│  │  ├─ pages/             # Public/auth/dashboard pages
│  │  ├─ components/        # Shared UI + dashboard widgets
│  │  ├─ context/           # Auth state management
│  │  └─ api/               # Axios HTTP client
├─ server/                  # Express API
│  ├─ src/
│  │  ├─ routes/            # API route modules
│  │  ├─ controllers/       # Route handlers/business logic
│  │  ├─ models/            # Mongoose models
│  │  ├─ middleware/        # Auth + error handling
│  │  ├─ services/          # Upload, mailer, cloudinary
│  │  └─ utils/             # Shared helpers + demo seed
└─ README.md
```

## 🔄 Workflow (Business Process)

1. 👤 Employee submits reimbursement with receipt.
2. ✅ Manager reviews submitted request.
3. 🧑‍⚖️ Director performs final authorization.
4. 💳 Accountant marks approved request as paid.
5. 🛡️ Admin oversees users and operational visibility.

Primary statuses:

- `Submitted`
- `ManagerApproved`
- `DirectorApproved`
- `Paid`
- `Rejected`

## 🔐 Authentication & Authorization

- JWT tokens are generated on login/register.
- Token is accepted from:
  - `Authorization: Bearer <token>` header
  - signed cookie (`token`)
- Frontend stores auth token/user in local storage.
- Protected routes enforce login + role-to-route consistency.
- Backend authorization middleware restricts route access by role.

## 🧪 Demo Accounts (Auto-Seeded)

On first backend run (when no users exist), demo users are created automatically.

- Admin: `admin@ers.local`
- Employee: `employee@ers.local`
- Manager: `manager@ers.local`
- Director: `director@ers.local`
- Accountant: `accountant@ers.local`
- Password (all): `Password123!`

## ⚙️ Environment Variables

Create a `.env` file inside `server/`:

```env
# Core
PORT=5000
NODE_ENV=development
MONGO_URI=
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional: role-gated registration (Admin/Accountant)
ERS_ACCESS_KEY=your_optional_access_key

# Optional: email notifications
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
MANAGER_NOTIFY_EMAIL=
DIRECTOR_NOTIFY_EMAIL=
ACCOUNTANT_NOTIFY_EMAIL=

# Optional: Cloudinary receipt storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=ers-receipts
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Local Development Setup

### 1) Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- MongoDB instance (local or cloud)

### 2) Install dependencies

```bash
# frontend
cd client
npm install

# backend
cd ../server
npm install
```

### 3) Configure environment

- Add `server/.env` and `client/.env` using the templates above.

### 4) Run backend

```bash
cd server
npm run dev
```

Expected startup behavior:

- API starts at `http://localhost:5000`
- Health route available at `GET /health`
- Demo seed runs only if database has no users

### 5) Run frontend

```bash
cd client
npm run dev
```

Frontend app runs at `http://localhost:5173`.

## 📡 API Overview

Base URL: `http://localhost:5000/api`

### Auth

- `POST /auth/login` - authenticate user
- `POST /auth/register` - self-register user
- `GET /auth/me` - current authenticated user
- `POST /auth/users` - create user (Admin only)

### Reimbursements

- `GET /reimbursements` - list reimbursements (role-filtered)
- `GET /reimbursements/:id` - get reimbursement details
- `POST /reimbursements` - submit reimbursement (`Employee`, `Admin`)
- `PATCH /reimbursements/:id/review` - review action (`Manager`, `Director`, `Accountant`)

### Dashboard

- `GET /dashboard/overview` - grouped summary + recent items
- `GET /dashboard/summary` - totals, by-status, latest list

### Admin Users

- `GET /admin/users` - list users (Admin)
- `GET /admin/users/activity` - system activity feed (Admin)
- `GET /admin/users/role/:role` - filter users by role (Admin)
- `PATCH /admin/users/:id/status` - activate/deactivate user (Admin)

## 🧠 Data Models (Core)

- `User`
  - Identity/profile fields
  - `role`, `department`, `active`, `lastLoginAt`
  - secure password hash storage
- `Reimbursement`
  - employee snapshot, amount/currency/category, receipt metadata
  - status, approval trail, payment reference, timestamps
- `ApprovalHistory`
  - immutable action log per reimbursement (actor, role, action, note)

## 🛡️ Validation, Errors, and Safety

- Request validation via `express-validator`
- Centralized `ApiError` + `errorHandler` middleware
- Strict schema validation with Mongoose
- Upload type restrictions and file size limits through `multer`

## 📬 Integrations

- Cloudinary is optional:
  - if configured, receipts upload to cloud storage
  - if not configured, app uses safe placeholder URLs for local/dev continuity
- SMTP mail is optional:
  - if configured, users/stakeholders receive reimbursement notifications
  - if not configured, notifications are skipped gracefully

## 🧰 Available Scripts

### Client (`client/package.json`)

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview build
- `npm run lint` - run ESLint

### Server (`server/package.json`)

- `npm run dev` - run API with nodemon
- `npm start` - run API with node
- `npm test` - placeholder test command (no automated tests configured yet)

## 🗺️ Roadmap Ideas

- ✅ Add automated test suite (unit + integration + API)
- ✅ Add Docker and Compose setup
- ✅ Add OpenAPI/Swagger docs
- ✅ Add pagination/filtering/sorting in reimbursement listing
- ✅ Add RBAC policy matrix documentation
- ✅ Add CI pipeline (lint, build, tests)

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit clear, scoped changes.
4. Open a pull request with implementation notes and screenshots (if UI changes).

<!-- ## 📄 License

No license is currently defined in this repository. -->

---

Built for modern reimbursement operations with clarity, control, and speed. 🚀
