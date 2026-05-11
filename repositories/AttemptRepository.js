const { UserScenarioAttempt } = require('../models');

class AttemptRepository {
  async getLatestAttemptNumber(userId, scenarioId, transaction) {
    const latest = await UserScenarioAttempt.max('attempt_number', {
      where: { user_id: userId, scenario_id: scenarioId },
      transaction
    });

    return latest || 0;
  }

  async createAttempt(userId, scenarioId, attemptNumber, transaction) {
    return UserScenarioAttempt.create(
      {
        user_id: userId,
        scenario_id: scenarioId,
        attempt_number: attemptNumber,
        status: 'in_progress',
        started_at: new Date()
      },
      { transaction }
    );
  }

  async updateAttempt(attemptId, updates, transaction) {
    await UserScenarioAttempt.update(updates, {
      where: { id: attemptId },
      transaction
    });

    return UserScenarioAttempt.findByPk(attemptId, { transaction });
  }

  async abandonInProgressAttempts(userId, scenarioId, transaction) {
    await UserScenarioAttempt.update(
      { status: 'abandoned', completed_at: new Date() },
      {
        where: {
          user_id: userId,
          scenario_id: scenarioId,
          status: 'in_progress'
        },
        transaction
      }
    );
  }

  async findByIdForUser(attemptId, userId, transaction) {
    return UserScenarioAttempt.findOne({
      where: { id: attemptId, user_id: userId },
      transaction
    });
  }
}

module.exports = new AttemptRepository();
