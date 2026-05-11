const { validationResult } = require('express-validator');
const AppError = require('../../shared/utils/appError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArr = errors.array();
    return next(new AppError(errorArr[0].msg, 400, 'VALIDATION_ERROR', errorArr));
  }
  return next();
};
