const express = require('express');
const validateRequest = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { idParam, careerRules } = require('../middlewares/validation-rules');

module.exports = ({ careerController }) => {
  const router = express.Router();
  router.use(authMiddleware);

  router.get('/', careerController.findAll);
  router.get('/:id', idParam, validateRequest, careerController.findById);

  router.use(roleMiddleware('admin'));
  router.post('/', careerRules.create, validateRequest, careerController.create);
  router.put('/:id', [...idParam, ...careerRules.update], validateRequest, careerController.update);
  router.delete('/:id', idParam, validateRequest, careerController.remove);

  return router;
};
