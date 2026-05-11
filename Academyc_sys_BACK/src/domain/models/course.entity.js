module.exports = function buildCourseEntity(data) {
  return {
    id: data.id,
    career_id: data.career_id,
    career: data.career ? data.career : undefined,
    nombre: data.nombre,
    creditos: data.creditos,
    fecha_inicio: data.fecha_inicio,
    fecha_fin: data.fecha_fin,
    dias: data.dias,
    horario: data.horario,
    descripcion: data.descripcion,
    activo: data.activo !== undefined ? data.activo : true,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
