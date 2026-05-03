const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/export.controller');

router.get('/', ctrl.exportToCSV);

module.exports = router;
