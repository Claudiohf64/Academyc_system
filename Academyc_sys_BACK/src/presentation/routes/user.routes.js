const express = require('express');
const validateRequest = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { idParam, userRules } = require('../middlewares/validation-rules');

module.exports = ({ userController }) => {
    const router = express.Router();

    router.use(authMiddleware);
    router.use(roleMiddleware('admin'));

    router.post('/', userRules.create, validateRequest, userController.create);
    router.get('/', userController.findAll);
    router.get('/:id', idParam, validateRequest, userController.findById);
    router.put('/:id', [...idParam, ...userRules.update], validateRequest, userController.update);
    router.delete('/:id', idParam, validateRequest, userController.remove);

    return router;
};