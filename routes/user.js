const express = require('express');
const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', authMiddleware, userController.getStats);
router.get('/next-step', authMiddleware, userController.getNextStep);

module.exports = router;
