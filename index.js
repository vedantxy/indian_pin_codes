const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initializeFieldMap } = require('./utils/fieldMapper');

// Routers
const statsRoutes = require('./routes/statsRoutes');
const pincodeRoutes = require('./routes/pincodeRoutes');
const locationRoutes = require('./routes/locationRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hackthone';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await initializeFieldMap();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/stats', statsRoutes);
app.use('/api/pincode', pincodeRoutes);
app.use('/api/search', locationRoutes); // Mapping search/states under location logic
app.use('/api', locationRoutes); 
app.use('/api/export', exportRoutes);

// Catch-all middleware to serve React's index.html for SPA routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
