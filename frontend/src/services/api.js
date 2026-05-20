const API_BASE =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000/api';


// =========================================
// MAIN API FETCH FUNCTION
// =========================================
export async function apiFetch(
  endpoint,
  options = {}
) {

  const token =
    localStorage.getItem('token');

  const response = await fetch(
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

  return response;
}


// =========================================
// CHILD PROFILE API
// =========================================
export const childAPI = {

  // Get all children
  getAll: () =>
    apiFetch('/children'),

  // Get child by ID
  getById: (id) =>
    apiFetch(`/children/${id}`),

  // Create child
  create: (data) =>
    apiFetch('/children', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update child
  update: (id, data) =>
    apiFetch(`/children/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete child
  delete: (id) =>
    apiFetch(`/children/${id}`, {
      method: 'DELETE',
    }),
};


// =========================================
// EVENT API
// =========================================
export const eventAPI = {

  // Get all events
  getAll: () =>
    apiFetch('/events'),

  // Get events by child
  getByChild: (childId) =>
    apiFetch(`/events?child_id=${childId}`),

  // Get upcoming events
  getUpcoming: () =>
    apiFetch('/events/upcoming'),

  // Create event
  create: (data) =>
    apiFetch('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update event
  update: (id, data) =>
    apiFetch(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete event
  delete: (id) =>
    apiFetch(`/events/${id}`, {
      method: 'DELETE',
    }),
};


// =========================================
// WEEKEND PLANNER API
// =========================================
export const weekendAPI = {

  // Get all weekend plans
  getAll: () =>
    apiFetch('/weekend-plans'),

  // Get by date range
  getByDateRange: (
    startDate,
    endDate
  ) =>
    apiFetch(
      `/weekend-plans?start=${startDate}&end=${endDate}`
    ),

  // Create weekend plan
  create: (data) =>
    apiFetch('/weekend-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update weekend plan
  update: (id, data) =>
    apiFetch(`/weekend-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete weekend plan
  delete: (id) =>
    apiFetch(`/weekend-plans/${id}`, {
      method: 'DELETE',
    }),

  // Get recurring plans
  getRecurring: () =>
    apiFetch('/weekend-plans/recurring'),
};


// =========================================
// SCHEDULE API
// =========================================
export const scheduleAPI = {

  getAll: () =>
    apiFetch('/schedules'),

  create: (data) =>
    apiFetch('/schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiFetch(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiFetch(`/schedules/${id}`, {
      method: 'DELETE',
    }),
};


// =========================================
// TASK API
// =========================================
export const taskAPI = {

  getAll: () =>
    apiFetch('/tasks'),

  create: (data) =>
    apiFetch('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiFetch(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiFetch(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  complete: (id) =>
    apiFetch(`/tasks/${id}/complete`, {
      method: 'PATCH',
    }),
};


// =========================================
// TRUSTED CONTACT API
// =========================================
export const contactAPI = {

  getAll: () =>
    apiFetch('/trusted-contacts'),

  create: (data) =>
    apiFetch('/trusted-contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiFetch(`/trusted-contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiFetch(`/trusted-contacts/${id}`, {
      method: 'DELETE',
    }),
};


// =========================================
// USER PROFILE API
// =========================================
export const userAPI = {
  getProfile: () => apiFetch('/users/me'),
  
  updateProfile: (data) => apiFetch('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  changePassword: (data) => apiFetch('/users/change-password', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};


// =========================================
// ADMIN API
// =========================================
export const adminAPI = {
  getAllUsers: () =>
    apiFetch('/admin/users'),

  deleteUser: (id) =>
    apiFetch(`/admin/users/${id}`, {
      method: 'DELETE',
    }),

  updateUserRole: (id, role) =>
    apiFetch(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  toggleUserStatus: (id) =>
    apiFetch(`/admin/users/${id}/status`, {
      method: 'PATCH',
    }),
};

// =========================================
// LOCATION API
// =========================================
export const locationAPI = {

  // Get nearby places (amenities)
  getNearbyPlaces: (lat, lng, amenity) =>
    apiFetch(`/locations/nearby?lat=${lat}&lng=${lng}&amenity=${amenity}`),
};


export default apiFetch;
