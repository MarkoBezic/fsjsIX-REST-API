const express = require("express");
const Course = require("./models").Course;

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
  asynHandler(async (req, res) => {
    const courses = await Course.findAll();
    res.json(courses);
  })
);

/* GET cousrse along with the User that owns that course */
router.get(
  "/courses/:id",
  asynHandler((req, res) => {})
);

/* POST route that will create a new course */
router.post(
  "/courses",
  asynHandler((req, res) => {})
);

/* PUT Update course */
router.put(
  "/courses/:id",
  asynHandler((req, res) => {})
);

/* DELETE course*/
router.delete(
  "/courses/:id",
  asynHandler((req, res) => {})
);

module.exports = router;
