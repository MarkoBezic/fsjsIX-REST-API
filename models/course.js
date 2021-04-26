"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {}

  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A title is required",
          },
          notEmpty: {
            msg: "Please provide a title",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A description is required",
          },
          notEmpty: {
            msg: "Please provide a description",
          },
        },
      },
      estimatedTime: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Estimated time is required",
          },
          notEmpty: {
            msg: "Please provide an estimated time",
          },
        },
      },
      materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: '"Materials needed" are required',
          },
          notEmpty: {
            msg: "Please provide marterials needed",
          },
        },
      },
    },
    { sequelize }
  );

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: "userid",
        allowNull: false,
      },
    });
  };

  return Course;
};
