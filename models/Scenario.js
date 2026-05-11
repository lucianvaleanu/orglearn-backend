module.exports = (sequelize, DataTypes) => {
  const Scenario = sequelize.define(
    'Scenario',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      domain_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(160),
        allowNull: false
      },
      difficulty_level: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
          min: 1,
          max: 3
        }
      },
      content_data: {
        type: DataTypes.JSON,
        allowNull: false
      }
    },
    {
      tableName: 'scenarios',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return Scenario;
};
