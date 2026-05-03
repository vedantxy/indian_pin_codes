const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

router.get('/', statsController.getGeneralStats);
router.get('/state-distribution', statsController.getStateDistribution);
router.get('/delivery-distribution', statsController.getDeliveryDistribution);
router.get('/state-reach', statsController.getStateReach);
router.get('/search-activity', statsController.getSearchActivity);

module.exports = router;
