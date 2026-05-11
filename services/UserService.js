const { UserProgress, Scenario } = require('../models');
const userRepository = require('../repositories/UserRepository');
const scenarioRepository = require('../repositories/ScenarioRepository');

const RANK_THRESHOLDS = [
  { name: 'Junior', minScore: 0 },
  { name: 'Associate', minScore: 200 },
  { name: 'Senior', minScore: 500 },
  { name: 'Lead', minScore: 900 }
];

class UserService {
  async getStats(userId) {
    const user = await userRepository.getRankAndStats(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const totalScore = (await userRepository.getTotalScore(userId)) || 0;
    const currentRank = this.getRankForScore(totalScore);

    const totalScenarios = await Scenario.count();
    const completedScenarios = await UserProgress.count({
      where: { user_id: userId, status: 'completed' }
    });

    const overallProgressPercentage = totalScenarios
      ? Number(((completedScenarios / totalScenarios) * 100).toFixed(2))
      : 0;

    if (
      currentRank !== user.current_rank ||
      Number(user.overall_progress_percentage) !== overallProgressPercentage
    ) {
      await userRepository.updateById(userId, {
        current_rank: currentRank,
        overall_progress_percentage: overallProgressPercentage
      });
    }

    return {
      currentRank,
      overallProgressPercentage
    };
  }

  async getNextStep(userId) {
    const inProgress = await scenarioRepository.getFirstInProgressScenario(userId);

    if (inProgress) {
      return this.buildScenarioPayload(inProgress.scenario, inProgress.status);
    }

    let domainId = await scenarioRepository.getMostRecentDomainId(userId);

    if (!domainId) {
      domainId = await scenarioRepository.getFirstDomainId();
    }

    if (!domainId) {
      return null;
    }

    const nextScenario = await scenarioRepository.getNextNotStartedScenarioInDomain(
      userId,
      domainId
    );

    if (!nextScenario) {
      return null;
    }

    const progressEntry = Array.isArray(nextScenario.userProgressEntries)
      ? nextScenario.userProgressEntries[0]
      : null;
    const status = progressEntry ? progressEntry.status : 'not_started';

    return this.buildScenarioPayload(nextScenario, status);
  }

  buildScenarioPayload(scenario, status) {
    if (!scenario) {
      return null;
    }

    return {
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      domainTitle: scenario.domain ? scenario.domain.title : null,
      difficultyLevel: scenario.difficulty_level,
      status,
      action: this.getActionForStatus(status)
    };
  }

  getActionForStatus(status) {
    if (status === 'completed') {
      return 'Repeat';
    }

    if (status === 'in_progress') {
      return 'Continue';
    }

    return 'Start';
  }

  getRankForScore(score) {
    const normalizedScore = Number(score) || 0;

    return RANK_THRESHOLDS.reduce((selected, threshold) => {
      if (normalizedScore >= threshold.minScore) {
        return threshold.name;
      }
      return selected;
    }, RANK_THRESHOLDS[0].name);
  }
}

module.exports = new UserService();
