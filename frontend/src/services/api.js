const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  return response;
}
