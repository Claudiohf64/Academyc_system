const models = require('../data/models');
const env = require('./env');
const StudentSequelizeRepository = require('../data/repositories/studentSequelizeRepository');
const DecolectaDniService = require('../data/services/decolectaDniService');
const UserSequelizeRepository = require('../data/repositories/userSequelizeRepository');
const StudentUseCases = require('../application/usecases/students.usecases');
const buildStudentController = require('../presentation/controllers/student.controller');
const buildTeacherController = require('../presentation/controllers/teacher.controller');
const TeacherSequelizeRepository = require('../data/repositories/teacherSequelizeRepository');
const TeacherUseCases = require('../application/usecases/teachers.usecases');
const AuthUseCases = require('../application/usecases/auth.usecases');
const buildAuthController = require('../presentation/controllers/auth.controller')
const buildUserController = require('../presentation/controllers/user.controller')

const userRepository = new UserSequelizeRepository(models);
const studentRepository = new StudentSequelizeRepository(models);
const dniLookupService = new DecolectaDniService(env.dniApi);
const studentUseCases = new StudentUseCases({ studentRepository, dniLookupService });

const teacherRepository = new TeacherSequelizeRepository(models);
const teacherUseCases = new TeacherUseCases({ teacherRepository, dniLookupService, userRepository, sequelize: models.sequelize });

const authUseCases = new AuthUseCases({
  userRepository,
  jwtConfig: env.jwt
});


const CareerSequelizeRepository = require('../data/repositories/careerSequelizeRepository');
const CareerUseCases = require('../application/usecases/careers.usecases');
const buildCareerController = require('../presentation/controllers/career.controller');

const CourseSequelizeRepository = require('../data/repositories/courseSequelizeRepository');
const CourseUseCases = require('../application/usecases/courses.usecases');
const buildCourseController = require('../presentation/controllers/course.controller');

const EnrollmentSequelizeRepository = require('../data/repositories/enrollmentSequelizeRepository');
const EnrollmentUseCases = require('../application/usecases/enrollments.usecases');
const buildEnrollmentController = require('../presentation/controllers/enrollment.controller');

const careerRepository = new CareerSequelizeRepository(models);
const careerUseCases = new CareerUseCases({ careerRepository });

const courseRepository = new CourseSequelizeRepository(models);
const courseUseCases = new CourseUseCases({ courseRepository });

const enrollmentRepository = new EnrollmentSequelizeRepository(models);
const enrollmentUseCases = new EnrollmentUseCases({ enrollmentRepository, userRepository, studentRepository, dniLookupService, sequelize: models.sequelize, jwtConfig: env.jwt });

module.exports = {
  controllers: {
    studentController: buildStudentController({ studentUseCases }),
    teacherController: buildTeacherController({ teacherUseCases }),
    authController: buildAuthController({authUseCases}),
    userController: buildUserController({authUseCases}),
    careerController: buildCareerController({ careerUseCases }),
    courseController: buildCourseController({ courseUseCases }),
    enrollmentController: buildEnrollmentController({ enrollmentUseCases })
  }
};