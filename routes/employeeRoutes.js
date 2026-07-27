// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/employeeController');
const { authenticate, managerOrAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authenticate);
router.get('/simple', ctrl.getSimple);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', managerOrAdmin, upload.single('avatar'), ctrl.create);
router.put('/:id', managerOrAdmin, upload.single('avatar'), ctrl.update);
router.delete('/:id', managerOrAdmin, ctrl.remove);

module.exports = router;
