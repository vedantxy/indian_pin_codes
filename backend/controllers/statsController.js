const Project = require('../models/Project');
const { getFieldMap } = require('../utils/fieldMap');

exports.getGeneralStats = async (req, res) => {
    try {
        const fieldMap = getFieldMap();
        const pKey = fieldMap.pincode || 'pincode';
        const sKey = fieldMap.stateName || 'stateName';
        const dStatusKey = fieldMap.deliveryStatus || 'deliveryStatus';

        const statesAggregation = await Project.aggregate([
            { $group: { _id: { $trim: { input: `$${sKey}` } } } },
            { $match: { _id: { $ne: null, $ne: "" } } }
        ]);

        const [totalPincodes, deliveryOffices, nonDeliveryOffices] = await Promise.all([
            Project.distinct(pKey).then(arr => arr.length),
            Project.countDocuments({ [dStatusKey]: new RegExp('^\\s*Delivery\\s*$', 'i') }),
            Project.countDocuments({ [dStatusKey]: new RegExp('^\\s*Non-Delivery\\s*$', 'i') })
        ]);

        res.json({
            totalPincodes,
            totalStates: statesAggregation.length,
            deliveryOffices,
            nonDeliveryOffices
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStateDistribution = async (req, res) => {
    try {
        const fieldMap = getFieldMap();
        const sKey = fieldMap.stateName || 'stateName';
        
        const distribution = await Project.aggregate([
            {
                $group: {
                    _id: { $trim: { input: `$${sKey}` } },
                    count: { $sum: 1 }
                }
            },
            { $match: { _id: { $ne: null, $ne: "" } } },
            { $sort: { count: -1 } },
            { $limit: 15 }
        ]);

        const formattedData = distribution.map(item => ({
            state: item._id,
            count: item.count
        }));

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDeliveryDistribution = async (req, res) => {
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
};

exports.getStateReach = async (req, res) => {
    try {
        const fieldMap = getFieldMap();
        const sKey = fieldMap.stateName || 'stateName';
        const dStatusKey = fieldMap.deliveryStatus || 'deliveryStatus';
        
        const reach = await Project.aggregate([
            {
                $group: {
                    _id: { $trim: { input: `$${sKey}` } },
                    total: { $sum: 1 },
                    deliveryCount: {
                        $sum: {
                            $cond: [{ $regexMatch: { input: `$${dStatusKey}`, regex: /^\s*Delivery\s*$/i } }, 1, 0]
                        }
                    }
                }
            },
            { $match: { _id: { $ne: null, $ne: "" } } },
            {
                $project: {
                    _id: 0,
                    state: "$_id",
                    total: 1,
                    deliveryCount: 1,
                    reach: {
                        $multiply: [{ $divide: ["$deliveryCount", "$total"] }, 100]
                    }
                }
            },
            { $sort: { reach: -1, total: -1 } }
        ]);

        res.json(reach);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
