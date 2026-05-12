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

  async getFirstInProgressScenario(userId) {
    return UserProgress.findOne({
      where: { user_id: userId, status: 'in_progress' },
      include: [
        {
          model: Scenario,
          as: 'scenario',
          attributes: ['id', 'title', 'difficulty_level'],
          include: [
            {
              model: Domain,
              as: 'domain',
              attributes: ['title']
            }
          ]
        }
      ],
      order: [
        ['last_accessed_at', 'DESC'],
        ['updated_at', 'DESC']
      ]
    });
  }

  async getMostRecentDomainId(userId) {
    const progress = await UserProgress.findOne({
      where: { user_id: userId },
      include: [
        {
          model: Scenario,
          as: 'scenario',
          attributes: ['domain_id']
        }
      ],
      order: [
        ['last_accessed_at', 'DESC'],
        ['updated_at', 'DESC']
      ]
    });

    return progress && progress.scenario ? progress.scenario.domain_id : null;
  }

  async getFirstDomainId() {
    const domain = await Domain.findOne({
      attributes: ['id'],
      order: [['title', 'ASC']]
    });

    return domain ? domain.id : null;
  }

  // Model access: fetch a scenario with its domain for detail views.
  async getScenarioById(id) {
    return Scenario.findByPk(id, {
      include: [
        {
          model: Domain,
          as: 'domain',
          attributes: ['id', 'title']
        }
      ]
    });
  }

  async getNextNotStartedScenarioInDomain(userId, domainId) {
    const scenarios = await Scenario.findAll({
      where: { domain_id: domainId },
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

    return (
      scenarios.find((scenario) => {
        const progressEntry = Array.isArray(scenario.userProgressEntries)
          ? scenario.userProgressEntries[0]
          : null;
        return !progressEntry || progressEntry.status === 'not_started';
      }) || null
    );
  }
}

module.exports = new ScenarioRepository();
