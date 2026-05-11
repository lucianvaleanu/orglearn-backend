const authService = require('../services/auth.service');

class AuthController {
  async signup(req, res, next) {
    try {
      const { name, email, password } = req.validated.body;
      const user = await authService.signup({ name, email, password });
      res.status(201).json({ user });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.validated.body;
      const result = await authService.login({ email, password });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.userId);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async socialLogin(req, res, next) {
    try {
      const result = authService.createAuthResponse(req.user);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
