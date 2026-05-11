module.exports = function buildTeacherEntity(data) {
  return {
    id: data.id,
    user_id: data.user_id,
    user: data.user ? data.user : undefined,
    cod_docente: data.cod_docente,
    dni: data.dni,
    nombres: data.nombres,
    apellido_paterno: data.apellido_paterno,
    apellido_materno: data.apellido_materno,
    celular: data.celular || null,
    direccion: data.direccion || null
  };
};
