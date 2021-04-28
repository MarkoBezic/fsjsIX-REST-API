const express = require("express");
const Course = require("../models").Course;
const User = require("../models").User;
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
    const courses = await Course.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.status(200).json(courses);
  })
);

/* GET course along with the User that owns that course */
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.status(200).json(course);
  })
);

/* POST route creates a new course */
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const newCourse = await Course.create(req.body);
      res.location("/api/courses/" + newCourse.id);
      res.status(201).end();
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
    const requestedCourse = await Course.findByPk(req.params.id);
    const courseOwnerId = requestedCourse.userId;
    try {
      if (user.id === courseOwnerId) {
        const course = req.body;
        await Course.update(course, { where: { id: req.params.id } });
        res.status(204).end();
      } else {
        res.status(403).json({
          message:
            "Current authenticated user must be owner of the courses being updated",
        });
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
      res.status(403).json({
        message:
          "Current authenticated user must be the owner of the course to be able to delete it",
      });
    }
  })
);

module.exports = router;
