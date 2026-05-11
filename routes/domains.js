const express = require('express');
const domainController = require('../controllers/DomainController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, domainController.getDomains);

module.exports = router;
