const CareerRepository = require('../../domain/repositories/careerRepository');
const buildCareerEntity = require('../../domain/models/career.entity');
const { Op } = require('sequelize');

class CareerSequelizeRepository extends CareerRepository {
  constructor(models) {
    super();
    this.models = models;
  }

  async findAll(filters = {}) {
    const where = {};
    if (filters.nombre) {
      where.nombre = { [Op.like]: `%${filters.nombre}%` };
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

    const careers = await this.models.Career.findAll({ where });
    return careers.map(buildCareerEntity);
  }

  async findById(id) {
    const career = await this.models.Career.findByPk(id);
    if (!career) return null;
    return buildCareerEntity(career);
  }

  async create(careerEntity) {
    const newCareer = await this.models.Career.create(careerEntity);
    return buildCareerEntity(newCareer);
  }

  async update(id, careerEntity) {
    await this.models.Career.update(careerEntity, { where: { id } });
    return this.findById(id);
  }

  async remove(id) {
    const career = await this.models.Career.findByPk(id);
    if (career) {
      await career.destroy();
      return true;
    }
    return false;
  }
}

module.exports = CareerSequelizeRepository;
