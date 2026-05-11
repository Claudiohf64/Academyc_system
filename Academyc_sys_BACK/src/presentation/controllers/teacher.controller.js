const asyncHandler = require('../../shared/utils/asyncHandler');

module.exports = ({ teacherUseCases }) => ({
  create: asyncHandler(async (req, res) => res.status(201).json({ success: true, message: 'Docente creado correctamente', data: await teacherUseCases.createTeacher(req.body) })),
  createFromDni: asyncHandler(async (req, res) => res.status(201).json({ success: true, message: 'Docente creado correctamente', data: await teacherUseCases.createTeacherFromDni(req.body) })),
  findAll: asyncHandler(async (req, res) => res.status(200).json({ success: true, data: await teacherUseCases.listTeachers(req.query) })),
  findById: asyncHandler(async (req, res) => res.status(200).json({ success: true, data: await teacherUseCases.getTeacherById(req.params.id) })),
  update: asyncHandler(async (req, res) => res.status(200).json({ success: true, message: 'Docente actualizado correctamente', data: await teacherUseCases.updateTeacher(req.params.id, req.body) })),
  remove: asyncHandler(async (req, res) => { await teacherUseCases.deleteTeacher(req.params.id); res.status(200).json({ success: true, message: 'Docente eliminado correctamente' }); }),
  lookupByCod_docente: asyncHandler(async (req, res) => res.status(200).json({ success: true, data: await teacherUseCases.lookupByCod_docente(req.params.cod_docente) })),
  lookupByDni: asyncHandler(async (req, res) => res.status(200).json({ success: true, data: await teacherUseCases.lookupByDni(req.params.dni) }))
});
