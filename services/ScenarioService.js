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

  // Service layer: load scenario details and normalize content_data for the API.
  async getScenarioById(id) {
    const scenario = await scenarioRepository.getScenarioById(id);

    if (!scenario) {
      const error = new Error('Scenario not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: scenario.id,
      title: scenario.title,
      difficulty_level: scenario.difficulty_level,
      content_data: this.normalizeContentData(scenario.content_data),
      domain: scenario.domain
        ? {
            id: scenario.domain.id,
            title: scenario.domain.title
          }
        : null
    };
  }

  normalizeContentData(contentData) {
    if (contentData && typeof contentData === 'string') {
      try {
        return JSON.parse(contentData);
      } catch (error) {
        const parseError = new Error('Scenario content is invalid.');
        parseError.statusCode = 500;
        throw parseError;
      }
    }

    return contentData;
  }
}

module.exports = new ScenarioService();
