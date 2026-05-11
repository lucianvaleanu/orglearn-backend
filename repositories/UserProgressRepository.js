const { UserProgress } = require('../models');

class UserProgressRepository {
  async create(progressData) {
    return UserProgress.create(progressData);
  }

  async findById(id) {
    return UserProgress.findByPk(id);
  }

  async findByUserAndScenario(userId, scenarioId) {
    return UserProgress.findOne({
      where: { user_id: userId, scenario_id: scenarioId }
    });
  }

  async updateById(id, updates) {
    await UserProgress.update(updates, { where: { id } });
    return UserProgress.findByPk(id);
  }

  async deleteById(id) {
    return UserProgress.destroy({ where: { id } });
  }

  async listByUser(userId) {
    return UserProgress.findAll({ where: { user_id: userId } });
  }
}

module.exports = new UserProgressRepository();
