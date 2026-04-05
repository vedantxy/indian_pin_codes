# 📮 Pincode Explorer - National Postal Archive

[![Live Demo](https://img.shields.io/badge/Demo-Live-green?style=for-the-badge&logo=render)](https://indian_pincodes.onrender.com)
[![MIT License](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.2.0-blue.svg)](https://github.com/vedantxy/indian_pincodes)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](#tech-stack)

A premium, high-performance administrative dashboard designed for navigating and managing India's massive postal network. Built with a focus on visual excellence and data portability.

---

## 🌟 Project Overview

**Pincode Explorer** (Post-It Admin) is a comprehensive solution for exploring India's 19,000+ pincodes. It provides administrators with real-time analytics, hierarchical regional browsing, and advanced data export capabilities.

### Key Features:
- 📊 **Real-time Analytics**: Live counters for pincodes, states, and delivery hubs.
- 🗺️ **Hierarchical Navigator**: Drill down from State to District to Taluk with a smooth, interactive UI.
- 🔍 **Neural Search**: Global, debounced search for pincodes and areas with instant suggestions.
- 📤 **Data Portability**: Integrated CSV export for regional or master datasets.
- 📈 **Visual Intelligence**: Charting systems for regional distribution and service reach ratio.
- 💎 **Premium UI**: Glassmorphic "Creative Gradient" design system with smooth Framer Motion animations.

### Target Users:
- Logistics Administrators
- Regional Network Managers
- Data Analysts
- Postal Service Developers

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vite + React 18
- **Styling**: Vanilla CSS (Custom Creative Gradient System)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Notifications**: React Toastify

### Backend
- **Server**: Node.js + Express
- **Database**: MongoDB (Flexible Schema for postal records)
- **API**: RESTful architecture with regex-based "trim-resilient" search

---

## 📂 Project Structure

```bash
project/
├── backend/                # Server and API logic
│   ├── index.js            # Express API Server (Backend Entry)
│   ├── package.json        # Backend dependencies & scripts
│   └── .env                # Environment secrets (Mongo URI, Port)
├── frontend/               # React Vite Application
│   ├── src/
│   │   ├── App.jsx         # Layout Manager & Main Application State
│   │   ├── index.css       # Core Design System (Colors, Gradients, Utilities)
│   │   └── components/
│   │       ├── Dashboard.jsx      # Metrics overview & Recharts visualization
│   │       ├── IndiaMap.jsx       # Interactive SVG Choropleth Map
│   │       ├── PincodeSearch.jsx  # Primary pincode scanning tool
│   │       ├── StateDirectory.jsx # Hierarchical regional archives
│   │       └── Sidebar.jsx        # Navigation & Identity Management
│   └── vite.config.js      # Vite configuration & Proxy setup
├── package.json            # Root workspace scripts (concurrently)
├── README.md               # Full Documentation
└── .gitignore              # Repository exclusion rules
```

---

## 🚀 Installation & Setup

### Prerequisites:
- Node.js (v16.x or higher)
- MongoDB (Local or Atlas Atlas)

### Step-by-Step Setup:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/vedantxy/indian_pincodes.git
   cd indian_pincodes
   ```

2. **Backend Configuration:**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   ```

3. **Install Dependencies (Root):**
   ```bash
   # Installs dependencies for both frontend and backend
## 🚀 Deployment Guide (Render.com)

To deploy this project as a single "Web Service" on [Render](https://render.com), follow these steps:

1.  **Connect your GitHub Repository** to a new Render **Web Service**.
2.  **Environment Settings**:
    - **Runtime**: `Node`
    - **Build Command**: `npm run build`
    - **Start Command**: `npm start`
3.  **Environment Variables**:
    Add the following in the Render dashboard:
    - `MONGO_URI`: Your MongoDB Atlas connection string.
    - `NODE_ENV`: `production`
4.  **Click Deploy**: Render will automatically install dependencies, build the React frontend, and start the Express server.

---

## 📈 Visual Intelligence & Roadmap

- [x] **Phase 1**: Core API & Search implementation.
- [x] **Phase 2**: Premium "Creative Gradient" UI Overhaul.
- [x] **Phase 3**: Interactive India Choropleth Map integration.
- [x] **Phase 4**: MVC Backend Refactoring for scalability.
- [ ] **Phase 5**: District-level granular map drill-down (In Progress).

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

**Post-It Admin** - Built with ❤️ for India's Postal Network.

---

## 🔗 API Reference

### 1. Pincode Operations

#### **Fetch Details by Pincode**
- **Endpoint**: `GET /api/pincode/:pincode`
- **Description**: Retrieves all administrative offices associated with a 6-digit postal code.
- **Example**: `GET /api/pincode/380001`
- **Response (200 OK)**:
  ```json
  [
    {
      "office": "Ahmedabad G.P.O.",
      "pincode": "380001",
      "district": "Ahmedabad",
      "state": "GUJARAT"
    }
  ]
  ```

#### **Live Search Suggestions**
- **Endpoint**: `GET /api/search?q=:query`
- **Description**: Predictive search for offices, pincodes, or districts.
- **Example**: `GET /api/search?q=adi`
- **Response (200 OK)**:
  ```json
  [
    {
      "office": "Adicunchanagiri B.O",
      "pincode": "571448",
      "district": "Mandya",
      "state": "KARNATAKA"
    }
  ]
  ```

### 2. Regional Directory

#### **List All States**
- **Endpoint**: `GET /api/states`
- **Description**: Returns an alphabetical list of all unique Indian states in the database.
- **Response (200 OK)**:
  ```json
  ["ANDAMAN & NICOBAR ISLANDS", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", ...]
  ```

#### **State District Directory**
- **Endpoint**: `GET /api/states/:state_name`
- **Description**: Returns a hierarchical map of districts and their respective office units.
- **Example**: `GET /api/states/GUJARAT`
- **Response (200 OK)**:
  ```json
  {
    "AHMEDABAD": ["Ahmedabad G.P.O.", "Ambavadi S.O", ...],
    "AMRELI": ["Amreli H.O", "Babra S.O", ...]
  }
  ```

#### **Fetch Districts for State**
- **Endpoint**: `GET /api/states/:state/districts`
- **Description**: Returns a flat list of unique districts under a specific state.
- **Response (200 OK)**:
  ```json
  ["AHMEDABAD", "AMRELI", "ANAND", "BANAS KANTHA", ...]
  ```

### 3. Administrative Analytics

#### **Global Stats Overview**
- **Endpoint**: `GET /api/stats`
- **Description**: High-level metrics for dashboard cards.
- **Response (200 OK)**:
  ```json
  {
    "totalPincodes": 19097,
    "totalStates": 36,
    "totalDistricts": 743,
    "supportNodes": 9572
  }
  ```

#### **Service Reach Ratio**
- **Endpoint**: `GET /api/stats/delivery-distribution`
- **Description**: Data for the delivery status pie chart.
- **Response (200 OK)**:
  ```json
  {
    "delivery": 145251,
    "nonDelivery": 9572
  }
  ```

### 4. Data Export (CSV)

#### **Master CSV Export**
- **Endpoint**: `GET /api/export`
- **Description**: Triggers a browser download for the entire national database in CSV format.
- **Output**: `pincode_data_all.csv`

#### **Regional CSV Export**
- **Endpoint**: `GET /api/export?state=:state_name`
- **Description**: Triggers download for a specific state jurisdiction.
- **Example**: `GET /api/export?state=GUJARAT`
- **Output**: `pincode_data_gujarat.csv`

---

## 📊 Database Schema

The project uses a MongoDB collection named `project` with an adaptive schema to handle variations in raw postal data.

| Field | Type | Description |
| :--- | :--- | :--- |
| `pincode` | String | 6-digit postal code |
| `officeName` | String | Specific branch or post office title |
| `taluk` | String | Administrative taluk or city area |
| `districtName` | String | Major administrative district |
| `stateName` | String | Primary state jurisdiction |
| `deliveryStatus` | String | "Delivery" or "Non-Delivery" |

---

## 💻 Running the Project

### Development
```bash
# Starts Express server & Vite development server
npm run dev
```

### Production Build
```bash
cd frontend
npm run build
```

---

## 🌐 Deployment

### Vercel / Render
1. Connect your GitHub repository.
2. Set Environment Variables: `MONGO_URI` and `PORT`.
3. Set Build Command: `npm install && cd frontend && npm install && npm run build`.
4. Set Output Directory: `frontend/dist`.

---

## 🤝 Contributing

1. **Fork** the project.
2. **Clone** your fork (`git clone https://github.com/vedantxy/indian_pincodes.git`).
3. **Commit** your changes (`git commit -m "feat: add new filter system"`).
4. **Push** to the branch (`git push origin feature-branch`).
5. Open a **Pull Request**.

---

## 📄 License & Author

- **License**: Distributed under the MIT License.
- **Author**: **Vedant Patel** ([vedantxy](https://github.com/vedantxy))
- **Contact**: [vedantpatel.dev@gmail.com]

---
*Created with ❤️ for the Indian Logistics Community.*
