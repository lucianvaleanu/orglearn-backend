const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/UserRepository');

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = '24h';
const DEFAULT_ROLE = 'user';

class AuthService {
  async signup({ name, email, password }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email already in use');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await userRepository.create({
      name,
      email,
      password_hash: passwordHash,
      role: DEFAULT_ROLE,
      current_rank: 'Junior'
    });

    return this.sanitizeUser(user);
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    return this.createAuthResponse(user);
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return this.sanitizeUser(user);
  }

  async handleSocialLogin({ provider, providerId, email, name }) {
    if (!providerId) {
      const error = new Error('Social account not available');
      error.statusCode = 401;
      throw error;
    }

    if (!email) {
      const error = new Error('Email is required for social login');
      error.statusCode = 400;
      throw error;
    }

    let user = await this.findByProviderId(provider, providerId);
    if (user) {
      return user;
    }

    user = await userRepository.findByEmail(email);

    if (user) {
      user = await this.linkProvider(user, provider, providerId);
      return user;
    }

    const passwordHash = await bcrypt.hash(this.generateRandomPassword(), SALT_ROUNDS);

    return userRepository.create({
      name: this.buildName(name, email),
      email,
      password_hash: passwordHash,
      role: DEFAULT_ROLE,
      current_rank: 'Junior',
      ...this.getProviderField(provider, providerId)
    });
  }

  async findByProviderId(provider, providerId) {
    if (provider === 'google') {
      return userRepository.findByGoogleId(providerId);
    }

    if (provider === 'apple') {
      return userRepository.findByAppleId(providerId);
    }

    return null;
  }

  async linkProvider(user, provider, providerId) {
    if (provider === 'google' && !user.google_id) {
      return userRepository.updateById(user.id, { google_id: providerId });
    }

    if (provider === 'apple' && !user.apple_id) {
      return userRepository.updateById(user.id, { apple_id: providerId });
    }

    return user;
  }

  getProviderField(provider, providerId) {
    if (provider === 'google') {
      return { google_id: providerId };
    }

    if (provider === 'apple') {
      return { apple_id: providerId };
    }

    return {};
  }

  generateToken(userId, role) {
    if (!process.env.JWT_SECRET) {
      const error = new Error('JWT secret not configured');
      error.statusCode = 500;
      throw error;
    }

    return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN
    });
  }

  createAuthResponse(user) {
    const token = this.generateToken(user.id, user.role || DEFAULT_ROLE);
    return {
      token,
      user: this.sanitizeUser(user)
    };
  }

  sanitizeUser(user) {
    const userJson = user.toJSON();
    delete userJson.password_hash;
    return userJson;
  }

  generateRandomPassword() {
    return crypto.randomBytes(32).toString('hex');
  }

  buildName(name, email) {
    if (name) {
      return name;
    }

    if (email) {
      return email.split('@')[0];
    }

    return 'User';
  }
}

module.exports = new AuthService();
