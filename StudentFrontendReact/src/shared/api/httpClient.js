import { API_BASE_URL } from '../../config/env';

const TOKEN_KEY = 'student_frontend_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}

export async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const rawText = await response.text();
  const payload = rawText ? JSON.parse(rawText) : {};

  if (!response.ok) {
    const error = new Error(payload.message || 'No fue posible completar la solicitud');
    error.status = response.status;
    error.code = payload.code;
    error.details = payload.details;
    throw error;
  }

  return payload;
}

export function apiRequest(path, options = {}) {
  const token = getStoredToken();

  return requestJson(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
}
