const { User } = require('../models');

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async findByGoogleId(googleId) {
    return User.findOne({ where: { google_id: googleId } });
  }

  async findByAppleId(appleId) {
    return User.findOne({ where: { apple_id: appleId } });
  }

  async findById(userId) {
    return User.findByPk(userId);
  }

  async create(userData) {
    return User.create(userData);
  }

  async updateById(userId, updates) {
    await User.update(updates, { where: { id: userId } });
    return User.findByPk(userId);
  }
}

module.exports = new UserRepository();
