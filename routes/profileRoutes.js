// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/profileController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authenticate);
router.get('/', ctrl.getProfile);
router.put('/', upload.single('avatar'), ctrl.updateProfile);
router.put('/password', ctrl.changePassword);
router.get('/salary', ctrl.getMySalary);
router.get('/attendance', ctrl.getMyAttendance);

module.exports = router;
