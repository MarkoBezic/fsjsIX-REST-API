const express = require("express");
const Course = require("../models").Course;
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");

// Construct a router instance
const router = express.Router();

// body parser
router.use(express.json());

/* GET list of all courses including the User that owns that course */
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    res.json(
      courses.map((course) => {
        return {
          title: course.title,
          description: course.description,
          estimatedTime: course.estimatedTime,
          materialsNeeded: course.materialsNeeded,
          userId: course.userId,
        };
      })
    );
    res.status(200);
  })
);

/* GET cousrse along with the User that owns that course */
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.json({
      title: course.title,
      description: course.description,
      estimatedTime: course.estimatedTime,
      materialsNeeded: course.materialsNeeded,
      userId: course.userId,
    });
    res.status(200);
  })
);

/* POST route that will create a new course */
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      await Course.create(req.body);
      res.location("/api/courses");
      res.status(201).json({ message: "Course successfully created!" });
    } catch (error) {
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

/* PUT Update course */
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    try {
      if (user.id === req.body.userId) {
        const course = req.body;
        await Course.update(course, { where: { id: req.params.id } });
        res.status(204).end();
      } else {
        res.status(403).end();
      }
    } catch (error) {
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

/* DELETE course*/
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if (user.id === course.userId) {
      course.destroy();
      res.status(204).end();
    } else {
      res.status(403).end();
    }
  })
);

module.exports = router;
