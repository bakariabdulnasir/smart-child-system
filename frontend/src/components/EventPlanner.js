import React, { useState, useEffect } from 'react';
import { eventAPI, childAPI } from '../services/api';

const EventPlanner = () => {
  const [events, setEvents] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedChild, setSelectedChild] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    datetime: '',
    child_id: '',
    location: '',
    duration: '',
    reminder_minutes: 30,
    color: '#3B82F6'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, childrenRes] = await Promise.all([
        eventAPI.getAll(),
        childAPI.getAll()
      ]);
      
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (childrenRes.ok) setChildren(await childrenRes.json());
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.title || !formData.datetime || !formData.child_id) {
      setError('Title, date/time, and child are required');
      return;
    }
    
    const selectedDate = new Date(formData.datetime);
    if (selectedDate < new Date()) {
      setError('Cannot create events in the past');
      return;
    }
    
    try {
      let res;
      if (editingEvent) {
        res = await eventAPI.update(editingEvent.id, formData);
      } else {
        res = await eventAPI.create(formData);
      }
      
      if (res.ok) {
        setSuccess(editingEvent ? 'Event updated!' : 'Event created successfully!');
        setFormData({
          title: '', description: '', datetime: '', child_id: '', location: '', duration: '', reminder_minutes: 30, color: '#3B82F6'
        });
        setShowForm(false);
        setEditingEvent(null);
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save event');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      datetime: event.datetime?.slice(0, 16),
      child_id: event.child_id,
      location: event.location || '',
      duration: event.duration || '',
      reminder_minutes: event.reminder_minutes || 30,
      color: event.color || '#3B82F6'
    });
    setShowForm(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        const res = await eventAPI.delete(id);
        if (res.ok) {
          setSuccess('Event deleted');
          loadData();
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to delete');
        }
      } catch (err) {
        setError('Network error');
      }
    }
  };

  const filteredEvents = selectedChild === 'all' 
    ? events 
    : events.filter(e => e.child_id === parseInt(selectedChild));

  const getChildName = (childId) => {
    const child = children.find(c => c.id === childId);
    return child ? child.name : 'Unknown';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="animate-pulse text-gray-500">Loading events...</div>
        </div>
      </div>
    );
  }

  const upcomingEvents = filteredEvents.filter(e => new Date(e.datetime) >= new Date());
  const pastEvents = filteredEvents.filter(e => new Date(e.datetime) < new Date());

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <h2 className="text-xl font-bold text-gray-800">📅 Event Planner</h2>
        <div className="flex gap-3">
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-3 py-1 border rounded-lg"
          >
            <option value="all">All Children</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              + Create Event
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"> {error}</div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg"> {success}</div>
      )}
      
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-3">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.datetime}
                onChange={(e) => setFormData({...formData, datetime: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Child *</label>
              <select
                value={formData.child_id}
                onChange={(e) => setFormData({...formData, child_id: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select a child</option>
                {children.map(child => (
                  <option key={child.id} value={child.id}>{child.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., School, Doctor's office, Park"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reminder (minutes before)</label>
              <select
                value={formData.reminder_minutes}
                onChange={(e) => setFormData({...formData, reminder_minutes: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="5">5 minutes before</option>
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
                <option value="120">2 hours before</option>
                <option value="1440">1 day before</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="w-full h-10 border rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                placeholder="Additional details about the event..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingEvent(null); }} className="bg-gray-300 px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {/* Upcoming Events */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3"> Upcoming Events ({upcomingEvents.length})</h3>
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No upcoming events scheduled</p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div key={event.id} className="border-l-4 rounded-lg p-3 bg-white shadow-sm" style={{ borderLeftColor: event.color || '#3B82F6' }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-gray-600"> {formatDate(event.datetime)}</p>
                    <p className="text-sm text-gray-600"> For: {getChildName(event.child_id)}</p>
                    {event.location && <p className="text-sm text-gray-600"> {event.location}</p>}
                    {event.description && <p className="text-sm text-gray-500 mt-1">{event.description}</p>}
                    {event.reminder_minutes && (
                      <p className="text-xs text-blue-600 mt-1"> Reminder: {event.reminder_minutes} minutes before</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(event)} className="text-blue-500 hover:text-blue-700">Edit</button>
                    <button onClick={() => handleDelete(event.id, event.title)} className="text-red-500 hover:text-red-700">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3"> Past Events ({pastEvents.length})</h3>
          <div className="space-y-2 opacity-75">
            {pastEvents.map(event => (
              <div key={event.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-gray-500">{formatDate(event.datetime)}</p>
                    <p className="text-sm text-gray-500">For: {getChildName(event.child_id)}</p>
                  </div>
                  <button onClick={() => handleDelete(event.id, event.title)} className="text-red-500 text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPlanner;
