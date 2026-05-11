const CourseRepository = require('../../domain/repositories/courseRepository');
const buildCourseEntity = require('../../domain/models/course.entity');
const { Op } = require('sequelize');

class CourseSequelizeRepository extends CourseRepository {
  constructor(models) {
    super();
    this.models = models;
  }

  async findAll(filters = {}) {
    const where = {};
    if (filters.nombre) {
      where.nombre = { [Op.like]: `%${filters.nombre}%` };
    }
    if (filters.career_id) {
      where.career_id = filters.career_id;
    }
    if (filters.activo !== undefined) {
      where.activo = filters.activo === 'true' || filters.activo === true;
    }
    if (filters.search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${filters.search}%` } },
        { descripcion: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    const courses = await this.models.Course.findAll({ 
      where,
      include: [{ model: this.models.Career, as: 'career', attributes: ['id', 'nombre', 'duracion_meses'] }]
    });
    return courses.map(c => {
      const entity = buildCourseEntity(c);
      entity.career = c.career;
      return entity;
    });
  }

  async findById(id) {
    const course = await this.models.Course.findByPk(id, {
      include: [{ model: this.models.Career, as: 'career', attributes: ['id', 'nombre', 'duracion_meses'] }]
    });
    if (!course) return null;
    const entity = buildCourseEntity(course);
    entity.career = course.career;
    return entity;
  }

  async create(courseEntity) {
    const newCourse = await this.models.Course.create(courseEntity);
    return this.findById(newCourse.id);
  }

  async update(id, courseEntity) {
    await this.models.Course.update(courseEntity, { where: { id } });
    return this.findById(id);
  }

  async remove(id) {
    const course = await this.models.Course.findByPk(id);
    if (course) {
      await course.destroy();
      return true;
    }
    return false;
  }
}

module.exports = CourseSequelizeRepository;
