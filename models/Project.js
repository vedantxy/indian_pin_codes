const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    officeName: String,
    pincode: String,
    officeType: String,
    deliveryStatus: String,
    divisionName: String,
    regionName: String,
    circleName: String,
    taluk: String,
    districtName: String,
    stateName: String
}, { 
    collection: 'project',
    strict: false // Allow for dynamic mapping of keys with spaces
});

module.exports = mongoose.model('Project', projectSchema);
