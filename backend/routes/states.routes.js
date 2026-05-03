const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/states.controller');

router.get('/', ctrl.getStates);
router.get('/:state', ctrl.getStateDirectory);
router.get('/:state/districts', ctrl.getDistricts);
router.get('/:state/districts/:district/taluks', ctrl.getTaluks);

module.exports = router;
