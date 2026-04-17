# Orthodox Members Registry – Hawassa University

A professional MERN stack (MongoDB, Express, React, Node.js) application designed for managing student fellowship members at Hawassa University with a focus on privacy, pastoral care, and community engagement.

## 🎨 Design & Theme
- **Imperial Aesthetic**: Inspired by Ethiopian Orthodox motifs using a palette of **Divine Gold (#FFD700)** and **Imperial Burgundy (#800000)**.
- **Premium UI**: Glassmorphism effects, smooth Framer Motion animations, and a mobile-responsive dashboard.

## 🚀 Key Features

### 📋 Member Management
- **Detailed Profiles**: Capture full names, baptismal names, university IDs, departments, and phone numbers.
- **Role Assignment**: Designate members as **Leaders**, **Prayer Coordinators**, or **Committee Members**.
- **Succession Tracker**: Automatic tracking of active students vs. graduates to ensure fellowship continuity.

### 🙏 Prayer Wall
- **Community Requests**: A private space for members to share burdens (Health, Academic, Spiritual, etc.).
- **Anonymity Support**: Option to post requests anonymously.
- **Words of Support**: Members can offer support (Amen 🙏) with live counts on each request.

### 📅 Event & Attendance Tracker
- **Gathering Management**: Track attendance for **Holy Liturgy**, **Bible Study**, **Fellowship**, and **Charity events**.
- **Attendance Portal**: Quick-tap interface for leaders to mark attendance during or after events.
- **Engagement Analytics**: View attendance trends directly on the tracker.

### 📊 Dashboard & Reporting
- **Fellowship Overview**: Real-time stats on total active members, freshers, and graduates.
- **Academic Distribution**: Bar charts showing member density across different university departments.
- **Excel Export**: Generate professional reports for church or university chaplaincy in one click.

## 🛠️ Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Lucide Icons, Recharts, Framer Motion, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Security**: JWT Authentication, Bcrypt password hashing.
- **Utilities**: SheetJS (XLSX) for data exports.

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas account)

### 2. Quick Start
1. Clone the repository.
2. Run `npm install` in the root (installs `concurrently`).
3. Run `npm run install-all` (installs backend and frontend dependencies).
4. Create a `.env` file in the `backend/` folder based on `.env.example`.
5. Run `npm run dev` from the root to start both apps.

### 3. Default Credentials
Access the administrative registry using:
- **Username**: `admin`
- **Password**: `admin123` (Configurable in `backend/.env`)

## 🔐 Privacy & Ethics
- **Pastoral Use Only**: This application is strictly for community support and spiritual guidance.
- **Data Protection**: Admin credentials are required for all CRUD and data export operations.
- **Disclaimer**: "This data is for pastoral care only. Not shared with university administration or external parties."

---
*Developed by Antigravity for the Hawassa University Orthodox Tewahedo Fellowship.*
