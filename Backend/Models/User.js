export default (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notNull: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notNull: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    profileImage: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
      values: [0, 1],
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
      values: [0, 1],
    },
    defaultProjectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: null,
    },
  });

  sequelize.models.users.hasMany(sequelize.models.userRoles, {
    foreignKey: "userId",
    constraints: false,
  });
  sequelize.models.roles.hasMany(sequelize.models.permissions, {
    foreignKey: "roleId",
    constraints: false,
  });

  sequelize.models.userRoles.hasMany(sequelize.models.permissions, {
    foreignKey: "roleId",
    constraints: false,
  });

  sequelize.models.userRoles.hasOne(sequelize.models.roles, {
    foreignKey: "id",
    sourceKey: "roleId",
    constraints: false,
  });

  sequelize.models.projects.hasOne(sequelize.models.users, {
    as: "createdBy",
    sourceKey: "createdByUser",
    foreignKey: "id",
    constraints: false,
  });
  sequelize.models.objects.hasOne(sequelize.models.users, {
    as: "createdBy",
    sourceKey: "createdByUser",
    foreignKey: "id",
    constraints: false,
  });
  sequelize.models.executionHistory.hasOne(sequelize.models.users, {
    as: "executedBy",
    sourceKey: "executedByUser",
    foreignKey: "id",
    constraints: false,
  });

  sequelize.models.objects.hasMany(sequelize.models.objectLocators, {
    foreignKey: "objectId",
    as: "locators",
    constraints: false,
  });

  sequelize.models.projects.hasMany(sequelize.models.userProjects, {
    foreignKey: "projectId",
    as: "members",
    constraints: false,
  });
  sequelize.models.userProjects.hasOne(sequelize.models.projects, {
    foreignKey: "id",
    sourceKey: "projectId",
    constraints: false,
  });
  sequelize.models.userProjects.hasOne(sequelize.models.users, {
    foreignKey: "id",
    sourceKey: "userId",
    constraints: false,
  });
  sequelize.models.testCases.hasOne(sequelize.models.users, {
    as: "createdBy",
    sourceKey: "createdByUser",
    foreignKey: "id",
    constraints: false,
  });

  sequelize.models.reusableProcesses.hasOne(sequelize.models.users, {
    as: "createdBy",
    sourceKey: "createdByUser",
    foreignKey: "id",
    constraints: false,
  });

  sequelize.models.testCases.hasMany(sequelize.models.processes, {
    sourceKey: "id",
    foreignKey: "testCaseId",
    constraints: false,
  });

  sequelize.models.reusableProcesses.hasMany(sequelize.models.testSteps, {
    sourceKey: "id",
    foreignKey: "reusableProcessId",
    constraints: false,
  });

  sequelize.models.processes.hasMany(sequelize.models.testSteps, {
    sourceKey: "id",
    foreignKey: "processId",
    constraints: false,
  });

  sequelize.models.processes.hasOne(sequelize.models.reusableProcesses, {
    sourceKey: "reusableProcessId",
    foreignKey: "id",
    constraints: false,
  });

  sequelize.models.testSteps.hasMany(sequelize.models.testParameters, {
    sourceKey: "id",
    foreignKey: "testStepId",
    constraints: false,
  });

  sequelize.models.testSteps.hasOne(sequelize.models.objects, {
    sourceKey: "objectId",
    foreignKey: "id",
    constraints: false,
  });
  sequelize.models.executionHistory.hasMany(sequelize.models.processHistories, {
    as: "process",
    sourceKey: "id",
    foreignKey: "executionHistoryId",
    constraints: false,
  });

  sequelize.models.processHistories.hasMany(
    sequelize.models.testStepHistories,
    {
      as: "testSteps",
      sourceKey: "processId",
      foreignKey: "processId",
      constraints: false,
    }
  );
  sequelize.models.environments.hasMany(sequelize.models.columns, {
    sourceKey: "id",
    foreignKey: "envId",
    constraints: false,
  });
  return User;
};
