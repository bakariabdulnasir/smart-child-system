import React, { useState, useEffect } from 'react';
import { childAPI } from '../services/api';

const ChildManager = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: 'male',
    school: '',
    medical_notes: '',
    allergies: '',
    emergency_contact: '',
    emergency_phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadChildren();
  }, []);

const loadChildren = async () => {
    try {
      setLoading(true);
      const res = await childAPI.getAll();
      if (res.ok) {
        const response = await res.json();
        // Handle both direct array and {data: {children: []}} response formats
        if (response.data && response.data.children) {
          setChildren(response.data.children);
        } else if (Array.isArray(response)) {
          setChildren(response);
        } else {
          setChildren([]);
        }
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to load children');
      }
    } catch (err) {
      setError('Network error - is the backend running?');
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.full_name || !formData.age || !formData.gender) {
      setError('Name, age, and gender are required');
      return;
    }
    
    if (formData.age < 0 || formData.age > 18) {
      setError('Age must be between 0 and 18');
      return;
    }
    
    // Transform frontend field names to match backend schema
    const childData = {
      full_name: formData.full_name,
      age: parseInt(formData.age),
      gender: formData.gender,
      school: formData.school || null,
      medical_notes: formData.medical_notes || null,
      allergies: formData.allergies || null,
      emergency_contact: formData.emergency_contact || null,
      emergency_phone: formData.emergency_phone || null
    };
    
try {
      let res;
      if (editingChild) {
        res = await childAPI.update(editingChild.id, childData);
      } else {
        res = await childAPI.create(childData);
      }
      
if (res.ok) {
        setSuccess(editingChild ? 'Child updated successfully!' : 'Child added successfully!');
        setFormData({
          full_name: '', age: '', gender: 'male', school: '', medical_notes: '', allergies: '', emergency_contact: '', emergency_phone: ''
        });
        setShowForm(false);
        setEditingChild(null);
        loadChildren();
        setTimeout(() => setSuccess(''), 3000);
} else {
        const data = await res.json();
        // Handle API response format {success: false, error: message}
const errorMsg = data.message || data.error || (data.errors && JSON.stringify(data.errors)) || 'Failed to save child';
        setError(errorMsg);
      }
    } catch (err) {
      setError('Network error');
    }
  };

const handleEdit = (child) => {
    setEditingChild(child);
    setFormData({
      full_name: child.full_name || child.name || '',
      age: child.age,
      gender: child.gender || 'male',
      school: child.school || '',
      medical_notes: child.medical_notes || '',
      allergies: child.allergies || '',
      emergency_contact: child.emergency_contact || '',
      emergency_phone: child.emergency_phone || ''
    });
    setShowForm(true);
  };

const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name || 'this child'}?`)) {
      try {
        const res = await childAPI.delete(id);
        if (res.ok) {
          setSuccess(`${name || 'Child'} has been removed`);
          loadChildren();
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to delete child');
        }
      } catch (err) {
        setError('Network error');
      }
    }
  };

const cancelForm = () => {
    setShowForm(false);
    setEditingChild(null);
    setFormData({
      full_name: '', age: '', gender: 'male', school: '', medical_notes: '', allergies: '', emergency_contact: '', emergency_phone: ''
    });
    setError('');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="animate-pulse text-gray-500">Loading children profiles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800"> My Children</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            + Add Child
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
           {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
           {success}
        </div>
      )}
      
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-3">
            {editingChild ? 'Edit Child Profile' : 'Add New Child'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Child's Name *</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="18"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({...formData, school: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
              <input
                type="tel"
                value={formData.emergency_phone}
                onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical Notes</label>
              <textarea
                value={formData.medical_notes}
                onChange={(e) => setFormData({...formData, medical_notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Any medical conditions or notes..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
              <textarea
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Food allergies, medication allergies, etc."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
              {editingChild ? 'Update Child' : 'Save Child'}
            </button>
            <button type="button" onClick={cancelForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {children.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2"></div>
          <p>No children added yet.</p>
          <p className="text-sm">Click "Add Child" to create your first child profile.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {children.map(child => (
            <div key={child.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
<h3 className="font-semibold text-lg">{child.full_name || child.name}</h3>
                    <span className="text-sm text-gray-500">Age: {child.age}</span>
                    <span className="text-sm text-blue-600">{child.school}</span>
                  </div>
                  {child.medical_notes && (
                    <p className="text-sm text-yellow-600 mb-1"> Medical: {child.medical_notes}</p>
                  )}
                  {child.allergies && (
                    <p className="text-sm text-red-600 mb-1"> Allergies: {child.allergies}</p>
                  )}
                  {(child.emergency_contact || child.emergency_phone) && (
                    <p className="text-sm text-gray-600">
                       Emergency: {child.emergency_contact} {child.emergency_phone ? `(${child.emergency_phone})` : ''}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(child)}
                    className="text-blue-500 hover:text-blue-700 px-2 py-1"
                  >
                    Edit
                  </button>
<button
                    onClick={() => handleDelete(child.id, child.full_name || child.name)}
                    className="text-red-500 hover:text-red-700 px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildManager;
