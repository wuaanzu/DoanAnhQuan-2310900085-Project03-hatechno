// routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/leaveController');
const { authenticate, managerOrAdmin } = require('../middleware/authMiddleware');

router.use(authenticate);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.put('/:id/approve', managerOrAdmin, ctrl.approve);
router.put('/:id/reject', managerOrAdmin, ctrl.reject);
router.delete('/:id', managerOrAdmin, ctrl.remove);

module.exports = router;
