const AppError = require('../../shared/utils/appError');

module.exports = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return next(new AppError('No tienes permisos para realizar esta accion', 403, 'FORBIDDEN'));
    }

    return next();
};