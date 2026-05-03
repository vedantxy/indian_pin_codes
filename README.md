# 📮 Indian Pin Codes Explorer - Full Stack MERN

A high-performance, professional postal network administrative dashboard built with the MERN stack. This application manages and visualizes over **1.5 Lakh+ Indian pincode records** with real-time analytics and advanced search capabilities.

![Project Preview](https://via.placeholder.com/1200x600?text=Indian+Pin+Codes+Explorer+Dashboard)

## 🚀 Features

- **Real-time Analytics Dashboard**: Visualize postal network distribution, service reach, and search activity.
- **High-Performance Search**: Instant retrieval of pincode details from a massive local MongoDB dataset.
- **Regional Archives**: Hierarchical directory of postal units grouped by States and Districts.
- **Location Index**: Advanced filtering system by State, District, and Taluk with paginated results.
- **Data Export**: Export master postal records or specific state data to CSV format.
- **Responsive Neural UI**: Modern, glassmorphism-inspired interface with fluid animations using Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, Recharts, Lucide Icons, React Toastify.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Local Instance) with 1,54,823 records.
- **Styling**: Modern CSS with CSS Variables and Glassmorphism.

## 📁 Project Structure

```text
api_work/
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page-level components
│   │   └── App.jsx     # Main application logic
├── backend/            # Node.js + Express server
│   ├── src/
│   │   ├── config/     # Database configuration
│   │   ├── controllers/# API logic
│   │   ├── models/     # Mongoose schemas
│   │   └── routes/     # API endpoints
│   └── server.js       # Entry point
└── package.json        # Root orchestration
```

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd api_work
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Database Configuration**:
   Ensure your local MongoDB is running at `mongodb://localhost:27017` and contains the `project` collection in the `hackthone` database.

4. **Run the Application**:
   From the root directory, run:
   ```bash
   npm run dev
   ```
   - Frontend will run on: `http://localhost:5173`
   - Backend will run on: `http://localhost:5000`

## 📄 License

Distributed under the MIT License.
