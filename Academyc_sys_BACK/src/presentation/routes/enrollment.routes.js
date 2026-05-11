const express = require('express');
const validateRequest = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { idParam, enrollmentRules } = require('../middlewares/validation-rules');

module.exports = ({ enrollmentController }) => {
  const router = express.Router();
  
  router.post('/register', enrollmentRules.register, validateRequest, enrollmentController.registerAndEnroll);

  router.use(authMiddleware);
  router.get('/', enrollmentController.findAll);
  router.get('/:id', idParam, validateRequest, enrollmentController.findById);

  router.use(roleMiddleware('admin'));
  router.post('/', enrollmentRules.create, validateRequest, enrollmentController.create);
  router.put('/:id', [...idParam, ...enrollmentRules.update], validateRequest, enrollmentController.update);
  router.delete('/:id', idParam, validateRequest, enrollmentController.remove);

  return router;
};
