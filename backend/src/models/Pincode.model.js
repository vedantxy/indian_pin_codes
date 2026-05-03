const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
    pincode: { type: String, required: true, index: true },
    officeName: { type: String, required: true },
    taluk: { type: String },
    districtName: { type: String, required: true },
    stateName: { type: String, alias: 'stateName                                       ' }, // Handling the spaces in key
    deliveryStatus: { type: String, default: 'Non-Delivery' }
}, { collection: 'project', strict: false });

module.exports = mongoose.model('Pincode', pincodeSchema);
