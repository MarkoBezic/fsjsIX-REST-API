const express = require("express");
const User = require("../models").User;
const { asyncHandler } = require("../middleware/async-handler");

// Construct a router instance
const router = express.Router();

/* GET current user */
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json(users);
  })
);

/* POST create new user */
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    await User.create(req.body);
  })
);

module.exports = router;
