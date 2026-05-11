module.exports = function buildEnrollmentEntity(data) {
  return {
    id: data.id,
    student_id: data.student_id,
    student: data.student ? data.student : undefined,
    career_id: data.career_id,
    career: data.career ? data.career : undefined,
    estado: data.estado,
    fecha: data.fecha,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
