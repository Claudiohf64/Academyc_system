const buildCareerEntity = require('../../domain/models/career.entity');
const AppError = require('../../shared/utils/appError');

class CareerUseCases {
  constructor({ careerRepository }) {
    this.careerRepository = careerRepository;
  }

  async findAll(filters) {
    return await this.careerRepository.findAll(filters);
  }

  async findById(id) {
    const career = await this.careerRepository.findById(id);
    if (!career) throw new AppError('Carrera no encontrada', 404);
    return career;
  }

  async create(data) {
    const careerEntity = buildCareerEntity(data);
    return await this.careerRepository.create(careerEntity);
  }

  async update(id, data) {
    const existing = await this.findById(id);
    const updatedEntity = buildCareerEntity({ ...existing, ...data });
    return await this.careerRepository.update(id, updatedEntity);
  }

  async remove(id) {
    await this.findById(id);
    await this.careerRepository.remove(id);
    return { message: 'Carrera eliminada correctamente' };
  }
}

module.exports = CareerUseCases;
