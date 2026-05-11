const { body, param } = require('express-validator');
const { stripHtmlTags, normalizeWhitespace } = require('../../shared/utils/sanitize');

const sanitizeText = (value) => normalizeWhitespace(stripHtmlTags(value));

const cod_docenteParam = [param('cod_docente').trim().isLength({ min: 8, max: 8 }).withMessage('El cod_docente debe tener 8 digitos').isNumeric().withMessage('El codigo docente solo debe contener numeros')];
const idParam = [param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo').toInt()];
const dniParam = [param('dni').trim().isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 digitos').isNumeric().withMessage('El DNI solo debe contener numeros')];

const studentRules = {
  create: [
    body('dni').trim().isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 digitos').isNumeric().withMessage('El DNI solo debe contener numeros'),
    body('nombres').customSanitizer(sanitizeText).notEmpty().withMessage('Los nombres son obligatorios').isLength({ max: 120 }).withMessage('Los nombres no deben exceder 120 caracteres'),
    body('apellido_paterno').customSanitizer(sanitizeText).notEmpty().withMessage('El apellido paterno es obligatorio').isLength({ max: 80 }).withMessage('El apellido paterno no debe exceder 80 caracteres'),
    body('apellido_materno').customSanitizer(sanitizeText).notEmpty().withMessage('El apellido materno es obligatorio').isLength({ max: 80 }).withMessage('El apellido materno no debe exceder 80 caracteres'),
    body('telefono').notEmpty().withMessage('El telefono es obligatorio').isLength({ min: 9, max: 9 }).withMessage('El telefono debe tener 9 digitos').isNumeric().withMessage('El telefono solo debe contener numeros'),
    body('direccion').notEmpty().withMessage('La direccion es obligatoria').customSanitizer(sanitizeText).isLength({ max: 255 }).withMessage('La direccion no debe exceder 255 caracteres')
  ],
  update: [
    body('dni').optional().trim().isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 digitos').isNumeric().withMessage('El DNI solo debe contener numeros'),
    body('nombres').optional().customSanitizer(sanitizeText).notEmpty().withMessage('Los nombres no pueden estar vacios').isLength({ max: 120 }).withMessage('Los nombres no deben exceder 120 caracteres'),
    body('apellido_paterno').optional().customSanitizer(sanitizeText).notEmpty().withMessage('El apellido paterno no puede estar vacio').isLength({ max: 80 }).withMessage('El apellido paterno no debe exceder 80 caracteres'),
    body('apellido_materno').optional().customSanitizer(sanitizeText).notEmpty().withMessage('El apellido materno no puede estar vacio').isLength({ max: 80 }).withMessage('El apellido materno no debe exceder 80 caracteres'),
    body('telefono').optional({ nullable: true }).customSanitizer(sanitizeText).isLength({ max: 20 }).withMessage('El telefono no debe exceder 20 caracteres').matches(/^[0-9+\-\s()]*$/).withMessage('El telefono contiene caracteres invalidos'),
    body('direccion').optional({ nullable: true }).customSanitizer(sanitizeText).isLength({ max: 255 }).withMessage('La direccion no debe exceder 255 caracteres')
  ],
  createFromDni: [
    body('dni').trim().isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 digitos').isNumeric().withMessage('El DNI solo debe contener numeros'),
    body('telefono').optional({ nullable: true }).customSanitizer(sanitizeText).isLength({ max: 20 }).withMessage('El telefono no debe exceder 20 caracteres').matches(/^[0-9+\-\s()]*$/).withMessage('El telefono contiene caracteres invalidos'),
    body('direccion').optional({ nullable: true }).customSanitizer(sanitizeText).isLength({ max: 255 }).withMessage('La direccion no debe exceder 255 caracteres')
  ],
};

const authRules = {
  register: [
    body('nombres').customSanitizer(sanitizeText).notEmpty().withMessage('Los nombres son obligatorios').isLength({ max: 120 }).withMessage('Los nombres no deben exceder 120 caracteres'),
    body('email').trim().notEmpty().withMessage('El email es obligatorio').matches(/^\S+$/).withMessage('El email no puede contener espacios en blanco').isEmail().withMessage('El email no tiene formato valido').normalizeEmail(),
    body('password').trim().notEmpty().withMessage('La contraseña es obligatoria').matches(/^\S+$/).withMessage('La contraseña no puede contener espacios en blanco').isLength({ min: 6 }).withMessage('La password debe tener minimo 6 caracteres').isLength({ max: 100 }).withMessage('La password no debe exceder 100 caracteres')
  ],
  login: [
    body('email').trim().notEmpty().withMessage('El email es obligatorio').matches(/^\S+$/).withMessage('El email no puede contener espacios en blanco').isEmail().withMessage('El email no tiene formato valido').normalizeEmail(),
    body('password').trim().notEmpty().withMessage('La contraseña es obligatoria').matches(/^\S+$/).withMessage('La contraseña no puede contener espacios en blanco')
  ]
};

const userRules = {
  create: [
    body('nombres').customSanitizer(sanitizeText).notEmpty().withMessage('Los nombres son obligatorios').isLength({ max: 120 }).withMessage('Los nombres no deben exceder 120 caracteres'),
    body('email').trim().notEmpty().withMessage('El email es obligatorio').matches(/^\S+$/).withMessage('El email no puede contener espacios en blanco').isEmail().withMessage('El email no tiene formato valido').normalizeEmail(),
    body('password').trim().notEmpty().withMessage('La contraseña es obligatoria').matches(/^\S+$/).withMessage('La contraseña no puede contener espacios en blanco').isLength({ min: 6 }).withMessage('La password debe tener minimo 6 caracteres').isLength({ max: 100 }).withMessage('La password no debe exceder 100 caracteres'),
    body('role').optional().isIn(['admin', 'user']).withMessage('El role debe ser admin o user'),
    body('activo').optional().isBoolean().withMessage('Activo debe ser booleano').toBoolean()
  ],
  update: [
    body('nombres').optional().customSanitizer(sanitizeText).notEmpty().withMessage('Los nombres no pueden estar vacios').isLength({ max: 120 }).withMessage('Los nombres no deben exceder 120 caracteres'),
    body('email').optional().trim().notEmpty().withMessage('El email no puede estar vacío').matches(/^\S+$/).withMessage('El email no puede contener espacios en blanco').isEmail().withMessage('El email no tiene formato valido').normalizeEmail(),
    body('password').optional().trim().notEmpty().withMessage('La contraseña no puede estar vacía').matches(/^\S+$/).withMessage('La contraseña no puede contener espacios en blanco').isLength({ min: 6 }).withMessage('La password debe tener minimo 6 caracteres').isLength({ max: 100 }).withMessage('La password no debe exceder 100 caracteres'),
    body('role').optional().isIn(['admin', 'user']).withMessage('El role debe ser admin o user'),
    body('activo').optional().isBoolean().withMessage('Activo debe ser booleano').toBoolean()
  ]
};

const teacherRules = {
  create: [
    body('cod_docente').trim().isLength({ min: 8, max: 8 }).withMessage('El codigo de docente debe tener 8 digitos').isNumeric().withMessage('El codigo de docente solo debe contener numeros'),
    body('dni').trim().isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 digitos').isNumeric().withMessage('El DNI solo debe contener numeros'),
    body('nombres').customSanitizer(sanitizeText).notEmpty().withMessage('Los nombres son obligatorios').isLength({ max: 120 }).withMessage('Los nombres no deben exceder 120 caracteres'),
    body('apellido_paterno').customSanitizer(sanitizeText).notEmpty().withMessage('El apellido paterno es obligatorio').isLength({ max: 80 }).withMessage('El apellido paterno no debe exceder 80 caracteres'),
    body('apellido_materno').customSanitizer(sanitizeText).notEmpty().withMessage('El apellido materno es obligatorio').isLength({ max: 80 }).withMessage('El apellido materno no debe exceder 80 caracteres'),
    body('celular').notEmpty().withMessage('El celular es obligatorio').isLength({ min: 9, max: 9 }).withMessage('El celular debe tener 9 digitos').isNumeric().withMessage('El celular solo debe contener numeros'),
    body('direccion').notEmpty().withMessage('La direccion es obligatoria').customSanitizer(sanitizeText).isLength({ max: 255 }).withMessage('La direccion no debe exceder 255 caracteres')
  ],
  update: [
    body('nombres').optional().customSanitizer(sanitizeText).notEmpty().withMessage('Los nombres no pueden estar vacios').isLength({ max: 120 }).withMessage('Los nombres no deben exceder 120 caracteres'),
    body('apellido_paterno').optional().customSanitizer(sanitizeText).notEmpty().withMessage('El apellido paterno no puede estar vacio').isLength({ max: 80 }).withMessage('El apellido paterno no debe exceder 80 caracteres'),
    body('apellido_materno').optional().customSanitizer(sanitizeText).notEmpty().withMessage('El apellido materno no puede estar vacio').isLength({ max: 80 }).withMessage('El apellido materno no debe exceder 80 caracteres'),
    body('celular').optional({ nullable: true }).customSanitizer(sanitizeText).isLength({ max: 20 }).withMessage('El celular no debe exceder 20 caracteres').matches(/^[0-9+\-\s()]*$/).withMessage('El celular contiene caracteres invalidos'),
    body('direccion').optional({ nullable: true }).customSanitizer(sanitizeText).isLength({ max: 255 }).withMessage('La direccion no debe exceder 255 caracteres')
  ],
  createFromDni: [
    body('dni').trim().isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 digitos').isNumeric().withMessage('El DNI solo debe contener numeros'),
    body('celular').notEmpty().withMessage('El celular es obligatorio').isLength({ min: 9, max: 9 }).withMessage('El celular debe tener 9 digitos').isNumeric().withMessage('El celular solo debe contener numeros'),
    body('direccion').notEmpty().withMessage('La direccion es obligatoria').customSanitizer(sanitizeText).isLength({ max: 255 }).withMessage('La direccion no debe exceder 255 caracteres')
  ],
};

const careerRules = {
  create: [
    body('nombre').customSanitizer(sanitizeText).notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 120 }),
    body('duracion_meses').optional().isInt({ min: 1 }).withMessage('La duracion debe ser un numero de meses positivo').toInt(),
    body('descripcion').optional({ nullable: true }).customSanitizer(sanitizeText),
    body('activo').optional().isBoolean().toBoolean()
  ],
  update: [
    body('nombre').optional().customSanitizer(sanitizeText).notEmpty().isLength({ max: 120 }),
    body('descripcion').optional({ nullable: true }).customSanitizer(sanitizeText),
    body('activo').optional().isBoolean().toBoolean()
  ]
};

const courseRules = {
  create: [
    body('career_id').isInt({ min: 1 }).toInt(),
    body('nombre').customSanitizer(sanitizeText).notEmpty().isLength({ max: 120 }),
    body('creditos').optional().isInt({ min: 1 }).toInt(),
    body('fecha_inicio').optional({ nullable: true }).isDate().withMessage('Fecha de inicio invalida'),
    body('fecha_fin').optional({ nullable: true }).isDate().withMessage('Fecha de fin invalida'),
    body('dias').optional({ nullable: true }).customSanitizer(sanitizeText).isLength({ max: 100 }),
    body('horario').optional({ nullable: true }).customSanitizer(sanitizeText).isLength({ max: 100 }),
    body('descripcion').optional({ nullable: true }).customSanitizer(sanitizeText),
    body('activo').optional().isBoolean().toBoolean()
  ],
  update: [
    body('career_id').optional().isInt({ min: 1 }).toInt(),
    body('nombre').optional().customSanitizer(sanitizeText).notEmpty().isLength({ max: 120 }),
    body('creditos').optional().isInt({ min: 1 }).toInt(),
    body('descripcion').optional({ nullable: true }).customSanitizer(sanitizeText),
    body('activo').optional().isBoolean().toBoolean()
  ]
};

const enrollmentRules = {
  register: [
    body('dni').trim().isLength({ min: 8, max: 8 }).isNumeric().withMessage('El DNI debe tener 8 digitos numericos'),
    body('email').trim().notEmpty().withMessage('El email es obligatorio').matches(/^\S+$/).withMessage('El email no puede contener espacios en blanco').isEmail().normalizeEmail().withMessage('El formato del email es invalido'),
    body('password').trim().notEmpty().withMessage('La contraseña es obligatoria').matches(/^\S+$/).withMessage('La contraseña no puede contener espacios en blanco').isLength({ min: 6 }).withMessage('La password debe tener minimo 6 caracteres'),
    body('career_id').isInt({ min: 1 }).toInt().withMessage('Debe proveer un career_id valido'),
    body('telefono').notEmpty().withMessage('El telefono es obligatorio').isLength({ min: 9, max: 9 }).withMessage('El telefono debe tener 9 digitos').isNumeric().withMessage('El telefono solo debe contener numeros'),
    body('direccion').notEmpty().withMessage('La direccion es obligatoria').customSanitizer(sanitizeText).isLength({ max: 255 }).withMessage('La direccion no debe exceder 255 caracteres')
  ],
  create: [
    body('student_id').isInt({ min: 1 }).toInt(),
    body('career_id').isInt({ min: 1 }).toInt(),
    body('estado').optional().isIn(['activa', 'completada', 'anulada'])
  ],
  update: [
    body('estado').optional().isIn(['activa', 'completada', 'anulada'])
  ]
};

module.exports = { idParam, dniParam, cod_docenteParam, studentRules, teacherRules, authRules, userRules, careerRules, courseRules, enrollmentRules };
