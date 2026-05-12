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

const scenarioByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

// Route layer: authorize and validate before handing off to the controller.
router.get(
  '/:id',
  authMiddleware,
  validate(scenarioByIdSchema),
  scenarioController.getScenarioById
);

router.get(
  '/selection/:userId',
  authMiddleware,
  validate(scenarioSelectionSchema),
  scenarioController.getScenarioSelection
);

module.exports = router;
