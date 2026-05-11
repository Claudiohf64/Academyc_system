import { apiRequest } from '../../../shared/api/httpClient';

/**
 * Normalizes the response from the backend.
 * Many backend endpoints return { success: true, data: ... }
 */
const unwrap = (res) => res.data || res;

// --- AUTH ---
export const login = (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
export const getMe = () => apiRequest('/auth/me').then(unwrap);

// --- CAREERS ---
export const listCareers = (params) => {
  const query = params ? new URLSearchParams(params).toString() : '';
  return apiRequest(`/careers${query ? `?${query}` : ''}`).then(unwrap);
};
export const getCareer = (id) => apiRequest(`/careers/${id}`).then(unwrap);
export const createCareer = (data) => apiRequest('/careers', { method: 'POST', body: JSON.stringify(data) }).then(unwrap);
export const updateCareer = (id, data) => apiRequest(`/careers/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(unwrap);
export const deleteCareer = (id) => apiRequest(`/careers/${id}`, { method: 'DELETE' }).then(unwrap);

// --- COURSES ---
export const listCourses = (params) => {
  const query = params ? new URLSearchParams(params).toString() : '';
  return apiRequest(`/courses${query ? `?${query}` : ''}`).then(unwrap);
};
export const getCourse = (id) => apiRequest(`/courses/${id}`).then(unwrap);
export const createCourse = (data) => apiRequest('/courses', { method: 'POST', body: JSON.stringify(data) }).then(unwrap);
export const updateCourse = (id, data) => apiRequest(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(unwrap);
export const deleteCourse = (id) => apiRequest(`/courses/${id}`, { method: 'DELETE' }).then(unwrap);

// --- STUDENTS ---
export const listStudents = (params) => {
  const query = params ? new URLSearchParams(params).toString() : '';
  return apiRequest(`/students${query ? `?${query}` : ''}`).then(unwrap);
};
export const getStudent = (id) => apiRequest(`/students/${id}`).then(unwrap);
export const getStudentByDni = (dni) => apiRequest(`/students/dni/${dni}`).then(unwrap);
export const createStudent = (data) => apiRequest('/students', { method: 'POST', body: JSON.stringify(data) }).then(unwrap);
export const updateStudent = (id, data) => apiRequest(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(unwrap);
export const deleteStudent = (id) => apiRequest(`/students/${id}`, { method: 'DELETE' }).then(unwrap);

// --- TEACHERS ---
export const listTeachers = (params) => {
  const query = params ? new URLSearchParams(params).toString() : '';
  return apiRequest(`/teachers${query ? `?${query}` : ''}`).then(unwrap);
};
export const getTeacher = (id) => apiRequest(`/teachers/${id}`).then(unwrap);
export const getTeacherByDni = (dni) => apiRequest(`/teachers/dni/${dni}`).then(unwrap);
export const getTeacherByCod = (cod) => apiRequest(`/teachers/cod_docente/${cod}`).then(unwrap);
export const createTeacher = (data) => apiRequest('/teachers', { method: 'POST', body: JSON.stringify(data) }).then(unwrap);
export const updateTeacher = (id, data) => apiRequest(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(unwrap);
export const deleteTeacher = (id) => apiRequest(`/teachers/${id}`, { method: 'DELETE' }).then(unwrap);

// --- ENROLLMENTS ---
export const listEnrollments = (params) => {
  const query = params ? new URLSearchParams(params).toString() : '';
  return apiRequest(`/enrollments${query ? `?${query}` : ''}`).then(unwrap);
};
export const getEnrollment = (id) => apiRequest(`/enrollments/${id}`).then(unwrap);
export const createEnrollment = (data) => apiRequest('/enrollments', { method: 'POST', body: JSON.stringify(data) }).then(unwrap);
export const updateEnrollment = (id, data) => apiRequest(`/enrollments/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(unwrap);
export const deleteEnrollment = (id) => apiRequest(`/enrollments/${id}`, { method: 'DELETE' }).then(unwrap);

// --- TRANSACTIONAL REGISTER ---
/**
 * Register a student, creating User, Student and Enrollment in one go.
 */
export const registerStudentTransactional = (data) => apiRequest('/enrollments/register', { method: 'POST', body: JSON.stringify(data) }).then(unwrap);

/**
 * Register a teacher using DNI extraction.
 */
export const registerTeacherTransactional = (data) => apiRequest('/teachers/register', { method: 'POST', body: JSON.stringify(data) }).then(unwrap);

// --- USERS (ADMIN ONLY - IF REGISTERED IN INDEX.JS) ---
export const listUsers = () => apiRequest('/users').then(unwrap);
export const createUser = (data) => apiRequest('/users', { method: 'POST', body: JSON.stringify(data) }).then(unwrap);
export const updateUser = (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(unwrap);
export const deleteUser = (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }).then(unwrap);
