const StudentRepository = require('../../domain/repositories/studentRepository');
const buildStudentEntity = require('../../domain/models/student.entity');

class StudentSequelizeRepository extends StudentRepository {
  constructor({ Student }) {
    super();
    this.Student = Student;
  }
  map(record) {
    return record ? buildStudentEntity(record.get({ plain: true })) : null;
  }
  async create(data) {
    return this.map(await this.Student.create(data));
  }
  async findAll(filters = {}) {
    const { Op } = require('sequelize');
    const where = {};
    const userWhere = {};

    if (filters.nombres) where.nombres = { [Op.like]: `%${filters.nombres}%` };
    if (filters.apellido_paterno) where.apellido_paterno = { [Op.like]: `%${filters.apellido_paterno}%` };
    if (filters.dni) where.dni = { [Op.like]: `%${filters.dni}%` };
    
    if (filters.search) {
      where[Op.or] = [
        { nombres: { [Op.like]: `%${filters.search}%` } },
        { apellido_paterno: { [Op.like]: `%${filters.search}%` } },
        { dni: { [Op.like]: `%${filters.search}%` } }
      ];
    }
    
    if (filters.email) {
      userWhere.email = { [Op.like]: `%${filters.email}%` };
    }

    const students = await this.Student.findAll({ 
      where, 
      order: [['id', 'DESC']],
      include: [{
        association: 'user',
        where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
        required: Object.keys(userWhere).length > 0
      }]
    });
    return students.map((s) => this.map(s));
  }
  async findById(id) {
    return this.map(await this.Student.findByPk(id));
  }
  async findByDni(dni) {
    return this.map(await this.Student.findOne({ where: { dni } }));
  }
  async update(id, data) {
    const student = await this.Student.findByPk(id);
    if (!student) return null;
    await student.update(data);
    return this.map(student);
  }
  async delete(id) {
    return (await this.Student.destroy({ where: { id } })) > 0;
  }
}
module.exports = StudentSequelizeRepository;
