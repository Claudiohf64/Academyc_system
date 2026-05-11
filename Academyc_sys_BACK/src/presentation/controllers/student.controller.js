const asyncHandler = require('../../shared/utils/asyncHandler');

module.exports = ({ studentUseCases }) => ({
  create: asyncHandler(async (req, res) => res.status(201).json({ success: true, message: 'Estudiante creado correctamente', data: await studentUseCases.createStudent(req.body) })),
  createFromDni: asyncHandler(async (req,res) => res.status(201).json({ success: true, message: 'Estudiante creado correctamente con el DNI', data: await studentUseCases.createStudentFromDni(req.body) })),
  findAll: asyncHandler(async (req, res) => res.status(200).json({ success: true, data: await studentUseCases.listStudents(req.query) })),
  findById: asyncHandler(async (req, res) => res.status(200).json({ success: true, data: await studentUseCases.getStudentById(req.params.id) })),
  update: asyncHandler(async (req, res) => res.status(200).json({ success: true, message: 'Estudiante actualizado correctamente', data: await studentUseCases.updateStudent(req.params.id, req.body) })),
  remove: asyncHandler(async (req, res) => { await studentUseCases.deleteStudent(req.params.id); res.status(200).json({ success: true, message: 'Estudiante eliminado correctamente' }); }),
  lookupByDni: asyncHandler(async (req, res) => res.status(200).json({ success: true, data: await studentUseCases.lookupByDni(req.params.dni) }))
});
