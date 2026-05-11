import { apiRequest, setStoredToken } from '../../../shared/api/httpClient';

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(credentials) {
  const payload = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (payload.data?.token) {
    setStoredToken(payload.data.token);
  }

  return payload;
}

export function getAuthenticatedUser() {
  return apiRequest('/auth/me');
}

export function logoutUser() {
  setStoredToken(null);
}
