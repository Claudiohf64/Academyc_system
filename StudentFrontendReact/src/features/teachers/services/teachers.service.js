import { apiRequest} from '../../../shared/api/httpClient';

export function listTeachers() {
  return apiRequest('/teachers');
}

export function getTeacherById(id) {
  return apiRequest(`/teachers/${id}`);
}

export function getTeacherByCode(cod_docente) {
  return apiRequest(`/teachers/cod_docente/${cod_docente}`);
}

export function lookupDni(dni) {
  return apiRequest(`/teachers/dni/${dni}`);
}

export function createTeacher(teacher) {
  return apiRequest('/teachers', {
    method: 'POST',
    body: JSON.stringify(teacher),
  });
}

export function createTeacherFromDni(teacher) {
  return apiRequest('/teachers/dni', {
    method: 'POST',
    body: JSON.stringify(teacher),
  });
}

export function updateTeacher(id, teacher) {
  return apiRequest(`/teachers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(teacher),
  });
}

export function deleteTeacher(id) {
  return apiRequest(`/teachers/${id}`, {
    method: 'DELETE',
  });
}
