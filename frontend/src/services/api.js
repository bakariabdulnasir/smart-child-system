const API_BASE =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000/api';


export async function apiFetch(
  endpoint,
  options = {}
) {

  const token =
    localStorage.getItem('token');

  return fetch(
    `${API_BASE}${endpoint}`,
    {
      ...options,

      headers: {
        'Content-Type': 'application/json',

        ...(token && {
          Authorization: `Bearer ${token}`
        }),

        ...options.headers,
      },
    }
  );
}