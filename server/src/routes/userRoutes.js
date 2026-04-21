const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { listUsers, getUsersByRole, updateUserStatus, getSystemActivity } = require('../controllers/userController');

const router = express.Router();

router.use(authenticate, authorize('Admin'));
router.get('/', listUsers);
router.get('/activity', getSystemActivity);
router.get('/role/:role', getUsersByRole);
router.patch('/:id/status', updateUserStatus);

module.exports = router;
