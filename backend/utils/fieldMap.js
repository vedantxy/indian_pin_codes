const mongoose = require('mongoose');

let fieldMap = {};

async function initializeFieldMap() {
    if (Object.keys(fieldMap).length > 0) return fieldMap;
    try {
        const collection = mongoose.connection.collection('project');
        const doc = await collection.findOne();
        if (doc) {
            const keys = Object.keys(doc);
            fieldMap = {
                officeName: keys.find(k => k.trim().toLowerCase() === 'officename'),
                pincode: keys.find(k => k.trim().toLowerCase() === 'pincode'),
                taluk: keys.find(k => k.trim().toLowerCase() === 'taluk'),
                districtName: keys.find(k => k.trim().toLowerCase() === 'districtname'),
                stateName: keys.find(k => k.trim().toLowerCase() === 'statename'),
                deliveryStatus: keys.find(k => k.trim().toLowerCase() === 'deliverystatus')
            };
            console.log('Fields mapped successfully:', fieldMap);

            // Filter out any undefined fields
            const validFields = Object.entries(fieldMap).filter(([_, v]) => v);
            
            // Trigger background indexing for better performance
            validFields.forEach(([_, key]) => {
                collection.createIndex({ [key]: 1 }).catch(e => console.error(`Index error for ${key}:`, e));
            });
            return fieldMap;
        }
    } catch (err) {
        console.error('Field mapping error:', err);
    }
    return fieldMap;
}

module.exports = {
    initializeFieldMap,
    getFieldMap: () => fieldMap
};
