<div align="center">

# 📮 ALL-INDIA-PINCODE Explorer

**A Premium MERN Stack Application to Search, Analyze, and Export India Post Data.**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

[Explore Features](#-features) • [Installation](#-local-setup) • [API Reference](#-api-endpoints) • [Deployment](#-deployment-notes)

</div>

---

## 📖 Overview

**India PIN Code Explorer** is a high-performance full-stack application designed to make India's vast postal network accessible. Whether you want to perform a lightning-fast search for a specific PIN code, explore state-wise distributions via an interactive dashboard, or export filtered datasets to CSV, this tool provides a flawless, mobile-first experience.

---

## ✨ Features

- 📊 **Interactive Dashboard:** High-level postal network stats with state and delivery distribution charts (Powered by Recharts).
- 🔍 **Lightning-Fast Search:** Debounced global search for immediate results.
- 🗺️ **Advanced Explorer:** Cascading filters (State ➔ District ➔ Taluk) to drill down into specific regions.
- 📍 **Single PIN Lookup:** Dedicated detail pages for specific PIN codes with copy/share functionalities.
- 📥 **CSV Export:** Instantly download your filtered search results into a CSV file.
- 🌓 **Dynamic Theming:** Premium glassmorphism UI with persistent Dark and Light mode support.
- 🚀 **Seed Utilities:** Built-in import scripts to easily populate MongoDB with large PIN code datasets.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS v4, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Data Viz** | Recharts |
| **Utilities** | Axios, csv-parse, React Icons |

---

## 🚀 Local Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/vedantxy/all-india-pincode.git
cd all-india-pincode
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `backend/.env` file from the example:
```env
MONGO_URI=mongodb://127.0.0.1:27017/pincode_db
PORT=5000
CLIENT_ORIGIN=http://localhost:5173,https://all-india-pincodes.vercel.app
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `frontend/.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
# Or simply use:
# VITE_API_URL=http://localhost:5000
```

### 4. Import Dataset (Optional but recommended)
From the `backend/` folder, populate your database:
```bash
npm run import:data -- ../data/pincodes.csv --replace
# OR for JSON:
# npm run import:data -- ../data/pincodes.json --replace
```

### 5. Run the Application
Since the frontend and backend are deployed independently, you must run them in separate terminal windows:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

*Open `http://localhost:5173` in your browser to view the app!*

---

## 🌐 API Endpoints

The backend provides a robust RESTful API:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/states` | List of all states |
| `GET` | `/api/states/:state/districts` | List of districts in a state |
| `GET` | `/api/pincodes` | Paginated and filtered PIN codes |
| `GET` | `/api/pincode/:pincode` | Get details for a specific PIN code |
| `GET` | `/api/search?q=...` | Global full-text search |
| `GET` | `/api/stats` | High-level statistics |
| `GET` | `/api/export?state=&district=` | Export filtered data to CSV |

---

## 📂 Folder Structure

```text
ALL-INDIA-PINCODE/
├── backend/
│   ├── config/         # Database configurations
│   ├── controllers/    # Route logic and aggregations
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express API endpoints
│   ├── middlewares/    # Error handling & 404
│   └── scripts/        # Data seeding utilities
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI (Navbar, Cards, Charts)
    │   ├── pages/      # Main views (Dashboard, Explore, etc.)
    │   ├── hooks/      # Custom React hooks (useFetch, useDebounce)
    │   └── utils/      # Formatting helpers
    ├── index.css       # Tailwind entry point
    └── vite.config.js  # Vite configurations
```

---

## ☁️ Deployment Notes (Vercel)

If you are deploying the frontend to Vercel, ensure you update your environment variables:

1. **Vercel Frontend Settings:** Set `VITE_API_BASE_URL` to your deployed backend URL (e.g., `https://your-backend-domain/api`).
2. **Backend Environment:** Ensure `CLIENT_ORIGIN` includes your Vercel domain to avoid CORS issues.

> **Warning:** Do not leave `VITE_API_BASE_URL` pointing to `localhost` in production. Your live site will fail to fetch data!

---

## 🔒 Security & Pre-Push Checklist

Before pushing your code to a public repository, please ensure:
- [x] No `.env` files are tracked (Check `.gitignore`).
- [x] MongoDB credentials are NOT hardcoded in `server.js` or `db.js`.
- [x] Sensitive datasets (if private) are not committed.
- [x] You have run a production build test (`npm run build` in frontend).
- [x] API endpoints are thoroughly tested (`node --check server.js`).

---
<div align="center">
  <i>Built with ❤️ by <a href="https://github.com/vedantxy">Vedant Patel</a></i>
  <br />
  <br />
  <a href="https://github.com/vedantxy"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
  <a href="https://linkedin.com/in/vedantxy"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://twitter.com/vedantxy"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" /></a>
</div>
