const UserRepository = require ('../../domain/repositories/userRepository');
const buildUserEntity = require('../../domain/models/user.entity');

class UserSequelizeRepository extends UserRepository{
    constructor({ User }){
        super();
        this.User = User;
    }
    map(record){
        return record ? buildUserEntity(record.get({plain: true})) : null;
    }
    async create(data){
        return this.map(await this.User.create(data));
    }

    async findAll(filters = {}){
        const { Op } = require('sequelize');
        const where = {};
        if (filters.nombres) where.nombres = { [Op.like]: `%${filters.nombres}%` };
        if (filters.email) where.email = { [Op.like]: `%${filters.email}%` };
        if (filters.role) where.role = filters.role;
        if (filters.activo !== undefined) where.activo = filters.activo === 'true' || filters.activo === true;

        const users = await this.User.findAll({ where, order: [['id', 'DESC']]});
        return users.map((user) => this.map(user));
    }

    async findById(id){
        return this.map(await this.User.findByPk(id));
    }

    async findByEmail(email){
        return this.map(await this.User.findOne({ where: { email } }));
    }

    async update(id, data){
        const user = await this.User.findByPk(id);
        if(!user) return null;
        await user.update(data);
        return this.map(user);
    }

    async delete(id){
        return (await this.User.destroy({where: {id}}))>0;
    }
}

module.exports = UserSequelizeRepository;