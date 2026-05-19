import React, { useState, useEffect } from 'react';
import { weekendAPI, childAPI } from '../services/api';

const WeekendPlanner = () => {
  const [weekendPlans, setWeekendPlans] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedChild, setSelectedChild] = useState('all');
  const [selectedWeekend, setSelectedWeekend] = useState(getThisWeekend());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    day: 'saturday',
    time: '10:00',
    duration: 60,
    child_id: '',
    location: '',
    recurring: false,
    recurring_type: 'weekly',
    family_activity: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function getThisWeekend() {
    const now = new Date();
    const saturday = new Date(now);
    const dayOfWeek = now.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    saturday.setDate(now.getDate() + daysUntilSaturday);
    return saturday.toISOString().split('T')[0];
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansRes, childrenRes] = await Promise.all([
        weekendAPI.getAll(),
        childAPI.getAll()
      ]);
      
      if (plansRes.ok) setWeekendPlans(await plansRes.json());
      if (childrenRes.ok) setChildren(await childrenRes.json());
    } catch (err) {
      setError('Failed to load weekend plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.title || !formData.time || !formData.child_id) {
      setError('Title, time, and child are required');
      return;
    }
    
    try {
      const planData = {
        ...formData,
        date: selectedWeekend,
        day_of_week: formData.day
      };
      
      let res;
      if (editingPlan) {
        res = await weekendAPI.update(editingPlan.id, planData);
      } else {
        res = await weekendAPI.create(planData);
      }
      
      if (res.ok) {
        setSuccess(editingPlan ? 'Weekend plan updated!' : 'Weekend activity added!');
        setFormData({
          title: '', description: '', day: 'saturday', time: '10:00', duration: 60,
          child_id: '', location: '', recurring: false, recurring_type: 'weekly',
          family_activity: false
        });
        setShowForm(false);
        setEditingPlan(null);
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description || '',
      day: plan.day || 'saturday',
      time: plan.time || '10:00',
      duration: plan.duration || 60,
      child_id: plan.child_id,
      location: plan.location || '',
      recurring: plan.recurring || false,
      recurring_type: plan.recurring_type || 'weekly',
      family_activity: plan.family_activity || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}" from weekend plans?`)) {
      try {
        const res = await weekendAPI.delete(id);
        if (res.ok) {
          setSuccess('Plan deleted');
          loadData();
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (err) {
        setError('Network error');
      }
    }
  };

  const filteredPlans = selectedChild === 'all' 
    ? weekendPlans 
    : weekendPlans.filter(p => p.child_id === parseInt(selectedChild));

  const saturdayPlans = filteredPlans.filter(p => p.day === 'saturday');
  const sundayPlans = filteredPlans.filter(p => p.day === 'sunday');

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const getChildName = (childId) => {
    const child = children.find(c => c.id === childId);
    return child ? child.name : 'Family Activity';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">Loading weekend plans...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <h2 className="text-xl font-bold text-gray-800">🎉 Weekend Activity Planner</h2>
        <div className="flex gap-3">
          <input
            type="date"
            value={selectedWeekend}
            onChange={(e) => setSelectedWeekend(e.target.value)}
            className="px-3 py-1 border rounded-lg"
          />
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
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
            >
              + Add Activity
            </button>
          )}
        </div>
      </div>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">⚠️ {error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg"> {success}</div>}
      
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-3">
            {editingPlan ? 'Edit Weekend Activity' : 'Plan Weekend Activity'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({...formData, day: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                step="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Child</label>
              <select
                value={formData.child_id}
                onChange={(e) => setFormData({...formData, child_id: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select a child</option>
                <option value="family">👨‍👩‍👧‍👦 Family Activity (All)</option>
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
                placeholder="Park, Museum, Home, etc."
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.recurring}
                  onChange={(e) => setFormData({...formData, recurring: e.target.checked})}
                />
                <span className="text-sm">Repeat weekly</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.family_activity}
                  onChange={(e) => setFormData({...formData, family_activity: e.target.checked})}
                />
                <span className="text-sm">Family activity</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                rows="2"
                placeholder="What's planned? Any special instructions?"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-lg">
              {editingPlan ? 'Update Plan' : 'Add to Weekend'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingPlan(null); }} className="bg-gray-300 px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {/* Weekend Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saturday Column */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-blue-100 p-3 font-semibold text-blue-800">Saturday</div>
          <div className="divide-y">
            {timeSlots.map(slot => {
              const activity = saturdayPlans.find(p => p.time === slot);
              return (
                <div key={`sat-${slot}`} className="p-2 min-h-[60px]">
                  <span className="text-xs text-gray-400 w-16 inline-block">{slot}</span>
                  {activity && (
                    <div className="inline-block ml-2">
                      <div className={`text-sm font-medium ${activity.family_activity ? 'text-purple-600' : 'text-gray-800'}`}>
                        {activity.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.location} • {activity.duration}min • {getChildName(activity.child_id)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Sunday Column */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-green-100 p-3 font-semibold text-green-800">Sunday</div>
          <div className="divide-y">
            {timeSlots.map(slot => {
              const activity = sundayPlans.find(p => p.time === slot);
              return (
                <div key={`sun-${slot}`} className="p-2 min-h-[60px]">
                  <span className="text-xs text-gray-400 w-16 inline-block">{slot}</span>
                  {activity && (
                    <div className="inline-block ml-2">
                      <div className={`text-sm font-medium ${activity.family_activity ? 'text-purple-600' : 'text-gray-800'}`}>
                        {activity.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.location} • {activity.duration}min • {getChildName(activity.child_id)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* List of planned activities */}
      {filteredPlans.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-3">📋 Planned Activities</h3>
          <div className="space-y-2">
            {filteredPlans.map(plan => (
              <div key={plan.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{plan.title}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                      {plan.day === 'saturday' ? 'Saturday' : 'Sunday'} at {plan.time}
                    </span>
                    {plan.recurring && <span className="text-xs text-green-600">🔄 Repeats weekly</span>}
                    {plan.family_activity && <span className="text-xs text-purple-600">👨‍👩‍👧‍👦 Family</span>}
                  </div>
                  <p className="text-sm text-gray-500">{plan.location} • {plan.duration} min • {getChildName(plan.child_id)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(plan)} className="text-blue-500 text-sm">Edit</button>
                  <button onClick={() => handleDelete(plan.id, plan.title)} className="text-red-500 text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekendPlanner;
