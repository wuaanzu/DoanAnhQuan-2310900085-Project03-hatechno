// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/attendanceController');
const { authenticate, managerOrAdmin } = require('../middleware/authMiddleware');

router.use(authenticate);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', managerOrAdmin, ctrl.create);
router.put('/:id', managerOrAdmin, ctrl.update);
router.delete('/:id', managerOrAdmin, ctrl.remove);

module.exports = router;
