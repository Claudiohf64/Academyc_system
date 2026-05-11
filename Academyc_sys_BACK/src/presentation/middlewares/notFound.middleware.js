const AppError = require('../../shared/utils/appError');
module.exports = (req, res, next) => next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND'));