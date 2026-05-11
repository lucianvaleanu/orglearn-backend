const domainService = require('../services/DomainService');

class DomainController {
  async getDomains(req, res, next) {
    try {
      const data = await domainService.getDomainsWithProgress(req.user.userId);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DomainController();
