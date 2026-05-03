const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/search.controller');

router.get('/', ctrl.searchPincodes);
router.get('/:pincode', ctrl.getPincodeDetails);

module.exports = router;
