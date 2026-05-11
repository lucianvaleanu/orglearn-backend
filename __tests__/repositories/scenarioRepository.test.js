const { faker } = require('@faker-js/faker');
const scenarioRepository = require('../../repositories/ScenarioRepository');
const { Domain, Scenario, User, UserProgress } = require('../../models');

const createUser = () =>
  User.create({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password_hash: faker.internet.password({ length: 16 }),
    current_rank: 'Junior'
  });

describe('ScenarioRepository', () => {
  it('should include domain and progress entries in scenario selection', async () => {
    const user = await createUser();
    const domain = await Domain.create({
      title: 'Communication',
      description: faker.lorem.sentence()
    });

    const scenario = await Scenario.create({
      domain_id: domain.id,
      title: 'Active Listening',
      difficulty_level: 1,
      content_data: { summary: faker.lorem.sentence() }
    });

    await UserProgress.create({
      user_id: user.id,
      scenario_id: scenario.id,
      status: 'completed',
      score: 95,
      last_accessed_at: new Date()
    });

    const scenarios = await scenarioRepository.getScenarioSelectionForUser(user.id);

    expect(scenarios).toHaveLength(1);
    expect(scenarios[0].domain.title).toBe('Communication');
    expect(scenarios[0].userProgressEntries[0].status).toBe('completed');
  });

  it('should return the most recently accessed in-progress scenario', async () => {
    const user = await createUser();
    const domain = await Domain.create({
      title: 'Leadership',
      description: faker.lorem.sentence()
    });

    const scenarioOne = await Scenario.create({
      domain_id: domain.id,
      title: 'Scenario One',
      difficulty_level: 1,
      content_data: { summary: faker.lorem.sentence() }
    });

    const scenarioTwo = await Scenario.create({
      domain_id: domain.id,
      title: 'Scenario Two',
      difficulty_level: 2,
      content_data: { summary: faker.lorem.sentence() }
    });

    await UserProgress.create({
      user_id: user.id,
      scenario_id: scenarioOne.id,
      status: 'in_progress',
      last_accessed_at: new Date('2024-01-01T10:00:00Z')
    });

    await UserProgress.create({
      user_id: user.id,
      scenario_id: scenarioTwo.id,
      status: 'in_progress',
      last_accessed_at: new Date('2024-02-01T10:00:00Z')
    });

    const progress = await scenarioRepository.getFirstInProgressScenario(user.id);

    expect(progress).not.toBeNull();
    expect(progress.scenario.id).toBe(scenarioTwo.id);
  });

  it('should return the next not-started scenario in a domain', async () => {
    const user = await createUser();
    const domain = await Domain.create({
      title: 'Productivity',
      description: faker.lorem.sentence()
    });

    const scenarioA = await Scenario.create({
      domain_id: domain.id,
      title: 'Alpha',
      difficulty_level: 1,
      content_data: { summary: faker.lorem.sentence() }
    });

    const scenarioB = await Scenario.create({
      domain_id: domain.id,
      title: 'Beta',
      difficulty_level: 2,
      content_data: { summary: faker.lorem.sentence() }
    });

    await UserProgress.create({
      user_id: user.id,
      scenario_id: scenarioA.id,
      status: 'completed',
      score: 88,
      last_accessed_at: new Date()
    });

    const nextScenario = await scenarioRepository.getNextNotStartedScenarioInDomain(
      user.id,
      domain.id
    );

    expect(nextScenario.id).toBe(scenarioB.id);
  });
});
