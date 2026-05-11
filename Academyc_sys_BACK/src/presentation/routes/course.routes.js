const express = require('express');
const validateRequest = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { idParam, courseRules } = require('../middlewares/validation-rules');

module.exports = ({ courseController }) => {
  const router = express.Router();
  router.use(authMiddleware);

  router.get('/', courseController.findAll);
  router.get('/:id', idParam, validateRequest, courseController.findById);

  router.use(roleMiddleware('admin'));
  router.post('/', courseRules.create, validateRequest, courseController.create);
  router.put('/:id', [...idParam, ...courseRules.update], validateRequest, courseController.update);
  router.delete('/:id', idParam, validateRequest, courseController.remove);

  return router;
};
