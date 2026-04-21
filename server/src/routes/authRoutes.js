const express = require('express');
const { login, register, me, createUser } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, me);
router.post('/users', authenticate, authorize('Admin'), createUser);

module.exports = router;
