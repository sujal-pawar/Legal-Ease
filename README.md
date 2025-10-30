
# ⚖️ Legal-Ease — Bringing Speed and Clarity to Justice.

**Legal-Ease** is a full-featured, production-ready **Legal Case Management System** designed for **courts, law firms, and litigants**.
It helps manage complete **case lifecycles**, schedule **virtual hearings**, and analyze **judicial performance** — all from one centralized platform.

---

## 🧩 Why Legal-Ease?

Today’s judicial and legal ecosystems often struggle with:

* 🕒 **Long delays** in case resolution
* 📂 **Fragmented data** across multiple sources
* 📞 **Manual coordination** between staff, lawyers, and clients
* 📉 **Lack of performance insights**

**Legal-Ease** solves this by blending **case management**, **scheduling**, and **analytics** with **secure virtual hearings**, ensuring courts run faster, fairer, and smarter.

---

## 💡 How Legal-Ease Transforms Legal Workflows

| Challenge                      | Solution                                                                   |
| ------------------------------ | -------------------------------------------------------------------------- |
| Disorganized case records      | 🗂️ Unified dashboard for filing, updates, and progress tracking           |
| Time-consuming scheduling      | 📅 Built-in scheduler with email reminders & role-aware invitations        |
| Physical hearing limitations   | 🎥 Agora-powered virtual hearings with auto-generated secure tokens        |
| Lack of performance visibility | 📊 Real-time analytics on case trends, backlog, and court efficiency       |
| Repetitive communication       | ✉️ Automated notifications, access-based data visibility, and smart alerts |

---

## 🚀 Tech Stack Overview

**Frontend:** React + TypeScript (Vite)
**Backend:** Node.js + Express
**Database:** MongoDB
**Video Conferencing:** Agora RTC
**Email Services:** Nodemailer
**Charts & Analytics:** Chart.js + React Chart.js 2
**Auth & Access:** JWT-based Role Management (Judge / Lawyer / Litigant / Admin)

---

## 🗂️ Repository Structure

```
Legal-Ease/
│
├── Backend/       # Express app: routes, models, services (email, agora, auth)
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── config/
│
└── Frontend/      # React + Vite app: UI, pages, components, hooks
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── services/
```

Explore both folders to understand the complete development workflow.

---

## ⚙️ Quick Start (for Developers)

### 🧭 Backend Setup

```bash
cd Backend
npm install
cp .env.example .env  # or create manually (see below)
npm run dev
```

### 💻 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🔐 Environment Variables

Create separate `.env` files for **Backend** and **Frontend**.

### Backend Example

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/legal-ease
JWT_SECRET=replace_with_secure_value

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=you@example.com
EMAIL_PASS=supersecret
EMAIL_FROM=you@example.com
EMAIL_FROM_NAME="Legal-Ease"

FRONTEND_URL=http://localhost:5173

# Agora
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERT=your_agora_app_certificate
```

### Frontend Example

```env
VITE_API_URL=http://localhost:5000/api
VITE_AGORA_APP_ID=your_agora_app_id
VITE_FRONTEND_URL=http://localhost:5173
```

---

## ✨ Core Features

✅ **Authentication & Role Management** — JWT-based secure login for judges, lawyers, litigants, and admins
✅ **Case Management** — File, update, and monitor case progress with searchable metadata
✅ **Meeting Scheduler** — Set up hearings with automatic notifications and reminders
✅ **Virtual Hearings** — Secure, low-latency video calls powered by Agora RTC
✅ **Analytics Dashboard** — Visual insights into case volume, backlog, and performance trends
✅ **Error Handling & Offline Cache** — Powered by React Query for smoother UX
✅ **Email Notifications** — Seamless updates for meetings and case changes

---

## 🧠 Behind the Design

Legal-Ease focuses on:

* **Clarity:** Simplified dashboards and role-specific UIs
* **Security:** JWT authentication, role-based access, and encrypted data
* **Scalability:** Modular backend (controllers, services, middleware)
* **Realism:** Production-ready setup, not just a prototype

---

## 🧩 Troubleshooting

Common fixes:

* **Backend not connecting:** Verify `MONGO_URI` and port configuration.
* **Agora not working:** Double-check your `AGORA_APP_ID` and certificate.
* **Email issues:** Use app passwords (e.g., Gmail) or verified SMTP credentials.
* **CORS errors:** Update `CORS_ORIGIN` in your backend config.

---

## 🧪 Testing & Linting

```bash
# Linting
npm run lint

# Unit tests
npm test
```

Ensure both frontend and backend follow consistent TypeScript and ESLint rules.

---

## 🤝 Contributing

We welcome all contributions — bug fixes, feature additions, or documentation updates.

1. **Fork** the repo and create your feature branch
2. **Run locally**, add tests, and ensure it builds cleanly
3. **Open a PR** describing your changes clearly

👉 See open issues: [Legal-Ease Issues](https://github.com/sujal-pawar/Legal-Ease/issues)

---

## 📜 License & Contact

This project is under the **MIT License**.
For questions or collaboration:

📧 [Open an issue](https://github.com/sujal-pawar/Legal-Ease/issues)
🌐 GitHub: [sujal-pawar](https://github.com/sujal-pawar)

---

## 💬 Final Thought

> Legal-Ease is more than just a legal tech platform — it’s a movement toward faster, clearer, and more transparent justice.
> By streamlining case management, enabling virtual hearings, and empowering data-driven insights, we’re bringing speed and clarity to justice — for everyone, everywhere.

