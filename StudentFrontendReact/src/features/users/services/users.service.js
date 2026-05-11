import { apiRequest } from '../../../shared/api/httpClient';

export function listUsers() {
  return apiRequest('/users');
}

export function getUserById(id) {
  return apiRequest(`/users/${id}`);
}

export function createUser(user) {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

export function updateUser(id, user) {
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  });
}

export function deleteUser(id) {
  return apiRequest(`/users/${id}`, {
    method: 'DELETE',
  });
}
