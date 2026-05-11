const asyncHandler = require('../../shared/utils/asyncHandler');

module.exports = ({ authUseCases }) => ({
    register: asyncHandler(async (req, res) => {
        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            data: await authUseCases.register(req.body)
        });
    }),

    login: asyncHandler(async (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Login correcto',
            data: await authUseCases.login(req.body)
        });
    }),

    me: asyncHandler(async (req, res) => {
        res.status(200).json({
            success: true,
            data: await authUseCases.getAuthenticatedUser(req.user.id)
        });
    })
});

