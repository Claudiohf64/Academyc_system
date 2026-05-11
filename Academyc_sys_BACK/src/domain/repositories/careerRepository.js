class CareerRepository {
  async findAll(filters) { throw new Error('ERR_METHOD_NOT_IMPLEMENTED'); }
  async findById(id) { throw new Error('ERR_METHOD_NOT_IMPLEMENTED'); }
  async create(careerEntity) { throw new Error('ERR_METHOD_NOT_IMPLEMENTED'); }
  async update(id, careerEntity) { throw new Error('ERR_METHOD_NOT_IMPLEMENTED'); }
  async remove(id) { throw new Error('ERR_METHOD_NOT_IMPLEMENTED'); }
}

module.exports = CareerRepository;
