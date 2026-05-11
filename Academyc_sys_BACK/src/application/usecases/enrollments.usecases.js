const buildEnrollmentEntity = require('../../domain/models/enrollment.entity');
const AppError = require('../../shared/utils/appError');
const bcrypt = require('bcryptjs');

class EnrollmentUseCases {
  constructor({ enrollmentRepository, userRepository, studentRepository, dniLookupService, sequelize, jwtConfig }) {
    this.enrollmentRepository = enrollmentRepository;
    this.userRepository = userRepository;
    this.studentRepository = studentRepository;
    this.dniLookupService = dniLookupService;
    this.sequelize = sequelize;
    this.jwtConfig = jwtConfig;
  }

  async findAll(filters) {
    return await this.enrollmentRepository.findAll(filters);
  }

  async findById(id) {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) throw new AppError('Matrícula no encontrada', 404);
    return enrollment;
  }

  async registerAndEnroll(data) {
    if (!data.dni) {
      throw new AppError('El DNI es obligatorio', 400);
    }
    
    const existingStudent = await this.studentRepository.findByDni(data.dni);
    if (existingStudent) {
      throw new AppError('Ya existe un estudiante registrado con este DNI', 400);
    }

    const dniData = await this.dniLookupService.findByDni(data.dni);

    const transaction = await this.sequelize.transaction();
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const userToCreate = {
        nombres: dniData.nombres,
        email: data.email,
        password: hashedPassword,
        role: 'alumno',
        activo: true
      };
      
      const newUser = await this.userRepository.User.create(userToCreate, { transaction });

      const studentToCreate = {
        user_id: newUser.id,
        dni: dniData.dni,
        nombres: dniData.nombres,
        apellido_paterno: dniData.apellido_paterno,
        apellido_materno: dniData.apellido_materno,
        telefono: data.telefono,
        direccion: data.direccion
      };
      const newStudent = await this.studentRepository.Student.create(studentToCreate, { transaction });

      const enrollmentToCreate = {
        student_id: newStudent.id,
        career_id: data.career_id,
        estado: 'activa',
        fecha: new Date()
      };
      
      const newEnrollment = await this.enrollmentRepository.create(enrollmentToCreate, transaction);

      await transaction.commit();
      
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        this.jwtConfig.secret,
        { expiresIn: this.jwtConfig.expiresIn }
      );
      
      return {
        message: 'Alumno registrado y matriculado con éxito',
        user: { id: newUser.id, email: newUser.email },
        student: { id: newStudent.id, dni: newStudent.dni },
        enrollment: newEnrollment,
        token
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async create(data) {
    const enrollmentEntity = buildEnrollmentEntity(data);
    return await this.enrollmentRepository.create(enrollmentEntity, null);
  }

  async update(id, data) {
    const existing = await this.findById(id);
    const updatedEntity = buildEnrollmentEntity({ ...existing, ...data });
    return await this.enrollmentRepository.update(id, updatedEntity);
  }

  async remove(id) {
    await this.findById(id);
    await this.enrollmentRepository.remove(id);
    return { message: 'Matrícula eliminada correctamente' };
  }
}

module.exports = EnrollmentUseCases;
