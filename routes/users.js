const express = require("express");
const User = require("../models").User;
const { asyncHandler } = require("../middleware/async-handler");

// Construct a router instance
const router = express.Router();

// body parser
router.use(express.json());

/* GET current user */
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json(users);
    res.status(200);
  })
);

/* POST create new user */
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.location("/");
      res.status(201).json({ message: "User successfully created!" });
    } catch (error) {
      console.log("ERROR:", error.name);

      if (
        error.name === "SequlizeValidationError" ||
        error.name === "SequelizeConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        restart.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
