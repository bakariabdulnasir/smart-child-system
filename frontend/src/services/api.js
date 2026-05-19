const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
}

// ============ CHILD PROFILE API ============
export const childAPI = {
  // Get all children for the logged-in parent
  getAll: () => apiFetch('/children'),
  
  // Get a specific child by ID
  getById: (id) => apiFetch(`/children/${id}`),
  
  // Create a new child profile
  create: (data) => apiFetch('/children', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  // Update an existing child profile
  update: (id, data) => apiFetch(`/children/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  
  // Delete a child profile
  delete: (id) => apiFetch(`/children/${id}`, { 
    method: 'DELETE' 
  }),
};

// ============ EVENT PLANNER API ============
export const eventAPI = {
  // Get all events
  getAll: () => apiFetch('/events'),
  
  // Get events for a specific child
  getByChild: (childId) => apiFetch(`/events?child_id=${childId}`),
  
  // Get upcoming events
  getUpcoming: () => apiFetch('/events/upcoming'),
  
  // Create a new event
  create: (data) => apiFetch('/events', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  // Update an event
  update: (id, data) => apiFetch(`/events/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  
  // Delete an event
  delete: (id) => apiFetch(`/events/${id}`, { 
    method: 'DELETE' 
  }),
};

// ============ WEEKEND PLANNER API ============
export const weekendAPI = {
  // Get all weekend plans
  getAll: () => apiFetch('/weekend-plans'),
  
  // Get weekend plans for a specific date range
  getByDateRange: (startDate, endDate) => apiFetch(`/weekend-plans?start=${startDate}&end=${endDate}`),
  
  // Create a weekend activity
  create: (data) => apiFetch('/weekend-plans', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  // Update a weekend plan
  update: (id, data) => apiFetch(`/weekend-plans/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  
  // Delete a weekend plan
  delete: (id) => apiFetch(`/weekend-plans/${id}`, { 
    method: 'DELETE' 
  }),
  
  // Get recurring weekend activities
  getRecurring: () => apiFetch('/weekend-plans/recurring'),
};

// ============ SCHEDULE API ============
export const scheduleAPI = {
  getAll: () => apiFetch('/schedules'),
  create: (data) => apiFetch('/schedules', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/schedules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/schedules/${id}`, { method: 'DELETE' }),
};

// ============ TASK API ============
export const taskAPI = {
  getAll: () => apiFetch('/tasks'),
  create: (data) => apiFetch('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/tasks/${id}`, { method: 'DELETE' }),
  complete: (id) => apiFetch(`/tasks/${id}/complete`, { method: 'PATCH' }),
};

// ============ CONTACT API ============
export const contactAPI = {
  getAll: () => apiFetch('/trusted-contacts'),
  create: (data) => apiFetch('/trusted-contacts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/trusted-contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/trusted-contacts/${id}`, { method: 'DELETE' }),
};

export default apiFetch;
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
