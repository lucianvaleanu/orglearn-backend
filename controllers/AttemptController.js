const attemptService = require('../services/AttemptService');

class AttemptController {
  async startAttempt(req, res, next) {
    try {
      const { scenarioId } = req.validated.body;
      const data = await attemptService.startAttempt(req.user.userId, scenarioId);
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async completeAttempt(req, res, next) {
    try {
      const { id } = req.validated.params;
      const { score, status } = req.validated.body;
      const data = await attemptService.completeAttempt(
        req.user.userId,
        id,
        score,
        status
      );
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AttemptController();
