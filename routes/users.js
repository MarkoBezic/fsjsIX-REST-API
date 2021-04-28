const express = require("express");
const User = require("../models").User;
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");

// Construct a router instance
const router = express.Router();

// body parser
router.use(express.json());

/* GET current user */
router.get("/users", authenticateUser, (req, res) => {
  const user = req.currentUser;

  res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
  });
});

/* POST create new user */
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.location("/");
      res.status(201).end();
    } catch (error) {
      console.log("ERROR:", error.name);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
