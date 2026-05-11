const request = require('supertest');
const app = require('../../testApp');
const { sequelize, User, Domain, Scenario, UserProgress } = require('../../models');
const { createToken } = require('../helpers/auth');

const seedScenarioData = async () => {
  const user = await User.create({
    name: 'Scenario User',
    email: 'scenario@example.com',
    password_hash: 'hashed',
    current_rank: 'Junior'
  });

  const domain = await Domain.create({
    title: 'Communication',
    description: 'Effective communication'
  });

  const scenario = await Scenario.create({
    domain_id: domain.id,
    title: 'Active Listening',
    difficulty_level: 1,
    content_data: { summary: 'Summary' }
  });

  await UserProgress.create({
    user_id: user.id,
    scenario_id: scenario.id,
    status: 'completed',
    score: 90,
    last_accessed_at: new Date()
  });

  return { user, scenario };
};

describe('Scenario Controller integration tests', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should return scenario selection with joined domain and progress data', async () => {
    const { user } = await seedScenarioData();

    const responseWithoutToken = await request(app)
      .get(`/api/scenarios/selection/${user.id}`);

    expect(responseWithoutToken.status).toBe(401);

    const token = createToken(user.id);

    const response = await request(app)
      .get(`/api/scenarios/selection/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].domainTitle).toBe('Communication');
    expect(response.body.data[0].status).toBe('completed');
  });
});
