const express = require('express');
const buildStudentRoutes = require('./student.routes');
const buildTeacherRoutes = require('./teacher.routes');
const buildAuthRouters = require('./auth.routes');
const buildCareerRoutes = require('./career.routes');
const buildCourseRoutes = require('./course.routes');
const buildEnrollmentRoutes = require('./enrollment.routes');
const buildUserRoutes = require('./user.routes');

module.exports = ({ controllers }) => {
  const router = express.Router();

  router.use('/auth', buildAuthRouters(controllers));
  router.use('/careers', buildCareerRoutes(controllers));
  router.use('/courses', buildCourseRoutes(controllers));
  router.use('/enrollments', buildEnrollmentRoutes(controllers));
  router.use('/students', buildStudentRoutes(controllers));
  router.use('/teachers', buildTeacherRoutes(controllers));
  router.use('/users', buildUserRoutes(controllers));
  return router;
};