const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const User = require('./User')(sequelize, Sequelize.DataTypes);
const Domain = require('./Domain')(sequelize, Sequelize.DataTypes);
const Scenario = require('./Scenario')(sequelize, Sequelize.DataTypes);
const UserProgress = require('./UserProgress')(sequelize, Sequelize.DataTypes);
const UserScenarioAttempt = require('./UserScenarioAttempt')(sequelize, Sequelize.DataTypes);

Domain.hasMany(Scenario, { foreignKey: 'domain_id', as: 'scenarios' });
Scenario.belongsTo(Domain, { foreignKey: 'domain_id', as: 'domain' });

User.belongsToMany(Scenario, {
  through: UserProgress,
  foreignKey: 'user_id',
  otherKey: 'scenario_id',
  as: 'progressScenarios'
});

Scenario.belongsToMany(User, {
  through: UserProgress,
  foreignKey: 'scenario_id',
  otherKey: 'user_id',
  as: 'progressUsers'
});

User.hasMany(UserProgress, { foreignKey: 'user_id', as: 'progressEntries' });
Scenario.hasMany(UserProgress, { foreignKey: 'scenario_id', as: 'userProgressEntries' });
UserProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserProgress.belongsTo(Scenario, { foreignKey: 'scenario_id', as: 'scenario' });

User.hasMany(UserScenarioAttempt, { foreignKey: 'user_id', as: 'scenarioAttempts' });
Scenario.hasMany(UserScenarioAttempt, { foreignKey: 'scenario_id', as: 'scenarioAttempts' });
UserScenarioAttempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserScenarioAttempt.belongsTo(Scenario, { foreignKey: 'scenario_id', as: 'scenario' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Domain,
  Scenario,
  UserProgress,
  UserScenarioAttempt
};
