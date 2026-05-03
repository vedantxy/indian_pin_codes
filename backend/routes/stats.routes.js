const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stats.controller');

router.get('/', ctrl.getGeneralStats);
router.get('/state-distribution', ctrl.getStateDistribution);
router.get('/delivery-distribution', ctrl.getDeliveryDistribution);
router.get('/state-reach', ctrl.getStateReach);
router.get('/search-activity', ctrl.getSearchActivity);

module.exports = router;
