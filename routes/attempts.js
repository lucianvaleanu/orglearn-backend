const express = require('express');
const { z } = require('zod');
const attemptController = require('../controllers/AttemptController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

const startAttemptSchema = z.object({
  body: z.object({
    scenarioId: z.string().uuid()
  })
});

const completeAttemptSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    score: z.number().int().min(0).max(100),
    status: z.enum(['completed', 'abandoned']).optional()
  })
});

router.post('/start', authMiddleware, validate(startAttemptSchema), attemptController.startAttempt);
router.patch(
  '/:id/complete',
  authMiddleware,
  validate(completeAttemptSchema),
  attemptController.completeAttempt
);

module.exports = router;
