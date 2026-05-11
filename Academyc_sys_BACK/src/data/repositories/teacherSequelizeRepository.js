const TeacherRepository = require('../../domain/repositories/teacherRepository');
const buildTeacherEntity = require('../../domain/models/teacher.entity');

class TeacherSequelizeRepository extends TeacherRepository {
  constructor({ Teacher }) {
    super();
    this.Teacher = Teacher;
  }
  map(record) {
    return record ? buildTeacherEntity(record.get({ plain: true })) : null;
  }
  async create(data) {
    return this.map(await this.Teacher.create(data));
  }
  async findAll(filters = {}) {
    const { Op } = require('sequelize');
    const where = {};
    const userWhere = {};

    if (filters.nombres) where.nombres = { [Op.like]: `%${filters.nombres}%` };
    if (filters.apellido_paterno) where.apellido_paterno = { [Op.like]: `%${filters.apellido_paterno}%` };
    if (filters.dni) where.dni = { [Op.like]: `%${filters.dni}%` };
    if (filters.cod_docente) where.cod_docente = { [Op.like]: `%${filters.cod_docente}%` };

    if (filters.search) {
      where[Op.or] = [
        { nombres: { [Op.like]: `%${filters.search}%` } },
        { apellido_paterno: { [Op.like]: `%${filters.search}%` } },
        { dni: { [Op.like]: `%${filters.search}%` } },
        { cod_docente: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    if (filters.email) {
      userWhere.email = { [Op.like]: `%${filters.email}%` };
    }

    const teachers = await this.Teacher.findAll({ 
      where, 
      order: [['id', 'DESC']],
      include: [{
        association: 'user',
        where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
        required: Object.keys(userWhere).length > 0
      }]
    });
    return teachers.map((s) => this.map(s));
  }
  async findById(id) {
    return this.map(await this.Teacher.findByPk(id));
  }

  async findByDni(dni) {
    return this.map(await this.Teacher.findOne({ where: { dni } }));
  }
  
  async findByCod_docente(cod_docente) {
    return this.map(await this.Teacher.findOne({ where: { cod_docente } }));
  }
  async update(id, data) {
    const teacher = await this.Teacher.findByPk(id);
    if (!teacher) return null;
    await teacher.update(data);
    return this.map(teacher);
  }
  async delete(id) {
    return (await this.Teacher.destroy({ where: { id } })) > 0;
  }
}
module.exports = TeacherSequelizeRepository;
