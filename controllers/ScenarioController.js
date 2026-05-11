const scenarioService = require('../services/ScenarioService');

class ScenarioController {
  async getScenarioSelection(req, res, next) {
    try {
      const { userId } = req.validated.params;
      const data = await scenarioService.getScenarioSelectionForUser(userId);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ScenarioController();
