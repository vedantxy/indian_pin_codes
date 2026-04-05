const express = require('express');
const router = express.Router();
const pincodeController = require('../controllers/pincodeController');

router.get('/', pincodeController.getFilteredPincodes);
router.get('/states', pincodeController.getStates);
router.get('/states/:state/districts', pincodeController.getDistricts);
router.get('/states/:state/districts/:district/taluks', pincodeController.getTaluks);
router.get('/search', pincodeController.searchPincodes);
router.get('/pincode/:pincode', pincodeController.getPincodeDetails);

module.exports = router;
