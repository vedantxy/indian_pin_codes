const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { getFieldMap, getQuery } = require('../utils/fieldMapper');

// Global Search
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: 'Search query required' });

        const fieldMap = getFieldMap();
        const oKey = fieldMap.officeName || 'officeName';
        const pKey = fieldMap.pincode || 'pincode';
        const dKey = fieldMap.districtName || 'districtName';

        const results = await Project.find({
            $or: [
                { [pKey]: new RegExp(`^${q}`, 'i') },
                { [oKey]: new RegExp(`^${q}`, 'i') }
            ]
        }).limit(10);

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

// All Unique States
router.get('/states', async (req, res) => {
    try {
        const fieldMap = getFieldMap();
        const sKey = fieldMap.stateName || 'stateName';
        const states = await Project.distinct(sKey);
        res.json(states.filter(Boolean).map(s => s.trim()).sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Districts in State
router.get('/states/:state_name', async (req, res) => {
    try {
        const { state_name } = req.params;
        const fieldMap = getFieldMap();
        const sKey = fieldMap.stateName || 'stateName';
        const dKey = fieldMap.districtName || 'districtName';
        const oKey = fieldMap.officeName || 'officeName';

        const results = await Project.find({ [sKey]: new RegExp(`^\\s*${state_name}\\s*$`, 'i') }).lean();
        
        const groupedData = results.reduce((acc, curr) => {
            const district = (curr[dKey] || 'Unknown').trim();
            const city = (curr[oKey] || 'Unknown').trim();
            if (!acc[district]) acc[district] = [];
            if (!acc[district].includes(city)) acc[district].push(city);
            return acc;
        }, {});

        res.json(groupedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
