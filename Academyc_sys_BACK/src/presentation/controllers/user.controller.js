const asyncHandler = require('../../shared/utils/asyncHandler');

module.exports = ({ authUseCases }) => ({
    create: asyncHandler(async (req, res) => {
        res.status(201).json({
            success: true,
            message: 'Usuario creado correctamente',
            data: await authUseCases.createUser(req.body)
        });
    }),

    findAll: asyncHandler(async (req, res) => {
        res.status(200).json({
            success: true,
            data: await authUseCases.listUsers(req.query)
        });
    }),

    findById: asyncHandler(async (req, res) => {
        res.status(200).json({
            success: true,
            data: await authUseCases.getUserById(req.params.id)
        });
    }),

    update: asyncHandler(async (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: await authUseCases.updateUser(req.params.id, req.body)
        });
    }),

    remove: asyncHandler(async (req, res) => {
        await authUseCases.deleteUser(req.params.id, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    })
});

