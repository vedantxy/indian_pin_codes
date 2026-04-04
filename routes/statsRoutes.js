const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { getFieldMap } = require('../utils/fieldMapper');

// Global Dashboard Stats
router.get('/', async (req, res) => {
    try {
        const fieldMap = getFieldMap();
        const pKey = fieldMap.pincode || 'pincode';
        const sKey = fieldMap.stateName || 'stateName';
        const dStatusKey = fieldMap.deliveryStatus || 'deliveryStatus';
        
        const [totalPincodes, totalStates, deliveryOffices, nonDeliveryOffices] = await Promise.all([
            Project.distinct(pKey).then(arr => arr.length),
            Project.distinct(sKey).then(arr => arr.length),
            Project.countDocuments({ [dStatusKey]: new RegExp('^\\s*Delivery\\s*$', 'i') }),
            Project.countDocuments({ [dStatusKey]: new RegExp('^\\s*Non-Delivery\\s*$', 'i') })
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

// State-wise Distribution
router.get('/state-distribution', async (req, res) => {
    try {
        const fieldMap = getFieldMap();
        const sKey = fieldMap.stateName || 'stateName';
        
        const distribution = await Project.aggregate([
            { $group: { _id: `$${sKey}`, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 }
        ]);

        const formatted = distribution.map(item => ({
            state: (item._id || 'Unknown').trim(),
            count: item.count
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delivery Status Distribution
router.get('/delivery-distribution', async (req, res) => {
    try {
        const fieldMap = getFieldMap();
        const dStatusKey = fieldMap.deliveryStatus || 'deliveryStatus';
        
        const [delivery, nonDelivery] = await Promise.all([
            Project.countDocuments({ [dStatusKey]: new RegExp('^\\s*Delivery\\s*$', 'i') }),
            Project.countDocuments({ [dStatusKey]: new RegExp('^\\s*Non-Delivery\\s*$', 'i') })
        ]);
        res.json({ delivery, nonDelivery });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
