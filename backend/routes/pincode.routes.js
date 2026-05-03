const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pincode.controller');

router.get('/', ctrl.getFilteredPincodes);

module.exports = router;
