const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const AppError = require('../../shared/utils/appError');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Token no enviado', 401, 'TOKEN_MISSING'));
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = jwt.verify(token, env.jwt.secret);
        return next();
    } catch (error) {
        return next(new AppError('Token invalido o expirado', 401, 'TOKEN_INVALID'));
    }
};
