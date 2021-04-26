"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "a first name is required",
          },
          notEmpty: {
            msg: "please provide a first name",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "a last name is required",
          },
          notEmpty: {
            msg: "please provide a last name",
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "The email you entered already exists",
        },
        validate: {
          notNull: {
            msg: "an email address is required",
          },
          notEmpty: {
            msg: "please provide an email address name",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "a password name is required",
          },
          notEmpty: {
            msg: "please provide a passwprd name",
          },
          len: {
            args: [8, 20],
            msg: "The password should be between 8 and 20 characters in length",
          },
        },
      },
    },
    { sequelize }
  );

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userid",
        allowNull: false,
      },
    });
  };

  return User;
};
