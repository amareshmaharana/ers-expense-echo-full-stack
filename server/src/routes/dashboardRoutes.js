const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getOverview } = require('../controllers/dashboardController');
const { dashboardSummary } = require('../controllers/reimbursementController');

const router = express.Router();

router.use(authenticate);
router.get('/overview', getOverview);
router.get('/summary', dashboardSummary);

module.exports = router;
