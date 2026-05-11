const ATTEMPT_STATUSES = ['in_progress', 'completed', 'abandoned'];

module.exports = (sequelize, DataTypes) => {
  const UserScenarioAttempt = sequelize.define(
    'UserScenarioAttempt',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      scenario_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      attempt_number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(...ATTEMPT_STATUSES),
        allowNull: false,
        defaultValue: 'in_progress'
      },
      score: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        validate: {
          min: 0,
          max: 100
        }
      },
      started_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'user_scenario_attempts',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return UserScenarioAttempt;
};
