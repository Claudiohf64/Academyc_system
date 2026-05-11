const express = require('express');
const validateRequest = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { authRules } = require('../middlewares/validation-rules');

module.exports = ({ authController }) => {
    const router = express.Router();

    router.post('/login', authRules.login, validateRequest, authController.login);
    router.get('/me', authMiddleware, authController.me);

    return router;
};