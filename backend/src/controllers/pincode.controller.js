const Pincode = require('../models/Pincode.model');
const SearchLog = require('../models/SearchLog.model');

// Exact key for stateName due to trailing spaces in database
const STATE_KEY = 'stateName                                       ';

exports.getStates = async (req, res) => {
    try {
        const states = await Pincode.distinct(STATE_KEY);
        const cleanStates = [...new Set(states.map(s => s ? s.trim() : s).filter(Boolean))];
        res.json(cleanStates.sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDistricts = async (req, res) => {
    try {
        const { state } = req.params;
        const query = { [STATE_KEY]: new RegExp(`^\\s*${state}\\s*$`, 'i') };
        const districts = await Pincode.distinct('districtName', query);
        const cleanDistricts = [...new Set(districts.map(d => d ? d.trim() : d).filter(Boolean))];
        res.json(cleanDistricts.sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTaluks = async (req, res) => {
    try {
        const { state, district } = req.params;
        const query = { 
            [STATE_KEY]: new RegExp(`^\\s*${state}\\s*$`, 'i'),
            districtName: new RegExp(`^\\s*${district}\\s*$`, 'i')
        };
        const taluks = await Pincode.distinct('taluk', query);
        const cleanTaluks = [...new Set(taluks.map(t => t ? t.trim() : t).filter(Boolean))];
        res.json(cleanTaluks.sort());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.searchPincodes = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);

        const regex = new RegExp(q, 'i');
        const query = {
            $or: [
                { officeName: regex }, 
                { pincode: regex }, 
                { districtName: regex },
                { [STATE_KEY]: regex }
            ]
        };

        new SearchLog({ query: q, type: 'Search' }).save().catch(console.error);

        const results = await Pincode.find(query).limit(15).lean();
        const cleanResults = results.map(item => ({
            officeName: (item.officeName || '').trim(),
            pincode: (item.pincode || '').trim(),
            district: (item.districtName || '').trim(),
            state: (item[STATE_KEY] || '').trim(),
            taluk: (item.taluk || '').trim()
        }));
        res.json(cleanResults);
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
        if (state) query[STATE_KEY] = new RegExp(`^\\s*${state}\\s*$`, 'i');
        if (district) query.districtName = new RegExp(`^\\s*${district}\\s*$`, 'i');
        if (taluk) query.taluk = new RegExp(`^\\s*${taluk}\\s*$`, 'i');

        const total = await Pincode.countDocuments(query);
        const data = await Pincode.find(query).skip((p - 1) * l).limit(l).lean();

        const cleanData = data.map(item => ({
            officeName: (item.officeName || '').trim(),
            pincode: (item.pincode || '').trim(),
            district: (item.districtName || '').trim(),
            state: (item[STATE_KEY] || '').trim(),
            taluk: (item.taluk || '').trim(),
            deliveryStatus: (item.deliveryStatus || '').trim()
        }));

        res.json({ data: cleanData, total, page: p, limit: l });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStateDirectory = async (req, res) => {
    try {
        const { state } = req.params;
        const query = { [STATE_KEY]: new RegExp(`^\\s*${state}\\s*$`, 'i') };
        
        const data = await Pincode.find(query).lean();
        
        const grouped = data.reduce((acc, item) => {
            const district = (item.districtName || 'Unknown').trim();
            const office = (item.officeName || '').trim();
            if (!acc[district]) acc[district] = [];
            if (office && !acc[district].includes(office)) {
                acc[district].push(office);
            }
            return acc;
        }, {});

        res.json(grouped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPincodeDetails = async (req, res) => {
    try {
        const { pincode } = req.params;
        const results = await Pincode.find({ pincode }).lean();
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'No offices found for this pincode' });
        }

        new SearchLog({ query: pincode, type: 'Pincode' }).save().catch(console.error);
        
        const cleanResults = results.map(item => ({
            officeName: (item.officeName || '').trim(),
            pincode: (item.pincode || '').trim(),
            district: (item.districtName || '').trim(),
            state: (item[STATE_KEY] || '').trim(),
            taluk: (item.taluk || '').trim(),
            deliveryStatus: (item.deliveryStatus || '').trim()
        }));
        res.json(cleanResults);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
