module.exports = function buildStudentEntity(data) {
  return {
    id: data.id,
    user_id: data.user_id,
    user: data.user ? data.user : undefined,
    dni: data.dni,
    nombres: data.nombres,
    apellido_paterno: data.apellido_paterno,
    apellido_materno: data.apellido_materno,
    telefono: data.telefono || null,
    direccion: data.direccion || null
  };
};
