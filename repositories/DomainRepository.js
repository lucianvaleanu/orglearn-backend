const { Domain, Scenario, UserProgress } = require('../models');

class DomainRepository {
  async getAllWithProgress(userId) {
    return Domain.findAll({
      attributes: ['id', 'title', 'description'],
      include: [
        {
          model: Scenario,
          as: 'scenarios',
          attributes: ['id', 'title'],
          include: [
            {
              model: UserProgress,
              as: 'userProgressEntries',
              attributes: ['status'],
              required: false,
              where: { user_id: userId }
            }
          ]
        }
      ],
      order: [
        ['title', 'ASC'],
        [{ model: Scenario, as: 'scenarios' }, 'title', 'ASC']
      ]
    });
  }
}

module.exports = new DomainRepository();
