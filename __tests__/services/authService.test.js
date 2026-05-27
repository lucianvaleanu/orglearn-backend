const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../../repositories/UserRepository');
const authService = require('../../services/auth.service');

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

jest.mock('../../repositories/UserRepository', () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  updateById: jest.fn(),
  findByGoogleId: jest.fn(),
  findByAppleId: jest.fn()
}));

describe('AuthService', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    jest.clearAllMocks();
  });

  it('should hash the password and create a user on signup', async () => {
    const payload = { name: 'Test User', email: 'user@example.com', password: 'Passw0rd!' };
    const userRecord = {
      toJSON: () => ({
        id: 'user-1',
        name: payload.name,
        email: payload.email,
        password_hash: 'hashed',
        current_rank: 'Junior'
      })
    };

    userRepository.findByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed');
    userRepository.create.mockResolvedValue(userRecord);

    const result = await authService.signup(payload);

    expect(bcrypt.hash).toHaveBeenCalledWith(payload.password, 10);
    expect(userRepository.create).toHaveBeenCalledWith({
      name: payload.name,
      email: payload.email,
      password_hash: 'hashed',
      role: 'user',
      current_rank: 'Junior'
    });
    expect(result.password_hash).toBeUndefined();
    expect(result.email).toBe(payload.email);
  });

  it('should generate a JWT token using the configured secret', () => {
    jwt.sign.mockReturnValue('jwt-token');

    const token = authService.generateToken('user-123', 'admin');

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 'user-123', role: 'admin' },
      'test-secret',
      { expiresIn: '24h' }
    );
    expect(token).toBe('jwt-token');
  });

  it('should reject login when the user is missing', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(authService.login({ email: 'missing@example.com', password: 'Passw0rd!' }))
      .rejects.toHaveProperty('statusCode', 401);
  });
});
