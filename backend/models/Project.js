const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({}, { strict: false, collection: 'project' });

module.exports = mongoose.model('Project', projectSchema);
