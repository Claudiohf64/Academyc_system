const EnrollmentRepository = require('../../domain/repositories/enrollmentRepository');
const buildEnrollmentEntity = require('../../domain/models/enrollment.entity');
const { Op } = require('sequelize');

class EnrollmentSequelizeRepository extends EnrollmentRepository {
  constructor(models) {
    super();
    this.models = models;
  }

  async findAll(filters = {}) {
    const where = {};
    const studentWhere = {};
    const careerWhere = {};

    if (filters.student_id) where.student_id = filters.student_id;
    if (filters.career_id) where.career_id = filters.career_id;
    if (filters.estado) where.estado = filters.estado;

    if (filters.student_name) {
      studentWhere.nombres = { [Op.like]: `%${filters.student_name}%` };
    }
    if (filters.student_dni) {
      studentWhere.dni = filters.student_dni;
    }
    if (filters.career_name) {
      careerWhere.nombre = { [Op.like]: `%${filters.career_name}%` };
    }

    if (filters.search) {
      where[Op.or] = [
        { '$student.nombres$': { [Op.like]: `%${filters.search}%` } },
        { '$student.dni$': { [Op.like]: `%${filters.search}%` } },
        { '$career.nombre$': { [Op.like]: `%${filters.search}%` } }
      ];
    }

    const enrollments = await this.models.Enrollment.findAll({ 
      where,
      include: [
        { 
          model: this.models.Student, 
          as: 'student', 
          attributes: ['id', 'nombres', 'apellido_paterno', 'apellido_materno', 'dni'],
          include: [{ model: this.models.User, as: 'user', attributes: ['id', 'email', 'activo'] }],
          where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
          required: Object.keys(studentWhere).length > 0 || (filters.search !== undefined)
        },
        { 
          model: this.models.Career, 
          as: 'career', 
          attributes: ['id', 'nombre', 'duracion_meses'],
          where: Object.keys(careerWhere).length > 0 ? careerWhere : undefined,
          required: Object.keys(careerWhere).length > 0 || (filters.search !== undefined)
        }
      ]
    });
    return enrollments.map(e => {
      const entity = buildEnrollmentEntity(e);
      entity.student = e.student;
      entity.career = e.career;
      return entity;
    });
  }

  async findById(id) {
    const enrollment = await this.models.Enrollment.findByPk(id, {
      include: [
        { 
          model: this.models.Student, 
          as: 'student', 
          attributes: ['id', 'nombres', 'apellido_paterno', 'apellido_materno', 'dni'],
          include: [{ model: this.models.User, as: 'user', attributes: ['id', 'email', 'activo'] }]
        },
        { model: this.models.Career, as: 'career', attributes: ['id', 'nombre', 'duracion_meses'] }
      ]
    });
    if (!enrollment) return null;
    const entity = buildEnrollmentEntity(enrollment);
    entity.student = enrollment.student;
    entity.career = enrollment.career;
    return entity;
  }

  async create(enrollmentEntity, transaction) {
    const newEnrollment = await this.models.Enrollment.create(enrollmentEntity, { transaction });
    return buildEnrollmentEntity(newEnrollment);
  }

  async update(id, enrollmentEntity) {
    await this.models.Enrollment.update(enrollmentEntity, { where: { id } });
    return this.findById(id);
  }

  async remove(id) {
    const enrollment = await this.models.Enrollment.findByPk(id);
    if (enrollment) {
      await enrollment.destroy();
      return true;
    }
    return false;
  }
}

module.exports = EnrollmentSequelizeRepository;
