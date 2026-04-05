const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/', statsController.getGeneralStats);
router.get('/state-distribution', statsController.getStateDistribution);
router.get('/delivery-distribution', statsController.getDeliveryDistribution);
router.get('/state-reach', statsController.getStateReach);

module.exports = router;
