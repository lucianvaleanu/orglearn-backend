const scenarioRepository = require('../repositories/ScenarioRepository');

class ScenarioService {
  async getScenarioSelectionForUser(userId) {
    const scenarios = await scenarioRepository.getScenarioSelectionForUser(userId);

    return scenarios.map((scenario) => {
      const progressEntry = Array.isArray(scenario.userProgressEntries)
        ? scenario.userProgressEntries[0]
        : null;
      const status = progressEntry ? progressEntry.status : 'not_started';

      return {
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        domainTitle: scenario.domain ? scenario.domain.title : null,
        difficultyLevel: scenario.difficulty_level,
        status,
        action: this.getActionForStatus(status)
      };
    });
  }

  getActionForStatus(status) {
    switch (status) {
      case 'completed':
        return 'Repeat';
      case 'in_progress':
        return 'Continue';
      case 'not_started':
        return 'Start';
      default:
        return 'Continue';
    }
  }
}

module.exports = new ScenarioService();
