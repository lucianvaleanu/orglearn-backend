const scenarioService = require('../services/ScenarioService');

class ScenarioController {
  // Controller layer: handle request/response flow for a single scenario.
  async getScenarioById(req, res, next) {
    try {
      const { id } = req.validated.params;
      const data = await scenarioService.getScenarioById(id);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

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
