const { faker } = require('@faker-js/faker');
const domainRepository = require('../../repositories/DomainRepository');
const { Domain, Scenario, User, UserProgress } = require('../../models');

const createUser = () =>
  User.create({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password_hash: faker.internet.password({ length: 16 }),
    current_rank: 'Junior'
  });

describe('DomainRepository', () => {
  it('should include scenarios and progress entries for a user', async () => {
    const user = await createUser();
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

    await UserProgress.create({
      user_id: user.id,
      scenario_id: scenario.id,
      status: 'completed',
      score: 90,
      last_accessed_at: new Date()
    });

    const domains = await domainRepository.getAllWithProgress(user.id);

    expect(domains).toHaveLength(1);
    expect(domains[0].scenarios).toHaveLength(1);
    expect(domains[0].scenarios[0].userProgressEntries).toHaveLength(1);
  });

  it('should return 1/2 domains mastered when only one domain is fully completed', async () => {
    const user = await createUser();

    const domainA = await Domain.create({
      title: 'Communication',
      description: faker.lorem.sentence()
    });
    const domainB = await Domain.create({
      title: 'Leadership',
      description: faker.lorem.sentence()
    });

    const scenarioA1 = await Scenario.create({
      domain_id: domainA.id,
      title: 'A1',
      difficulty_level: 1,
      content_data: { summary: faker.lorem.sentence() }
    });
    const scenarioA2 = await Scenario.create({
      domain_id: domainA.id,
      title: 'A2',
      difficulty_level: 2,
      content_data: { summary: faker.lorem.sentence() }
    });
    const scenarioB1 = await Scenario.create({
      domain_id: domainB.id,
      title: 'B1',
      difficulty_level: 1,
      content_data: { summary: faker.lorem.sentence() }
    });
    const scenarioB2 = await Scenario.create({
      domain_id: domainB.id,
      title: 'B2',
      difficulty_level: 3,
      content_data: { summary: faker.lorem.sentence() }
    });

    await UserProgress.bulkCreate([
      {
        user_id: user.id,
        scenario_id: scenarioA1.id,
        status: 'completed',
        score: 80,
        last_accessed_at: new Date()
      },
      {
        user_id: user.id,
        scenario_id: scenarioA2.id,
        status: 'completed',
        score: 92,
        last_accessed_at: new Date()
      },
      {
        user_id: user.id,
        scenario_id: scenarioB1.id,
        status: 'completed',
        score: 70,
        last_accessed_at: new Date()
      },
      {
        user_id: user.id,
        scenario_id: scenarioB2.id,
        status: 'in_progress',
        score: null,
        last_accessed_at: new Date()
      }
    ]);

    const domains = await domainRepository.getAllWithProgress(user.id);

    const masteredCount = domains.reduce((count, domain) => {
      const completed = domain.scenarios.filter((scenario) => {
        const entry = scenario.userProgressEntries[0];
        return entry && entry.status === 'completed';
      }).length;
      if (completed === domain.scenarios.length) {
        return count + 1;
      }
      return count;
    }, 0);

    const label = `${masteredCount}/${domains.length} Domains Mastered`;

    expect(label).toBe('1/2 Domains Mastered');
  });
});
