const express = require('express');
const upload = require('../services/upload');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createReimbursement,
  listReimbursements,
  getReimbursement,
  reviewReimbursement,
} = require('../controllers/reimbursementController');

const router = express.Router();

router.use(authenticate);

router.get('/', listReimbursements);
router.get('/:id', getReimbursement);
router.post('/', authorize('Employee', 'Admin'), upload.single('receipt'), createReimbursement);
router.patch('/:id/review', authorize('Manager', 'Director', 'Accountant'), reviewReimbursement);

module.exports = router;
