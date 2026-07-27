// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getStats, getSalaryChart, getDepartmentChart } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);
router.get('/stats', getStats);
router.get('/chart/salary', getSalaryChart);
router.get('/chart/department', getDepartmentChart);

module.exports = router;
