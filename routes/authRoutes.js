// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, register, logout, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/login', login);
router.post('/register', upload.single('avatar'), register);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

module.exports = router;
