module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      google_id: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      apple_id: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      current_rank: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: 'Junior'
      },
      overall_progress_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0
      }
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return User;
};
