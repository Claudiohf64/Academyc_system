const express = require('express');
const validateRequest = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { idParam, dniParam, studentRules } = require('../middlewares/validation-rules');

module.exports = ({ studentController }) => {
  const router = express.Router();
  router.use(authMiddleware);
  router.get('/dni/:dni', dniParam, validateRequest, studentController.lookupByDni);
  router.get('/', studentController.findAll);
  router.get('/:id', idParam, validateRequest, studentController.findById);
  router.put('/:id', [...idParam, ...studentRules.update], validateRequest, studentController.update);
  router.delete('/:id', idParam, validateRequest, studentController.remove);
  return router;
};
