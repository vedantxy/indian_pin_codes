require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

// Import Routes
const statsRoutes = require('./src/routes/stats.routes');
const pincodeRoutes = require('./src/routes/pincode.routes');
const exportRoutes = require('./src/routes/export.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/stats', statsRoutes);
app.use('/api/pincodes', pincodeRoutes);
app.use('/api/export', exportRoutes);
app.use('/api', pincodeRoutes); // Legacy route support for Dashboard/App components

// --- Production Setup ---
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });
}

// Start Server locally
if (process.env.NODE_ENV !== 'production' || process.env.LOCAL === 'true') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
