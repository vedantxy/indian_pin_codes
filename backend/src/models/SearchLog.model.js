const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
    query: String,
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['Pincode', 'Search', 'State'], default: 'Search' }
});

module.exports = mongoose.model('SearchLog', searchLogSchema);
