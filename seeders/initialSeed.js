const { randomUUID } = require('crypto');
const { sequelize, Domain, Scenario } = require('../models');

const domains = [
  {
    id: randomUUID(),
    title: 'Communication',
    description: 'Effective communication in professional settings.'
  },
  {
    id: randomUUID(),
    title: 'Leadership',
    description: 'Leading teams and managing conflict.'
  }
];

const scenarios = [
  {
    id: randomUUID(),
    domainTitle: 'Communication',
    title: 'The Heated Stakeholder',
    difficulty_level: 1,
    content_data: {
      summary: 'Handle a tense stakeholder discussion calmly.'
    }
  },
  {
    id: randomUUID(),
    domainTitle: 'Leadership',
    title: 'Team Misalignment',
    difficulty_level: 2,
    content_data: {
      summary: 'Align a cross-functional team on priorities.'
    }
  }
];

const runSeed = async () => {
  await sequelize.authenticate();

  const transaction = await sequelize.transaction();
  try {
    await Domain.bulkCreate(domains, { transaction });

    const domainMap = domains.reduce((acc, domain) => {
      acc[domain.title] = domain.id;
      return acc;
    }, {});

    const scenarioRows = scenarios.map((scenario) => ({
      id: scenario.id,
      domain_id: domainMap[scenario.domainTitle],
      title: scenario.title,
      difficulty_level: scenario.difficulty_level,
      content_data: scenario.content_data
    }));

    await Scenario.bulkCreate(scenarioRows, { transaction });

    await transaction.commit();
    console.log('Seed completed successfully.');
  } catch (error) {
    await transaction.rollback();
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

runSeed();
