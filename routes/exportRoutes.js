const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { getFieldMap } = require('../utils/fieldMapper');

// Export to CSV
router.get('/', async (req, res) => {
    try {
        const { state } = req.query;
        const fieldMap = getFieldMap();
        const sKey = fieldMap.stateName || 'stateName';
        
        let query = {};
        if (state) {
            query[sKey] = new RegExp(`^\\s*${state}\\s*$`, 'i');
        }

        const cursor = Project.find(query).lean().cursor();
        
        const filename = state ? `pincodes_${state.replace(/\s+/g, '_')}.csv` : 'pincodes_master.csv';
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Write CSV Header
        const headers = ['Office Name', 'Pincode', 'District', 'State', 'Type', 'Delivery Status'];
        res.write(headers.join(',') + '\n');

        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            const row = [
                `"${(doc[fieldMap.officeName || 'officeName'] || '').trim()}"`,
                `"${(doc[fieldMap.pincode || 'pincode'] || '').trim()}"`,
                `"${(doc[fieldMap.districtName || 'districtName'] || '').trim()}"`,
                `"${(doc[fieldMap.stateName || 'stateName'] || '').trim()}"`,
                `"${(doc.officeType || '').trim()}"`,
                `"${(doc[fieldMap.deliveryStatus || 'deliveryStatus'] || '').trim()}"`
            ];
            res.write(row.join(',') + '\n');
        }

        res.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
