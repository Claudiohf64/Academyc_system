const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../../shared/utils/appError');
const buildUserEntity = require('../../domain/models/user.entity');

class AuthUseCases {
    constructor({ userRepository, jwtConfig }) {
        this.userRepository = userRepository;
        this.jwtConfig = jwtConfig;
    }

    sanitizeUser(user) {
        if (!user) return null;
        const safeUser = { ...user };
        delete safeUser.password;
        return safeUser;
    }

    async register(payload) {
        const existingUser = await this.userRepository.findByEmail(payload.email);

        if (existingUser) {
            throw new AppError('Ya existe un usuario con ese email', 409, 'USER_EMAIL_ALREADY_EXISTS');
        }

        const hashedPassword = await bcrypt.hash(payload.password, 10);

        const user = await this.userRepository.create(buildUserEntity({
            nombres: payload.nombres,
            email: payload.email,
            password: hashedPassword,
            role: 'user',
            activo: true
        }));

        return this.sanitizeUser(user);
    }

    async login(payload) {
        const user = await this.userRepository.findByEmail(payload.email);

        if (!user || !user.activo) {
            throw new AppError('Credenciales invalidas', 401, 'INVALID_CREDENTIALS');
        }

        const validPassword = await bcrypt.compare(payload.password, user.password);

        if (!validPassword) {
            throw new AppError('Credenciales invalidas', 401, 'INVALID_CREDENTIALS');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            this.jwtConfig.secret,
            { expiresIn: this.jwtConfig.expiresIn }
        );

        return {
            user: this.sanitizeUser(user),
            token
        };
    }

    async getAuthenticatedUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user || !user.activo) {
            throw new AppError('Usuario autenticado no disponible', 401, 'AUTH_USER_NOT_AVAILABLE');
        }
        return this.sanitizeUser(user);
    }

    async createUser(payload) {
        const existingUser = await this.userRepository.findByEmail(payload.email);

        if (existingUser) {
            throw new AppError('Ya existe un usuario con ese email', 409, 'USER_EMAIL_ALREADY_EXISTS');
        }

        const hashedPassword = await bcrypt.hash(payload.password, 10);

        const user = await this.userRepository.create(buildUserEntity({
            ...payload,
            password: hashedPassword
        }));

        return this.sanitizeUser(user);
    }

    async listUsers(filters) {
        const users = await this.userRepository.findAll(filters);
        return users.map((user) => this.sanitizeUser(user));
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
        return this.sanitizeUser(user);
    }

    async updateUser(id, payload) {
        const currentUser = await this.userRepository.findById(id);
        if (!currentUser) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');

        if (payload.email && payload.email !== currentUser.email) {
            const userWithSameEmail = await this.userRepository.findByEmail(payload.email);
            if (userWithSameEmail) {
                throw new AppError('Ya existe un usuario con ese email', 409, 'USER_EMAIL_ALREADY_EXISTS');
            }
        }

        const dataToUpdate = { ...payload };

        if (payload.password) {
            dataToUpdate.password = await bcrypt.hash(payload.password, 10);
        }

        const updatedUser = await this.userRepository.update(id, buildUserEntity({
            ...currentUser,
            ...dataToUpdate
        }));

        return this.sanitizeUser(updatedUser);
    }

    async deleteUser(id, authenticatedUserId) {
        if (Number(id) === Number(authenticatedUserId)) {
            throw new AppError('No puedes eliminar tu propio usuario autenticado', 400, 'SELF_DELETE_NOT_ALLOWED');
        }

        const deleted = await this.userRepository.delete(id);
        if (!deleted) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }
}

module.exports = AuthUseCases;



