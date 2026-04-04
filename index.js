require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend/dist')));
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

// 1. List of all states
// Endpoint: /api/states
app.get('/api/states', async (req, res) => {
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

// 2. List all unique districts for a given state
// Endpoint: /api/states/:state/districts
app.get('/api/states/:state/districts', async (req, res) => {
    try {
        const { state } = req.params;
        const query = getQuery('stateName', state);
        const districtKey = fieldMap.districtName || 'districtName';
        
        const districts = await Project.distinct(districtKey, query);
        // Trim results and remove duplicates
        const uniqueDistricts = [...new Set(districts.map(d => d ? d.trim() : d).filter(Boolean))];
        
        if (uniqueDistricts.length === 0) {
            return res.status(404).json({ message: 'No districts found for this state' });
        }
        
        res.json(uniqueDistricts.sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get all taluks (office names) based on state and district
// Endpoint: /api/states/:state/districts/:district/taluks
app.get('/api/states/:state/districts/:district/taluks', async (req, res) => {
    try {
        const { state, district } = req.params;
        const stateQuery = getQuery('stateName', state);
        const districtQuery = getQuery('districtName', district);
        
        // Combine queries
        const query = { ...stateQuery, ...districtQuery };
        const officeKey = fieldMap.officeName || 'officeName';
        
        const taluks = await Project.distinct(officeKey, query);
        const uniqueTaluks = [...new Set(taluks.map(t => t ? t.trim() : t).filter(Boolean))];
        
        if (uniqueTaluks.length === 0) {
            return res.status(404).json({ message: 'No taluks found for this selection' });
        }
        
        res.json(uniqueTaluks.sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Dashboard Stats API
// Endpoint: /api/stats
app.get('/api/stats', async (req, res) => {
    try {
        const pKey = fieldMap.pincode || 'pincode';
        const sKey = fieldMap.stateName || 'stateName';
        
        const [totalPincodes, totalStates, deliveryOffices, nonDeliveryOffices] = await Promise.all([
            Project.distinct(pKey).then(arr => arr.length),
            Project.distinct(sKey).then(arr => arr.length),
            Project.countDocuments({ deliveryStatus: 'Delivery' }),
            Project.countDocuments({ deliveryStatus: 'Non-Delivery' })
        ]);

        res.json({
            totalPincodes,
            totalStates,
            deliveryOffices,
            nonDeliveryOffices
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. State-wise Distribution API (for charts)
// Endpoint: /api/stats/state-distribution
app.get('/api/stats/state-distribution', async (req, res) => {
    try {
        const sKey = fieldMap.stateName || 'stateName';
        
        const distribution = await Project.aggregate([
            {
                $group: {
                    _id: `$${sKey}`,
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 15 }
        ]);

        const formattedData = distribution.map(item => ({
            state: (item._id || 'Unknown').trim(),
            count: item.count
        }));

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Delivery Status Distribution API
// Endpoint: /api/stats/delivery-distribution
app.get('/api/stats/delivery-distribution', async (req, res) => {
    try {
        const [delivery, nonDelivery] = await Promise.all([
            Project.countDocuments({ deliveryStatus: 'Delivery' }),
            Project.countDocuments({ deliveryStatus: 'Non-Delivery' })
        ]);
        res.json({ delivery, nonDelivery });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Export API
// Endpoint: /api/export?state=GUJARAT
app.get('/api/export', async (req, res) => {
    try {
        const { state } = req.query;
        // Use the trim-resilient query helper
        const query = state ? getQuery('stateName', state) : {};
        
        // Fetch data
        const data = await Project.find(query).lean();
        
        if (data.length === 0) {
            return res.status(404).send('No data found to export');
        }

        // Define CSV headers (based on conceptual fields)
        const fields = ['pincode', 'officeName', 'taluk', 'districtName', 'stateName', 'deliveryStatus'];
        const displayHeaders = ['Pincode', 'Office Name', 'Taluk', 'District', 'State', 'Delivery Status'];

        // Generate CSV content
        let csvContent = displayHeaders.join(',') + '\n';
        
        data.forEach(item => {
            const row = fields.map(field => {
                // Get the actual key from fieldMap, or use the field name as fallback
                const actualKey = fieldMap[field] || field;
                let val = item[actualKey] || '';
                
                // Trim trailing spaces from the value if it's a string
                if (typeof val === 'string') val = val.trim();
                
                // Escape quotes and wrap in quotes
                const escaped = val.toString().replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvContent += row.join(',') + '\n';
        });

        // Set Headers for Download
        const fileName = state ? `pincode_data_${state.toLowerCase().replace(/ /g, '_')}.csv` : 'pincode_data_all.csv';
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.status(200).send(csvContent);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. List all cities based on district for a state
// Endpoint: /api/states/:state_name
app.get('/api/states/:state_name', async (req, res) => {
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

// 5. Search API for suggestions (Debounced input)
// Endpoint: /api/search?q=...
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);

        const oKey = fieldMap.officeName || 'officeName';
        const pKey = fieldMap.pincode || 'pincode';
        const dKey = fieldMap.districtName || 'districtName';

        const regex = new RegExp(q, 'i');
        const query = {
            $or: [
                { [oKey]: regex },
                { [pKey]: regex },
                { [dKey]: regex }
            ]
        };

        const results = await Project.find(query).limit(10);
        
        // Sanitize and return unique suggestions
        const suggestions = results.map(doc => {
            const obj = doc.toObject();
            return {
                office: (obj[oKey] || '').trim(),
                pincode: (obj[pKey] || '').trim(),
                district: (obj[dKey] || '').trim(),
                state: (obj[fieldMap.stateName || 'stateName'] || '').trim()
            };
        });

        res.json(suggestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Get Filtered PIN Code Data (MAIN API)
// Endpoint: /api/pincodes
app.get('/api/pincodes', async (req, res) => {
    try {
        const { state, district, taluk, page = 1, limit = 20 } = req.query;
        const p = parseInt(page);
        const l = parseInt(limit);

        const query = {};
        if (state) Object.assign(query, getQuery('stateName', state));
        if (district) Object.assign(query, getQuery('districtName', district));
        if (taluk) Object.assign(query, getQuery('officeName', taluk));

        const total = await Project.countDocuments(query);
        const data = await Project.find(query)
            .skip((p - 1) * l)
            .limit(l);

        // Trim values for response
        const sanitizedData = data.map(doc => {
            const obj = doc.toObject();
            const sanitized = {};
            for (const [key, val] of Object.entries(obj)) {
                sanitized[key.trim()] = typeof val === 'string' ? val.trim() : val;
            }
            return sanitized;
        });

        res.json({
            data: sanitizedData,
            total,
            page: p,
            limit: l
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Get city details by pincode
// Endpoint: /api/pincode/:pincode
app.get('/api/pincode/:pincode', async (req, res) => {
    try {
        const { pincode } = req.params;
        const query = getQuery('pincode', pincode);
        
        const results = await Project.find(query).lean();
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'No offices found for this pincode' });
        }
        
        // Trim results for cleaner response
        const cleanResults = results.map(item => ({
            office: (item[fieldMap.officeName || 'officeName'] || '').trim(),
            pincode: (item[fieldMap.pincode || 'pincode'] || '').trim(),
            district: (item[fieldMap.districtName || 'districtName'] || '').trim(),
            state: (item[fieldMap.stateName || 'stateName'] || '').trim()
        }));
        
        res.json(cleanResults);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Catch-all route to serve React's index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
