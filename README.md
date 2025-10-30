
# Legal-Ease ⚖️

Legal-Ease is a production-ready legal case management system designed to help courts, law firms, and litigants manage case lifecycles, schedule and conduct virtual hearings, and monitor court performance through built-in analytics.

The project is split into a TypeScript React frontend (Vite) and a Node.js + Express backend. It includes role-based access control (judge, lawyer, litigant, admin), meeting scheduling and notification, Agora-based video conferencing integration, and analytics dashboards.

## Problem statement — what we're solving and how we help 🧩

Many judicial systems and legal practices face long delays, high administrative overhead, and limited visibility into case progress. This results in slower resolutions, frustrated litigants, overloaded court staff, and inconsistent resource allocation.

How Legal-Ease helps:

- Streamline case workflows: centralize case records, status updates, and document metadata so clerks and attorneys spend less time on manual tracking.
- Reduce scheduling friction: provide an integrated meeting scheduler with role-aware invites and email reminders to reduce no-shows and late starts.
- Enable virtual hearings: use Agora RTC for secure, low-latency video hearings so geographically dispersed participants can join reliably.
- Improve decision-making: surface analytics (case trends, court disposal rates, backlog by court) so administrators can prioritize resources and monitor improvements.
- Reduce communication overhead: automated emails, meeting links, and role-based access reduce ad-hoc phone/email coordination.

This README and the project code focus on delivering these improvements while keeping configuration, deployment, and developer workflows straightforward.

---

## Table of Contents 📚

- [What this project does](#what-this-project-does)
- [Repository layout](#repository-layout)
- [Quick start (development)](#quick-start-development)
- [Environment variables](#environment-variables)
- [Features (summary)](#features-summary)
- [Troubleshooting](#troubleshooting)
- [Testing & linting](#testing--linting)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

---

## What this project does 🔎

- Manage case records and statuses (file, update, track progress).
- Schedule virtual court meetings and generate secure meeting tokens.
- Send meeting invitations and reminders by email (nodemailer).
- Provide realtime/virtual hearings using Agora RTC.
- Display analytics (case counts, trends, court performance) via charts.
- Provide role-based UI and API endpoints for judges, lawyers, litigants, and admins.

## Repository layout 🗂️

- [Backend/](Backend) — Express server, routes, models, services (email, agora token), and configuration.
- [Frontend/](Frontend) — React + TypeScript application (Vite) with components, pages, and services.

Visit the folders above to explore source code and package scripts.

## Quick start (development) ⚙️

Open two PowerShell terminals: one for the backend and one for the frontend.

Backend

```powershell
cd Backend
npm install
# create a .env file (see Environment variables below)
npm run dev
```

Frontend

```powershell
cd Frontend
npm install
npm run dev
```

Notes
- If `npm run dev` is not available, check `package.json` in each folder for the correct start script.
- Ensure `VITE_API_URL` points to the backend (e.g. `http://localhost:5000/api`).

## Environment variables 🔐

Create `.env` files in `Backend/` and `Frontend/` (or set env vars in your deployment environment). Do not commit secrets.

### Backend (example)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/legal-ease
JWT_SECRET=replace_with_secure_value

# Email (nodemailer)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=you@example.com
EMAIL_PASS=supersecret
EMAIL_FROM=you@example.com
EMAIL_FROM_NAME="Legal-Ease"

# Used in emails for join links
FRONTEND_URL=http://localhost:5173

# Agora
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERT=your_agora_app_certificate
```

### Frontend (example - Vite prefixes)

```env
VITE_API_URL=http://localhost:5000/api
VITE_AGORA_APP_ID=your_agora_app_id
VITE_FRONTEND_URL=http://localhost:5173
```

## Features (summary) ✨

- Authentication & Authorization (JWT)
- Case filing and document metadata
- Meeting scheduler, token generation, and participant notifications
- Agora RTC integration for video hearings
- Analytics dashboard using Chart.js and react-chartjs-2
- Error boundaries and client-side caching with React Query

## Troubleshooting 🛠️

- Module not found errors: verify import paths in `Backend/server.js` and ensure referenced route files exist (for example `efiledCases.js`).
- Email failures: verify SMTP credentials and network access to the SMTP host/port.
- Agora video issues: ensure `AGORA_APP_ID` and `AGORA_APP_CERT` are valid and that tokens are generated server-side.

If you hit a blocker, open an issue: https://github.com/sujal-pawar/Legal-Ease/issues/new

## Testing & linting ✅

If tests or linters are configured, run them from each package's folder (examples):

```powershell
cd Backend
npm test

cd ..\Frontend
npm test
```

## Contributing 🤝

Contributions are welcome. Typical workflow:

1. Fork and create a feature branch.
2. Run the app locally and add tests for new behavior.
3. Open a pull request with a clear description of changes.

See open issues and PRs: https://github.com/sujal-pawar/Legal-Ease

## License & Contact 📬

Add a license file to this repository (for example, MIT) to clarify reuse terms.

If you need help, open an issue on the repository: https://github.com/sujal-pawar/Legal-Ease/issues

---

Would you like me to add `Backend/.env.example` and `Frontend/.env.example` files, or run a local smoke test (start backend + frontend) and report any runtime errors? Tell me which you'd prefer next.
