const userService = require('../services/UserService');

class UserController {
  async getStats(req, res, next) {
    try {
      const data = await userService.getStats(req.user.userId);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getNextStep(req, res, next) {
    try {
      const data = await userService.getNextStep(req.user.userId);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
