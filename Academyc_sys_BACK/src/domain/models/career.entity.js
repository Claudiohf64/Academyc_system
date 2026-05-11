module.exports = function buildCareerEntity(data) {
  return {
    id: data.id,
    nombre: data.nombre,
    duracion_meses: data.duracion_meses,
    descripcion: data.descripcion,
    activo: data.activo !== undefined ? data.activo : true,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
