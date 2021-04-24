"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.innit(
    {
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      emailAddress: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
    },
    { sequelize }
  );

  Users.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userid",
        allowNull: false,
      },
    });
  };

  return User;
};
