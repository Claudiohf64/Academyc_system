const AppError = require('../../shared/utils/appError');
const buildStudentEntity = require('../../domain/models/student.entity');

class StudentUseCases {
  constructor({ studentRepository, dniLookupService }) {
    this.studentRepository = studentRepository;
    this.dniLookupService = dniLookupService;
  }

  async createStudent(payload) {
    const existingStudent = await this.studentRepository.findByDni(payload.dni);
    if (existingStudent) {
      throw new AppError('Ya existe un estudiante registrado con ese DNI', 409, 'STUDENT_DNI_ALREADY_EXISTS');
    }
    return this.studentRepository.create(buildStudentEntity(payload));
  }

  async createStudentFromDni(datosEstudiante) {
    if (!datosEstudiante.dni){
      throw new AppError ('El dni debe rellenarse' , 400, 'DNI_REQUIRED')
    }

    const existingStudent = await this.studentRepository.findByDni(datosEstudiante.dni);

    if (existingStudent){
      throw new AppError ('El dni del estudiante ya existe', 400, 'STUDENT_DNI_ALREADY_EXISTS')
    }

    const dniData = await this.dniLookupService.findByDni(datosEstudiante.dni);

    return this.studentRepository.create(buildStudentEntity({
      dni: dniData.dni,
      nombres: dniData.nombres,
      apellido_paterno: dniData.apellido_paterno,
      apellido_materno: dniData.apellido_materno,
      telefono: datosEstudiante.telefono,
      direccion: datosEstudiante.direccion
    }));
  }
  
  async listStudents(filters) {
    return this.studentRepository.findAll(filters);
  }

  async getStudentById(id) {
    const student = await this.studentRepository.findById(id);
    if (!student) throw new AppError('Estudiante no encontrado', 404, 'STUDENT_NOT_FOUND');
    return student;
  }

  async updateStudent(id, payload) {
    const currentStudent = await this.studentRepository.findById(id);
    if (!currentStudent) throw new AppError('Estudiante no encontrado', 404, 'STUDENT_NOT_FOUND');

    if (payload.dni && payload.dni !== currentStudent.dni) {
      const studentWithSameDni = await this.studentRepository.findByDni(payload.dni);
      if (studentWithSameDni) {
        throw new AppError('Ya existe un estudiante registrado con ese DNI', 409, 'STUDENT_DNI_ALREADY_EXISTS');
      }
    }

    return this.studentRepository.update(id, buildStudentEntity({ ...currentStudent, ...payload }));
  }

  async deleteStudent(id) {
    const deleted = await this.studentRepository.delete(id);
    if (!deleted) throw new AppError('Estudiante no encontrado', 404, 'STUDENT_NOT_FOUND');
  }

  async lookupByDni(dni) {
    return this.dniLookupService.findByDni(dni);
  }
}
module.exports = StudentUseCases;