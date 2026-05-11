module.exports = function buildUserEntity(data) {
  return {
    id: data.id,
    nombres: data.nombres,
    email: data.email,
    password: data.password,
    role: data.role,
    activo: data.activo !== undefined ? data.activo : true
  };
};
