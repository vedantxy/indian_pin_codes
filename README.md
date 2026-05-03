# ALL-INDIA-PINCODE

> Full-stack MERN application for searching, filtering, visualizing, and exporting India Post PIN code data — 1,54,823 records.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Real-time Dashboard** | Live stats, delivery ratio pie chart, India choropleth map, search activity graph |
| **Pincode Search** | Instant lookup by 6-digit pincode with office detail cards |
| **Global Search** | Debounced navbar search across offices, pincodes, districts, and states |
| **Regional Archives** | State → District → Office accordion hierarchy |
| **Location Index** | Paginated table with State / District / Taluk cascade filters |
| **CSV Export** | Filtered or full-dataset download as CSV |
| **Search History** | Local + server-side search activity logging |
| **Analytics** | 7-day search activity, top states by delivery reach, state distribution |

---

## 🏗 Architecture

```
ALL-INDIA-PINCODE/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection (cached)
│   ├── controllers/
│   │   ├── export.controller.js  # CSV export
│   │   ├── pincode.controller.js # Filtered pincode listing
│   │   ├── search.controller.js  # Global search + pincode details
│   │   ├── states.controller.js  # State/district/taluk hierarchy
│   │   └── stats.controller.js   # Dashboard analytics
│   ├── middleware/
│   │   ├── asyncHandler.js       # Async error wrapper
│   │   ├── errorHandler.js       # Global error response
│   │   ├── notFound.js           # 404 handler
│   │   └── validate.js           # Request validation
│   ├── models/
│   │   ├── Pincode.model.js      # Schema + compound indexes
│   │   └── SearchLog.model.js    # Search history log
│   ├── routes/
│   │   ├── export.routes.js
│   │   ├── pincode.routes.js
│   │   ├── search.routes.js
│   │   ├── states.routes.js
│   │   └── stats.routes.js
│   ├── utils/
│   │   └── csvBuilder.js         # RFC-4180 CSV generator
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/        # StatCard, IndiaMap, DeliveryPieChart
│   │   │   ├── explore/          # FilterPanel, DataTable, Pagination
│   │   │   ├── layout/           # Navbar, Sidebar
│   │   │   ├── pincode/          # PincodeDetailCard
│   │   │   └── ui/               # Badge, Spinner, EmptyState, ExportView
│   │   ├── hooks/                # useFetch, useDebounce
│   │   ├── pages/                # Dashboard, Explore, PincodeLookup, StateDirectory
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json                  # Root orchestrator (concurrently)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally or remote URI
- **npm** ≥ 9

### 1. Clone & Install

```bash
git clone https://github.com/vedantxy/indian_pin_codes.git
cd indian_pin_codes
npm run install:all
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MONGO_URI

# Frontend (optional — defaults work for local dev)
cp frontend/.env.example frontend/.env
```

### 3. Run Development

```bash
npm run dev
```

This starts **both** servers concurrently:
- Frontend → `http://localhost:5173`
- Backend  → `http://localhost:5000`

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | General stats (total pincodes, states, delivery/non-delivery counts) |
| `GET` | `/api/stats/state-distribution` | Top 15 states by pincode count |
| `GET` | `/api/stats/delivery-distribution` | Delivery vs non-delivery counts |
| `GET` | `/api/stats/state-reach` | All states with delivery reach percentage |
| `GET` | `/api/stats/search-activity` | 7-day search activity chart data |
| `GET` | `/api/search?q=term` | Global search (office, pincode, district, state) |
| `GET` | `/api/search/:pincode` | All offices for a specific pincode |
| `GET` | `/api/pincodes?state=&district=&taluk=&page=&limit=` | Filtered, paginated pincode list |
| `GET` | `/api/states` | All distinct state names |
| `GET` | `/api/states/:state` | State directory (districts → offices) |
| `GET` | `/api/states/:state/districts` | Districts in a state |
| `GET` | `/api/states/:state/districts/:district/taluks` | Taluks in a district |
| `GET` | `/api/export?state=&district=&taluk=` | CSV download with optional filters |

---

## ⚡ Performance

| Optimization | Detail |
|-------------|--------|
| **Compound Index** | `stateName + districtName` for hierarchy queries |
| **Text Index** | `officeName + districtName` for search |
| **Parallel Queries** | `Promise.all` for count + find in paginated routes |
| **Pagination Clamping** | Max 100 records per page server-side |
| **Debounced Search** | 300ms client-side debounce on global search |
| **Lean Queries** | `.lean()` on all read operations |
| **Cached DB Connection** | Single connection reuse across requests |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Framer Motion, Recharts, React Simple Maps |
| **Backend** | Node.js, Express 4, Mongoose 7 |
| **Database** | MongoDB (collection: `project`) |
| **Styling** | Vanilla CSS (glassmorphism design system) |
| **Icons** | Lucide React |

---

## 🌐 Deployment

### Frontend → Vercel

1. Connect GitHub repo to Vercel
2. Set **Root Directory** → `frontend`
3. Set **Build Command** → `npm run build`
4. Set **Output Directory** → `dist`

### Backend → Render / Railway

1. Set **Root Directory** → `backend`
2. Set **Build Command** → `npm install`
3. Set **Start Command** → `npm start`
4. Add environment variables: `MONGO_URI`, `PORT`, `NODE_ENV=production`, `CLIENT_ORIGIN`

---

## 📝 Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend + backend concurrently |
| `npm run frontend:dev` | Start Vite dev server only |
| `npm run backend:dev` | Start Express with nodemon only |
| `npm run build` | Build frontend for production |
| `npm start` | Start backend in production mode |
| `npm run install:all` | Install dependencies for root + frontend + backend |

---

## 📄 License

MIT © [Vedant Patel](https://github.com/vedantxy)
