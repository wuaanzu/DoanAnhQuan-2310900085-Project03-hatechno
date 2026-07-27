// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');
const { authenticate, managerOrAdmin } = require('../middleware/authMiddleware');

router.use(authenticate, managerOrAdmin);
router.get('/salary', ctrl.salaryReport);
router.get('/employees', ctrl.employeeReport);
router.get('/top-employees', ctrl.topEmployees);
router.get('/cost', ctrl.totalCost);

module.exports = router;
