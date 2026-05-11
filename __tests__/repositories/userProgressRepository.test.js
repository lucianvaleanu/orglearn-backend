const { faker } = require('@faker-js/faker');
const userProgressRepository = require('../../repositories/UserProgressRepository');
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

describe('UserProgressRepository', () => {
  it('should create and find progress by id', async () => {
    const { user, scenario } = await createUserAndScenario();

    const progress = await userProgressRepository.create({
      user_id: user.id,
      scenario_id: scenario.id,
      status: 'in_progress',
      last_accessed_at: new Date()
    });

    const found = await userProgressRepository.findById(progress.id);

    expect(found).not.toBeNull();
    expect(found.status).toBe('in_progress');
  });

  it('should update progress status by id', async () => {
    const { user, scenario } = await createUserAndScenario();

    const progress = await userProgressRepository.create({
      user_id: user.id,
      scenario_id: scenario.id,
      status: 'not_started',
      last_accessed_at: new Date()
    });

    const updated = await userProgressRepository.updateById(progress.id, {
      status: 'completed',
      score: 91
    });

    expect(updated.status).toBe('completed');
    expect(updated.score).toBe(91);
  });

  it('should delete progress by id and return an empty list', async () => {
    const { user, scenario } = await createUserAndScenario();

    const progress = await userProgressRepository.create({
      user_id: user.id,
      scenario_id: scenario.id,
      status: 'completed',
      score: 77,
      last_accessed_at: new Date()
    });

    await userProgressRepository.deleteById(progress.id);

    const list = await userProgressRepository.listByUser(user.id);

    expect(list).toHaveLength(0);
  });
});
