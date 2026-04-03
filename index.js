require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hackthone';

// Dynamic field mapping to handle spaces in keys
let fieldMap = {};

async function initializeFieldMap() {
    try {
        const collection = mongoose.connection.collection('project');
        const doc = await collection.findOne();
        if (doc) {
            const keys = Object.keys(doc);
            fieldMap = {
                officeName: keys.find(k => k.trim() === 'officeName'),
                pincode: keys.find(k => k.trim() === 'pincode'),
                districtName: keys.find(k => k.trim() === 'districtName'),
                stateName: keys.find(k => k.trim() === 'stateName')
            };
            console.log('Fields mapped:', fieldMap);
        }
    } catch (err) {
        console.error('Field mapping error:', err);
    }
}

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await initializeFieldMap();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Schema Definition (vague to allow flexible keys)
const projectSchema = new mongoose.Schema({}, { strict: false, collection: 'project' });
const Project = mongoose.model('Project', projectSchema);

// Helper to create trim-resilient query (handles trailing spaces in values)
const getQuery = (field, value) => {
    const actualKey = fieldMap[field] || field;
    // Use regex to match value with optional leading/trailing whitespace
    return { [actualKey]: new RegExp(`^\\s*${value}\\s*$`, 'i') };
};

// 1. Get city details by pincode
// Endpoint: /api/:pincode
app.get('/api/:pincode', async (req, res) => {
    try {
        const { pincode } = req.params;
        const query = getQuery('pincode', pincode);
        const data = await Project.find(query);
        if (data.length === 0) {
            return res.status(404).json({ message: 'No data found for this pincode' });
        }
        // Trim values for response
        const sanitizedData = data.map(doc => {
            const obj = doc.toObject();
            const sanitized = {};
            for (const [key, val] of Object.entries(obj)) {
                sanitized[key.trim()] = typeof val === 'string' ? val.trim() : val;
            }
            return sanitized;
        });
        res.json(sanitizedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. List of all states
// Endpoint: /states
app.get('/states', async (req, res) => {
    try {
        const stateKey = fieldMap.stateName || 'stateName';
        const states = await Project.distinct(stateKey);
        // Trim results and remove duplicates
        const uniqueStates = [...new Set(states.map(s => s ? s.trim() : s).filter(Boolean))];
        res.json(uniqueStates.sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. List all cities based on district for a state
// Endpoint: /states/:state_name
app.get('/states/:state_name', async (req, res) => {
    try {
        const { state_name } = req.params;
        const query = getQuery('stateName', state_name);
        const results = await Project.find(query);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No data found for this state' });
        }

        const oKey = fieldMap.officeName || 'officeName';
        const dKey = fieldMap.districtName || 'districtName';

        const groupedData = results.reduce((acc, curr) => {
            const district = (curr[dKey] || 'Unknown').trim();
            const city = (curr[oKey] || 'Unknown').trim();

            if (!acc[district]) {
                acc[district] = [];
            }
            if (!acc[district].includes(city)) {
                acc[district].push(city);
            }
            return acc;
        }, {});

        res.json(groupedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
