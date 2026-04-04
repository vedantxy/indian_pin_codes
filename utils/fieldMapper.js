const mongoose = require('mongoose');
const Project = require('../models/Project');

let fieldMap = {};

const initializeFieldMap = async () => {
    try {
        const doc = await Project.findOne();
        if (doc) {
            const keys = Object.keys(doc.toObject());
            fieldMap = {
                officeName: keys.find(k => k.trim().toLowerCase() === 'officename'),
                pincode: keys.find(k => k.trim().toLowerCase() === 'pincode'),
                districtName: keys.find(k => k.trim().toLowerCase() === 'districtname'),
                stateName: keys.find(k => k.trim().toLowerCase() === 'statename'),
                deliveryStatus: keys.find(k => k.trim().toLowerCase() === 'deliverystatus')
            };
            console.log('Fields mapped:', fieldMap);

            // Trigger background indexing for better performance
            const collection = mongoose.connection.collection('project');
            Object.values(fieldMap).filter(Boolean).forEach(key => {
                collection.createIndex({ [key]: 1 }).catch(e => console.log(`Index exists or error for ${key}`));
            });
            console.log('Background indexing initiated.');
        }
    } catch (err) {
        console.error('Field mapping error:', err);
    }
};

const getFieldMap = () => fieldMap;

const getQuery = (field, value) => {
    const actualKey = fieldMap[field] || field;
    return { [actualKey]: new RegExp(`^\\s*${value}\\s*$`, 'i') };
};

module.exports = {
    initializeFieldMap,
    getFieldMap,
    getQuery
};
