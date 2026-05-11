const buildCourseEntity = require('../../domain/models/course.entity');
const AppError = require('../../shared/utils/appError');

class CourseUseCases {
  constructor({ courseRepository }) {
    this.courseRepository = courseRepository;
  }

  async findAll(filters) {
    return await this.courseRepository.findAll(filters);
  }

  async findById(id) {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new AppError('Curso no encontrado', 404);
    return course;
  }

  async create(data) {
    const courseEntity = buildCourseEntity(data);
    return await this.courseRepository.create(courseEntity);
  }

  async update(id, data) {
    const existing = await this.findById(id);
    const updatedEntity = buildCourseEntity({ ...existing, ...data });
    return await this.courseRepository.update(id, updatedEntity);
  }

  async remove(id) {
    await this.findById(id);
    await this.courseRepository.remove(id);
    return { message: 'Curso eliminado correctamente' };
  }
}

module.exports = CourseUseCases;
