const express = require("express");
const Course = require("../models").Course;
const { asyncHandler } = require("../middleware/async-handler");

// Construct a router instance
const router = express.Router();

function asynHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

/* GET list of all courses including the User that owns that course */
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    res.json(courses);
  })
);

/* GET cousrse along with the User that owns that course */
router.get(
  "/courses/:id",
  asyncHandler((req, res) => {})
);

/* POST route that will create a new course */
router.post(
  "/courses",
  asynHandler((req, res) => {})
);

/* PUT Update course */
router.put(
  "/courses/:id",
  asyncHandler((req, res) => {})
);

/* DELETE course*/
router.delete(
  "/courses/:id",
  asyncHandler((req, res) => {})
);

module.exports = router;
