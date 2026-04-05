const Project = require('../models/Project');
const { getFieldMap } = require('../utils/fieldMap');
const { getQuery } = require('../utils/queryHelper');

exports.getStates = async (req, res) => {
    try {
        const fieldMap = getFieldMap();
        const stateKey = fieldMap.stateName || 'stateName';
        const states = await Project.distinct(stateKey);
        const uniqueStates = [...new Set(states.map(s => s ? s.trim() : s).filter(Boolean))];
        res.json(uniqueStates.sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDistricts = async (req, res) => {
    try {
        const { state } = req.params;
        const query = getQuery('stateName', state);
        const fieldMap = getFieldMap();
        const districtKey = fieldMap.districtName || 'districtName';
        const districts = await Project.distinct(districtKey, query);
        const uniqueDistricts = [...new Set(districts.map(d => d ? d.trim() : d).filter(Boolean))];
        
        if (uniqueDistricts.length === 0) {
            return res.status(404).json({ message: 'No districts found for this state' });
        }
        res.json(uniqueDistricts.sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTaluks = async (req, res) => {
    try {
        const { state, district } = req.params;
        const query = { ...getQuery('stateName', state), ...getQuery('districtName', district) };
        const fieldMap = getFieldMap();
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
};

exports.searchPincodes = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);
        const fieldMap = getFieldMap();
        const oKey = fieldMap.officeName || 'officeName';
        const pKey = fieldMap.pincode || 'pincode';
        const dKey = fieldMap.districtName || 'districtName';

        const regex = new RegExp(q, 'i');
        const query = {
            $or: [{ [oKey]: regex }, { [pKey]: regex }, { [dKey]: regex }]
        };

        const results = await Project.find(query).limit(10);
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
};

exports.getFilteredPincodes = async (req, res) => {
    try {
        const { state, district, taluk, page = 1, limit = 20 } = req.query;
        const p = parseInt(page);
        const l = parseInt(limit);

        const query = {};
        if (state) Object.assign(query, getQuery('stateName', state));
        if (district) Object.assign(query, getQuery('districtName', district));
        if (taluk) Object.assign(query, getQuery('taluk', taluk));

        const total = await Project.countDocuments(query);
        const data = await Project.find(query).skip((p - 1) * l).limit(l);

        const sanitizedData = data.map(doc => {
            const obj = doc.toObject();
            const sanitized = {};
            for (const [key, val] of Object.entries(obj)) {
                sanitized[key.trim()] = typeof val === 'string' ? val.trim() : val;
            }
            return sanitized;
        });

        res.json({ data: sanitizedData, total, page: p, limit: l });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPincodeDetails = async (req, res) => {
    try {
        const { pincode } = req.params;
        const query = getQuery('pincode', pincode);
        const fieldMap = getFieldMap();
        const results = await Project.find(query).lean();
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'No offices found for this pincode' });
        }
        
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
};
