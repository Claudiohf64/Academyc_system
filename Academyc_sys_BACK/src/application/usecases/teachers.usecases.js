const AppError = require('../../shared/utils/appError');
const buildTeacherEntity = require('../../domain/models/teacher.entity');

const bcrypt = require('bcryptjs');

class TeacherUseCases {
  constructor({ teacherRepository, dniLookupService, userRepository, sequelize }) {
    this.teacherRepository = teacherRepository;
    this.dniLookupService = dniLookupService;
    this.userRepository = userRepository;
    this.sequelize = sequelize;
  }

  async createTeacher(payload) {
    const existingTeacher = await this.teacherRepository.findByCod_docente(payload.cod_docente);
    if (existingTeacher) {
      throw new AppError('Ya existe un docente registrado con ese codigo de docente', 409, 'TEACHER_CODE_ALREADY_EXISTS');
    }
    return this.teacherRepository.create(buildTeacherEntity(payload));
  }

  async createTeacherFromDni(datosDocente) {
    if (!datosDocente.dni){
      throw new AppError ('El dni debe rellenarse' , 400, 'DNI_REQUIRED')
    }
    if (!datosDocente.email || !datosDocente.password) {
      throw new AppError('Email y password son requeridos para crear el usuario del docente', 400);
    }

    const existingTeacher = await this.teacherRepository.findByDni(datosDocente.dni);
    if (existingTeacher){
      throw new AppError ('El dni del docente ya existe', 400, 'TEACHER_DNI_ALREADY_EXISTS')
    }

    const dniData = await this.dniLookupService.findByDni(datosDocente.dni);
    
    const generatedCode = datosDocente.dni;

    const transaction = await this.sequelize.transaction();
    try {
      const hashedPassword = await bcrypt.hash(datosDocente.password, 10);
      const newUser = await this.userRepository.User.create({
        nombres: dniData.nombres,
        email: datosDocente.email,
        password: hashedPassword,
        role: 'docente',
        activo: true
      }, { transaction });

      const newTeacher = await this.teacherRepository.Teacher.create({
        user_id: newUser.id,
        cod_docente: generatedCode,
        dni: dniData.dni,
        nombres: dniData.nombres,
        apellido_paterno: dniData.apellido_paterno,
        apellido_materno: dniData.apellido_materno,
        celular: datosDocente.celular,
        direccion: datosDocente.direccion
      }, { transaction });

      await transaction.commit();
      return buildTeacherEntity(newTeacher);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async listTeachers(filters) {
    return this.teacherRepository.findAll(filters);
  }

  async getTeacherById(id) {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) throw new AppError('Docente no encontrado', 404, 'TEACHER_NOT_FOUND');
    return teacher;
  }

  async updateTeacher(id, payload) {
    const currentTeacher = await this.teacherRepository.findById(id);
    if (!currentTeacher) throw new AppError('Docente no encontrado', 404, 'TEACHER_NOT_FOUND');

    if (payload.dni && payload.dni !== currentTeacher.dni) {
      const teacherWithSameDni = await this.teacherRepository.findByDni(payload.dni);
      if (teacherWithSameDni) {
        throw new AppError('Ya existe un docente registrado con ese DNI', 409, 'TEACHER_DNI_ALREADY_EXISTS');
      }
    }

    if (payload.cod_docente && payload.cod_docente !== currentTeacher.cod_docente) {
      const teacherWithSameCode = await this.teacherRepository.findByCod_docente(payload.cod_docente);
      if (teacherWithSameCode) {
        throw new AppError('Ya existe un docente registrado con ese codigo de docente', 409, 'TEACHER_CODE_ALREADY_EXISTS');
      }
    }

    return this.teacherRepository.update(id, buildTeacherEntity({ ...currentTeacher, ...payload }));
  }

  async deleteTeacher(id) {
    const deleted = await this.teacherRepository.delete(id);
    if (!deleted) throw new AppError('Docente no encontrado', 404, 'TEACHER_NOT_FOUND');
  }

  async lookupByCod_docente(cod_docente) {
    const teacher = await this.teacherRepository.findByCod_docente(cod_docente);
    if (!teacher) throw new AppError('Docente no encontrado', 404, 'TEACHER_NOT_FOUND');
    return teacher;
  }

  async lookupByDni(dni) {
    return this.dniLookupService.findByDni(dni);
  }
}
module.exports = TeacherUseCases;