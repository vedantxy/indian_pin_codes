# 📮 Pincode Explorer - India's Postal Network Dashboard

A high-performance, full-stack web application designed to explore and analyze India's extensive postal network. Search by pincode, browse by state, and visualize the density of post offices across the country.

![Project Preview](https://via.placeholder.com/1200x600?text=Pincode+Explorer+Dashboard)

## 🚀 Features

- **Dashboard Insights**: Real-time stats on total records, connection status, and pincode density.
- **Pincode Search**: Instantly retrieve office names, districts, and states for any Indian pincode.
- **State Directory**: Browse the entire network grouped by district for any state.
- **Recent Activity**: Persistent tracking of your recent lookups for quick access.
- **Resilient Search**: Backend optimized with regex to handle data with trailing spaces and varied formats.
- **Responsive Design**: Premium, glassmorphic dark theme built for both desktop and mobile.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Lucide React, Vanilla CSS.
- **Backend**: Express.js, Node.js.
- **Database**: MongoDB (Atlas) with Mongoose.
- **Documentation**: Markdown.

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/vedantxy/indian_pin_codes.git
    cd indian_pin_codes
    ```

2.  **Install Backend Dependencies**:
    ```bash
    npm install
    ```

3.  **Install Frontend Dependencies**:
    ```bash
    cd frontend
    npm install
    cd ..
    ```

4.  **Configuration**:
    Create a `.env` file in the root directory and add your MongoDB connection string:
    ```env
    MONGO_URI=mongodb+srv://your_connection_string
    PORT=3000
    ```

5.  **Run the application**:
    - **Start Backend**: `node index.js` (Root)
    - **Start Frontend**: `npm run dev` (inside `frontend/`)

## 🌐 API Endpoints

- `GET /api/:pincode`: Get details of post offices associated with a specific pincode.
- `GET /states`: List all available states.
- `GET /states/:state_name`: List all cities/districts and offices for a specific state.

## 📄 License

This project is licensed under the ISC License.

---
Developed by [Vedant](https://github.com/vedantxy)
