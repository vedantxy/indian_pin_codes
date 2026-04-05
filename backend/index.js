require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { initializeFieldMap } = require('./utils/fieldMap');

// Import Routes
const statsRoutes = require('./routes/statsRoutes');
const pincodeRoutes = require('./routes/pincodeRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB().then(async () => {
    // Initialize Field Mapping after connection
    await initializeFieldMap();
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.json());

// API Routes
app.use('/api/stats', statsRoutes);
app.use('/api/pincodes', pincodeRoutes); // This will handle /api/pincodes directly
app.use('/api/export', exportRoutes);

// Additional routes for backward compatibility/specific features
// The pincodeRoutes also handles /states, /search, etc.
app.use('/api', pincodeRoutes); 

// Catch-all middleware to serve React's index.html for SPA routing
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
