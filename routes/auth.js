const express = require('express');
const { z } = require('zod');
const passport = require('passport');
const authController = require('../controllers/AuthController');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8)
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
});

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.me);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.socialLogin
);

router.get(
  '/apple',
  passport.authenticate('apple', {
    scope: ['name', 'email'],
    session: false
  })
);

router.post(
  '/apple/callback',
  passport.authenticate('apple', { session: false }),
  authController.socialLogin
);

module.exports = router;
