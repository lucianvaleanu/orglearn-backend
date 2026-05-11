const { Scenario, Domain, UserProgress } = require('../models');

class ScenarioRepository {
  async getScenarioSelectionForUser(userId) {
    return Scenario.findAll({
      attributes: ['id', 'title', 'difficulty_level'],
      include: [
        {
          model: Domain,
          as: 'domain',
          attributes: ['title']
        },
        {
          model: UserProgress,
          as: 'userProgressEntries',
          attributes: ['status'],
          required: false,
          where: { user_id: userId }
        }
      ],
      order: [['title', 'ASC']]
    });
  }
}

module.exports = new ScenarioRepository();
