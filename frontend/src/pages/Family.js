import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Calendar, 
  ClipboardList, 
  LogOut, 
  Users, 
  User, 
  Plus, 
  X,
  Trash2,
  Edit,
  AlertCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

const Family = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  
  // Form state - backend expects: full_name, phone_number, relationship (required), email, address
  const [contactForm, setContactForm] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    relationship: '',
    address: '',
    is_emergency_contact: false
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/trusted-contacts');
      if (res.ok) {
        const data = await res.json();
        const contactList = data.data?.trusted_contacts || data.trusted_contacts || [];
        setContacts(contactList);
      }
    } catch (err) {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!contactForm.full_name || !contactForm.phone_number || !contactForm.relationship) {
      setError('Name, phone number, and relationship are required');
      return;
    }
    
    // Transform frontend field names to match backend schema
    const contactData = {
      full_name: contactForm.full_name,
      phone_number: contactForm.phone_number,
      email: contactForm.email || null,
      relationship: contactForm.relationship,
      address: contactForm.address || null,
      is_emergency_contact: contactForm.is_emergency_contact || false
    };
    
    try {
      let res;
      if (editingContact) {
        res = await apiFetch(`/trusted-contacts/${editingContact.id}`, {
          method: 'PUT',
          body: JSON.stringify(contactData)
        });
      } else {
        res = await apiFetch('/trusted-contacts', {
          method: 'POST',
          body: JSON.stringify(contactData)
        });
      }
      
      if (res.ok) {
        setSuccess(editingContact ? 'Contact updated successfully!' : 'Contact added successfully!');
        setContactForm({
          full_name: '',
          phone_number: '',
          email: '',
          relationship: '',
          address: '',
          is_emergency_contact: false
        });
        setShowForm(false);
        setEditingContact(null);
        fetchContacts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
const errorMsg = data.message || data.error || (data.errors && JSON.stringify(data.errors)) || 'Failed to save contact';
        setError(errorMsg);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setContactForm({
      full_name: contact.full_name || '',
      phone_number: contact.phone_number || '',
      email: contact.email || '',
      relationship: contact.relationship || '',
      address: contact.address || '',
      is_emergency_contact: contact.is_emergency_contact || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const res = await apiFetch(`/trusted-contacts/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setSuccess('Contact deleted successfully!');
          fetchContacts();
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to delete contact');
        }
      } catch (err) {
        setError('Network error');
      }
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingContact(null);
    setContactForm({
      full_name: '',
      phone_number: '',
      email: '',
      relationship: '',
      address: '',
      is_emergency_contact: false
    });
    setError('');
  };

  const getRelationshipColor = (relationship) => {
    switch (relationship?.toLowerCase()) {
      case 'family': return 'text-purple-600 bg-purple-50';
      case 'babysitter': return 'text-blue-600 bg-blue-50';
      case 'friend': return 'text-green-600 bg-green-50';
      case 'neighbor': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading Family Contacts...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Message Toast */}
      {error && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg bg-red-500 text-white flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg bg-green-500 text-white">
          {success}
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <h1 className="text-2xl font-bold text-indigo-600">Smart Child</h1>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
<button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-indigo-600">Dashboard</button>
              <button onClick={() => navigate('/schedule')} className="text-gray-500 hover:text-indigo-600">Schedule</button>
              <button onClick={() => navigate('/tasks')} className="text-gray-500 hover:text-indigo-600">Tasks</button>
              <button className="text-indigo-600">Family</button>
              <button onClick={() => navigate('/amenities')} className="text-gray-500 hover:text-indigo-600">Amenities</button>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Bell className="text-gray-500" size={20} />
<div className="flex items-center gap-2">
              {user?.profile_image ? (
                <img src={user.profile_image} alt="profile" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <span className="font-medium">{user?.full_name || "User"}</span>
            </div>
            <button onClick={logout} className="flex items-center gap-2 text-red-500">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Trusted Contacts</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} />
              Add Contact
            </button>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Contact Form */}
        {showForm && (
          <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={contactForm.full_name}
                    onChange={(e) => setContactForm({ ...contactForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={contactForm.phone_number}
                    onChange={(e) => setContactForm({ ...contactForm, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                  <select
                    value={contactForm.relationship}
                    onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="family">Family</option>
                    <option value="friend">Friend</option>
                    <option value="babysitter">Babysitter</option>
                    <option value="neighbor">Neighbor</option>
                    <option value="teacher">Teacher</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter email (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={contactForm.address}
                    onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter address (optional)"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contactForm.is_emergency_contact}
                      onChange={(e) => setContactForm({ ...contactForm, is_emergency_contact: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Emergency Contact</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
                  {editingContact ? 'Update Contact' : 'Save Contact'}
                </button>
                <button type="button" onClick={cancelForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contacts List */}
        {contacts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No trusted contacts found</p>
            <p className="text-sm">Click "Add Contact" to add family members, babysitters, or other trusted people.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {contacts.map(contact => (
              <div key={contact.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User size={24} className="text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{contact.full_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(contact.relationship)}`}>
                          {contact.relationship}
                        </span>
                      </div>
                      {contact.is_emergency_contact && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                          Emergency
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Phone size={14} />
                        {contact.phone_number}
                      </p>
                      {contact.email && (
                        <p className="flex items-center gap-2">
                          <Mail size={14} />
                          {contact.email}
                        </p>
                      )}
                      {contact.address && (
                        <p className="flex items-center gap-2">
                          <MapPin size={14} />
                          {contact.address}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit contact"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete contact"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Family;
