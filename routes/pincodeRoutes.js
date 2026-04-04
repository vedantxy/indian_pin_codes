const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { getFieldMap, getQuery } = require('../utils/fieldMapper');

// Get city details by pincode
router.get('/:pincode', async (req, res) => {
    try {
        const { pincode } = req.params;
        const fieldMap = getFieldMap();
        const query = getQuery('pincode', pincode);
        
        const results = await Project.find(query).lean();

        if (results.length === 0) {
            return res.status(404).json({ message: 'Pincode not found in archives' });
        }

        const cleanResults = results.map(item => ({
            office: (item[fieldMap.officeName || 'officeName'] || '').trim(),
            pincode: (item[fieldMap.pincode || 'pincode'] || '').trim(),
            district: (item[fieldMap.districtName || 'districtName'] || '').trim(),
            state: (item[fieldMap.stateName || 'stateName'] || '').trim(),
            delivery: (item[fieldMap.deliveryStatus || 'deliveryStatus'] || '').trim()
        }));

        res.json(cleanResults);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
