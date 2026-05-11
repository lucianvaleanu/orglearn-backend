const { faker } = require('@faker-js/faker');
const attemptRepository = require('../../repositories/AttemptRepository');
const { Domain, Scenario, User } = require('../../models');

const createUserAndScenario = async () => {
  const user = await User.create({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password_hash: faker.internet.password({ length: 16 }),
    current_rank: 'Junior'
  });

  const domain = await Domain.create({
    title: faker.company.name(),
    description: faker.lorem.sentence()
  });

  const scenario = await Scenario.create({
    domain_id: domain.id,
    title: faker.lorem.words(2),
    difficulty_level: 2,
    content_data: { summary: faker.lorem.sentence() }
  });

  return { user, scenario };
};

describe('AttemptRepository', () => {
  it('should create and update an attempt', async () => {
    const { user, scenario } = await createUserAndScenario();

    const attempt = await attemptRepository.createAttempt(
      user.id,
      scenario.id,
      1,
      null
    );

    const updated = await attemptRepository.updateAttempt(
      attempt.id,
      { status: 'completed', score: 90, completed_at: new Date() },
      null
    );

    expect(updated.status).toBe('completed');
    expect(updated.score).toBe(90);
  });

  it('should return latest attempt number for a user and scenario', async () => {
    const { user, scenario } = await createUserAndScenario();

    await attemptRepository.createAttempt(user.id, scenario.id, 1, null);
    await attemptRepository.createAttempt(user.id, scenario.id, 2, null);

    const latest = await attemptRepository.getLatestAttemptNumber(
      user.id,
      scenario.id,
      null
    );

    expect(latest).toBe(2);
  });
});
