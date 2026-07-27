// routes/salaryRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/salaryController');
const { authenticate, managerOrAdmin } = require('../middleware/authMiddleware');

router.use(authenticate);
router.get('/export/excel', managerOrAdmin, ctrl.exportExcel);
router.get('/:id/export/pdf', ctrl.exportPDF);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', managerOrAdmin, ctrl.create);
router.put('/:id/finalize', managerOrAdmin, ctrl.finalize);
router.delete('/:id', managerOrAdmin, ctrl.remove);

module.exports = router;
