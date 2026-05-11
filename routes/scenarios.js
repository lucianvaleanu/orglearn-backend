const express = require('express');
const { z } = require('zod');
const scenarioController = require('../controllers/ScenarioController');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const scenarioSelectionSchema = z.object({
  params: z.object({
    userId: z.string().uuid()
  })
});

router.get(
  '/selection/:userId',
  authMiddleware,
  validate(scenarioSelectionSchema),
  scenarioController.getScenarioSelection
);

module.exports = router;
