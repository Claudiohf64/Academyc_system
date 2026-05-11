import { apiRequest } from '../../../shared/api/httpClient';

export function listStudents() {
  return apiRequest('/students');
}

export function getStudentById(id) {
  return apiRequest(`/students/${id}`);
}

export function lookupDni(dni) {
  return apiRequest(`/students/dni/${dni}`);
}

export function createStudent(student) {
  return apiRequest('/students', {
    method: 'POST',
    body: JSON.stringify(student),
  });
}

export function createStudentFromDni(student) {
  return apiRequest('/students/dni', {
    method: 'POST',
    body: JSON.stringify(student),
  });
}

export function updateStudent(id, student) {
  return apiRequest(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(student),
  });
}

export function deleteStudent(id) {
  return apiRequest(`/students/${id}`, {
    method: 'DELETE',
  });
}
