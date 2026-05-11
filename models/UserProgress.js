const USER_PROGRESS_STATUSES = ['not_started', 'in_progress', 'completed'];

module.exports = (sequelize, DataTypes) => {
  const UserProgress = sequelize.define(
    'UserProgress',
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
      status: {
        type: DataTypes.ENUM(...USER_PROGRESS_STATUSES),
        allowNull: false,
        defaultValue: 'not_started'
      },
      score: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
        validate: {
          min: 0,
          max: 100
        }
      },
      last_accessed_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'user_progress',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return UserProgress;
};
