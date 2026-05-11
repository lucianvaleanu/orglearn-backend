const { faker } = require('@faker-js/faker');
const userRepository = require('../../repositories/UserRepository');
const { Domain, Scenario, UserProgress } = require('../../models');

const createUser = () =>
  userRepository.create({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password_hash: faker.internet.password({ length: 16 }),
    current_rank: 'Junior'
  });

const createScenario = async () => {
  const domain = await Domain.create({
    title: faker.company.name(),
    description: faker.lorem.sentence()
  });

  return Scenario.create({
    domain_id: domain.id,
    title: faker.lorem.words(3),
    difficulty_level: 1,
    content_data: { summary: faker.lorem.sentence() }
  });
};

describe('UserRepository', () => {
  it('should create and find a user by email', async () => {
    const user = await createUser();

    const found = await userRepository.findByEmail(user.email);

    expect(found).not.toBeNull();
    expect(found.id).toBe(user.id);
  });

  it('should update a user by id', async () => {
    const user = await createUser();
    const updatedName = faker.person.fullName();

    const updated = await userRepository.updateById(user.id, { name: updatedName });

    expect(updated.name).toBe(updatedName);
  });

  it('should sum only completed scores for total score', async () => {
    const user = await createUser();
    const scenario = await createScenario();
    const scenarioTwo = await createScenario();

    await UserProgress.create({
      user_id: user.id,
      scenario_id: scenario.id,
      status: 'completed',
      score: 85,
      last_accessed_at: new Date()
    });

    await UserProgress.create({
      user_id: user.id,
      scenario_id: scenarioTwo.id,
      status: 'in_progress',
      score: 40,
      last_accessed_at: new Date()
    });

    const totalScore = await userRepository.getTotalScore(user.id);

    expect(Number(totalScore)).toBe(85);
  });
});
