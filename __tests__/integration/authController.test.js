const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../../testApp');
const { sequelize, User } = require('../../models');
const { createToken } = require('../helpers/auth');

const signupPayload = {
  name: 'Test User',
  email: 'user@example.com',
  password: 'Passw0rd!'
};

describe('Auth Controller integration tests', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should sign up a new user and return 201', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send(signupPayload);

    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(signupPayload.email);
    expect(response.body.user.password_hash).toBeUndefined();
  });

  it('should reject duplicate email with 409', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send(signupPayload);

    const response = await request(app)
      .post('/api/auth/signup')
      .send(signupPayload);

    expect(response.status).toBe(409);
    expect(response.body.message).toBeDefined();
  });

  it('should login successfully and return token', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send(signupPayload);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: signupPayload.email,
        password: signupPayload.password
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(signupPayload.email);
  });

  it('should reject invalid credentials with 401', async () => {
    const passwordHash = await bcrypt.hash('OtherPass123!', 10);
    await User.create({
      name: 'Existing User',
      email: 'existing@example.com',
      password_hash: passwordHash,
      current_rank: 'Junior'
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'existing@example.com',
        password: 'WrongPassword!'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should return 401 when requesting /me without token', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
  });

  it('should return current user when token is provided', async () => {
    const user = await User.create({
      name: 'Token User',
      email: 'token@example.com',
      password_hash: await bcrypt.hash('Passw0rd!', 10),
      current_rank: 'Junior'
    });

    const token = createToken(user.id);

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(user.email);
  });
});
