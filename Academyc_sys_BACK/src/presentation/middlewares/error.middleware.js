const AppError = require('../../shared/utils/appError');
const env = require('../../config/env');

module.exports = (error, req, res, next) => {
  let normalizedError = error;

  if (error.name === 'SequelizeUniqueConstraintError') {
    normalizedError = new AppError('Ya existe un registro con esos datos unicos', 409, 'DB_UNIQUE_CONSTRAINT');
  }
  if (error.name === 'SequelizeValidationError') {
    normalizedError = new AppError('Error de validacion en base de datos', 400, 'DB_VALIDATION_ERROR');
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    normalizedError = new AppError('No se encontro el recurso referenciado (llave foranea invalida)', 400, 'DB_FOREIGN_KEY_CONSTRAINT');
  }
  if (!(normalizedError instanceof AppError)) {
    normalizedError = new AppError(normalizedError.message || 'Error interno del servidor');
  }

  const response = {
    success: false,
    message: normalizedError.message,
    code: normalizedError.code
  };

  if (normalizedError.details) response.details = normalizedError.details;
  if (env.app.nodeEnv === 'development') response.stack = normalizedError.stack;

  res.status(normalizedError.statusCode || 500).json(response);
};