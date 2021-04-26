"use strict";

const auth = require("basic-auth");
const bcrypt = require("bycrtpt");
const { User } = require("../models");
const { Op } = require("sequelize");

// Middleware to authenticate the request using Basic Auth.
exports.authenticateUser = async (req, res, next) => {
  let message;

  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({
      where: { emailAddress: credentials.emailAddress },
    });
    if (user) {
      const authenticated = bcrypt.compareSync(
        credentials.pass,
        user.confirmedPassword
      );
      if (authenticated) {
        console.log(
          `Authentication succesfule for user: ${credentials.emailAddress}`
        );

        req.currentUser = user;
      } else {
        message = `Authentication failure for user: ${credentials.emailAddress}`;
      }
    } else {
      message = `User not found for user: ${credentials.emailAddress}`;
    }
  } else {
    message = `Auth header not found`;
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  }

  next();
};
