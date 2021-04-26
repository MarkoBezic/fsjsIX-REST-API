const express = require("express");
const Course = require("../models").Course;
const { asyncHandler } = require("../middleware/async-handler");
const auh;

// Construct a router instance
const router = express.Router();

// body parser
router.use(express.json());

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
    res.status(200);
  })
);

/* GET cousrse along with the User that owns that course */
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.json(course);
    res.status(200);
  })
);

/* POST route that will create a new course */
router.post(
  "/courses",
  authenticateUser,
  asynHandler(async (req, res) => {
    try {
      await Course.create(req.body);
      //@marko todo, confirm changing the URI
      res.location("/api/courses");
      res.status(201).json({ message: "Course successfully created!" });
    } catch (error) {
      console.log("ERROR:", error.name);

      if (
        error.name === "SequlizeValidationError" ||
        error.name === "SequelizeConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

/* PUT Update course */
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      course.update(req.body);
      res.status(204);
    } catch (error) {
      console.log("ERROR:", error.name);
      if (
        error.name === "SequlizeValidationError" ||
        error.name === "SequelizeConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

/* DELETE course*/
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    course.destroy();
    res.status(204);
  })
);

module.exports = router;
