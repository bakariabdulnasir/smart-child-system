import React, { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  ClipboardList,
  LogOut,
  Users,
  User,
  Plus,
  CheckCircle,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Use authUser from context which now contains full_name from login
  const user = authUser;
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
// Modal states
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
// Form states - backend requires full_name, age (integer), gender ("male"/"female")
const [childForm, setChildForm] = useState({ name: "", age: "", school: "", medical_notes: "", gender: "male", profile_image: "", allergies: "", emergency_contact: "", emergency_phone: "" });
  // Event: use event_date instead of datetime (backend expects event_date)
  const [eventForm, setEventForm] = useState({ title: "", event_date: "", location: "", description: "", child_id: "" });
  // Task: use due_date instead of deadline, add child_id (backend requires child_id)
  const [taskForm, setTaskForm] = useState({ title: "", due_date: "", priority: "medium", child_id: "" });
  // Schedule: add schedule form with required fields
  const [scheduleForm, setScheduleForm] = useState({ title: "", description: "", start_time: "", end_time: "", child_id: "" });
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", role: "friend" });
  
const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

useEffect(() => {
    const timer = setTimeout(() => {
      // Force stop loading after 10 seconds
      if (loading) {
        setDashboardData({
          counts: { events: 0, pending_tasks: 0, children: 0, notifications: 0 },
          children: [],
          recent_tasks: [],
          upcoming_events: [],
          trusted_contacts: [],
          recent_notifications: []
        });
        setLoading(false);
      }
    }, 10000);
    
    fetchDashboard();
    
    return () => clearTimeout(timer);
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
      console.log("Fetching dashboard data...");
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/dashboard/summary', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Dashboard API Response:", result);
        
        if (result.success && result.data) {
          setDashboardData(result.data);
        } else {
          setDashboardData({
            counts: { events: 0, pending_tasks: 0, children: 0, notifications: 0 },
            children: [],
            recent_tasks: [],
            upcoming_events: [],
            trusted_contacts: [],
            recent_notifications: []
          });
        }
      } else {
        setDashboardData({
          counts: { events: 0, pending_tasks: 0, children: 0, notifications: 0 },
          children: [],
          recent_tasks: [],
          upcoming_events: [],
          trusted_contacts: [],
          recent_notifications: []
        });
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      setDashboardData({
        counts: { events: 0, pending_tasks: 0, children: 0, notifications: 0 },
        children: [],
        recent_tasks: [],
        upcoming_events: [],
        trusted_contacts: [],
        recent_notifications: []
      });
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (text) => {
    setMessage({ text, type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    fetchDashboard(); // Refresh data
  };

  const showError = (text) => {
    setMessage({ text, type: "error" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

// Add Child
  const handleAddChild = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Backend expects: full_name, age (integer), gender ("male" or "female")
      // Include ALL fields including medical_notes, school, allergies, emergency contact
      const childData = {
        full_name: childForm.name,
        age: parseInt(childForm.age),
        gender: childForm.gender,
        profile_image: childForm.profile_image || null,
        school: childForm.school || null,
        medical_notes: childForm.medical_notes || null,
        allergies: childForm.allergies || null,
        emergency_contact: childForm.emergency_contact || null,
        emergency_phone: childForm.emergency_phone || null
      };
      const response = await apiFetch("/children", {
        method: "POST",
        body: JSON.stringify(childData),
      });
      if (response.ok) {
        showSuccess("Child added successfully!");
        setChildForm({ name: "", age: "", school: "", medical_notes: "", gender: "male", profile_image: "", allergies: "", emergency_contact: "", emergency_phone: "" });
        setShowAddChildModal(false);
        fetchDashboard(); // Refresh to show new child
} else {
        const err = await response.json();
        showError(err.message || err.error || "Failed to add child");
      }
    } catch (error) {
      showError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

// Create Event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Backend expects event_date (not datetime), include child_id
      const eventData = {
        title: eventForm.title,
        event_date: eventForm.event_date,
        location: eventForm.location,
        description: eventForm.description,
        child_id: eventForm.child_id
      };
      const response = await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify(eventData),
      });
      if (response.ok) {
        showSuccess("Event created successfully!");
        setEventForm({ title: "", event_date: "", location: "", description: "", child_id: "" });
        setShowCreateEventModal(false);
} else {
        const err = await response.json();
        showError(err.message || err.error || "Failed to create event");
      }
    } catch (error) {
      showError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

// Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Backend expects due_date (not deadline) and child_id is required
      const taskData = {
        title: taskForm.title,
        due_date: taskForm.due_date,
        priority: taskForm.priority,
        child_id: taskForm.child_id,
        status: "pending"
      };
      const response = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify(taskData),
      });
      if (response.ok) {
        showSuccess("Task added successfully!");
        setTaskForm({ title: "", due_date: "", priority: "medium", child_id: "" });
        setShowAddTaskModal(false);
} else {
        const err = await response.json();
        showError(err.message || err.error || "Failed to add task");
      }
    } catch (error) {
      showError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  // Add Schedule
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Backend expects start_time, end_time, child_id required
      const scheduleData = {
        title: scheduleForm.title,
        description: scheduleForm.description,
        start_time: scheduleForm.start_time,
        end_time: scheduleForm.end_time,
        child_id: scheduleForm.child_id
      };
      const response = await apiFetch("/schedules", {
        method: "POST",
        body: JSON.stringify(scheduleData),
      });
      if (response.ok) {
        showSuccess("Schedule added successfully!");
        setScheduleForm({ title: "", description: "", start_time: "", end_time: "", child_id: "" });
        setShowScheduleModal(false);
} else {
        const err = await response.json();
        showError(err.message || err.error || "Failed to add schedule");
      }
    } catch (error) {
      showError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  // Add Contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await apiFetch("/trusted-contacts", {
        method: "POST",
        body: JSON.stringify(contactForm),
      });
      if (response.ok) {
        showSuccess("Contact added successfully!");
        setContactForm({ name: "", phone: "", email: "", role: "friend" });
        setShowAddContactModal(false);
} else {
        const err = await response.json();
        showError(err.message || err.error || "Failed to add contact");
      }
    } catch (error) {
      showError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading Dashboard...</h1>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Failed To Load Dashboard</h1>
      </div>
    );
  }

  const { counts, children, recent_tasks, upcoming_events, trusted_contacts, recent_notifications } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Message Toast */}
      {message.text && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
          message.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}>
          {message.text}
        </div>
      )}

      {/* ========================= NAVBAR ========================= */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
<h1 className="text-2xl font-bold text-indigo-600">Smart Child</h1>
<div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button className="text-indigo-600">Dashboard</button>
              <button onClick={() => navigate('/schedule')} className="text-gray-500 hover:text-indigo-600">Schedule</button>
<button onClick={() => navigate('/tasks')} className="text-gray-500 hover:text-indigo-600">Tasks</button>
              <button onClick={() => navigate('/family')} className="text-gray-500 hover:text-indigo-600">Family</button>
              <button onClick={() => navigate('/amenities')} className="text-gray-500 hover:text-indigo-600">Amenities</button>
              {user?.role === 'admin' && (
                <button onClick={() => navigate('/admin')} className="text-red-500 hover:text-red-600">Admin</button>
              )}
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
              <span className="font-medium">{user?.full_name || user?.email || "User"}</span>
            </div>
            <button onClick={logout} className="flex items-center gap-2 text-red-500">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ========================= HERO ========================= */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-3">
            Welcome back, {user?.full_name || "Parent"}!
          </h1>
          <p className="text-lg opacity-90">
            Your family's day is looking productive. You have {counts.events} upcoming events and{" "}
            {counts.pending_tasks} pending tasks.
          </p>
        </div>

        {/* ========================= STATS ========================= */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Upcoming Events" value={counts.events} subtitle="This Week" icon={<Calendar />} />
          <StatCard title="Pending Tasks" value={counts.pending_tasks} subtitle="High Priority" icon={<ClipboardList />} />
          <StatCard title="Children Tracked" value={counts.children} subtitle="Active Profiles" icon={<Users />} />
          <StatCard title="Notifications" value={counts.notifications} subtitle="Recent Alerts" icon={<Bell />} />
        </div>

{/* ========================= QUICK ACTIONS ========================= */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-5 gap-5">
            <QuickAction title="Add Child" icon={<Users />} onClick={() => setShowAddChildModal(true)} />
            <QuickAction title="Create Event" icon={<Calendar />} onClick={() => setShowCreateEventModal(true)} />
            <QuickAction title="Add Task" icon={<ClipboardList />} onClick={() => setShowAddTaskModal(true)} />
            <QuickAction title="Add Schedule" icon={<Calendar />} onClick={() => setShowScheduleModal(true)} />
            <QuickAction title="Add Contact" icon={<Plus />} onClick={() => setShowAddContactModal(true)} />
          </div>
        </div>

        {/* ========================= CHILDREN ========================= */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Our Children</h2>
<div className="grid md:grid-cols-2 gap-6">
            {children.length > 0 ? (
              children.map((child) => (
                <div key={child.id} className="bg-white rounded-3xl overflow-hidden shadow-sm">
                  {child.profile_image ? (
                    <img
                      src={child.profile_image.startsWith('http') ? child.profile_image : `http://localhost:5000/${child.profile_image}`}
                      alt={child.full_name || child.name}
                      className="w-full h-60 object-cover"
                    />
                  ) : (
                    <div className="w-full h-60 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                      <User className="w-20 h-20 text-indigo-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-2xl font-bold">{child.full_name || child.name}</h3>
                        <p className="text-gray-500">{child.age} Years Old</p>
                      </div>
                      <User className="text-pink-500" />
                    </div>
                    <p className="text-gray-600 mb-6">{child.medical_notes || "No medical notes available."}</p>
                    <button 
                      onClick={() => navigate(`/child/${child.id}`)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-2xl font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-sm text-center text-gray-500">No children found</div>
            )}
          </div>
        </div>

        {/* ========================= TASKS & EVENTS ========================= */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* TASKS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Recent Tasks</h2>
            <div className="space-y-4">
              {recent_tasks.length > 0 ? (
                recent_tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between border rounded-2xl p-4">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-500">{task.status}</p>
                    </div>
                    <CheckCircle className={task.status === "completed" ? "text-green-500" : "text-orange-400"} />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No tasks available</p>
              )}
            </div>
          </div>

          {/* EVENTS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              {upcoming_events.length > 0 ? (
                upcoming_events.map((event) => (
                  <div key={event.id} className="border rounded-2xl p-4">
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-gray-500 text-sm">{event.location}</p>
                    <p className="text-gray-400 text-xs mt-1">{event.datetime}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No upcoming events</p>
              )}
            </div>
          </div>
        </div>

        {/* ========================= CONTACTS ========================= */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-10">
          <h2 className="text-2xl font-bold mb-6">Trusted Contacts</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {trusted_contacts.length > 0 ? (
              trusted_contacts.map((contact) => (
                <div key={contact.id} className="border rounded-2xl p-5">
                  <h3 className="font-bold text-lg">{contact.name}</h3>
                  <p className="text-gray-500">{contact.phone}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2">No trusted contacts found</p>
            )}
          </div>
        </div>

        {/* ========================= NOTIFICATIONS ========================= */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Recent Notifications</h2>
          <div className="space-y-4">
            {recent_notifications.length > 0 ? (
              recent_notifications.map((notification) => (
                <div key={notification.id} className="border rounded-2xl p-4">
                  {notification.message}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No notifications</p>
            )}
          </div>
        </div>
      </div>

      {/* ========================= MODALS ========================= */}

{/* Add Child Modal - Backend requires: full_name, age (integer), gender ("male"/"female") */}
      {showAddChildModal && (
        <Modal title="Add New Child" onClose={() => setShowAddChildModal(false)} onSubmit={handleAddChild} submitting={submitting}>
          <input type="text" placeholder="Child's Name" value={childForm.name} onChange={(e) => setChildForm({ ...childForm, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required />
          <input type="number" placeholder="Age" value={childForm.age} onChange={(e) => setChildForm({ ...childForm, age: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required />
          {/* Gender is required by backend */}
          <select value={childForm.gender} onChange={(e) => setChildForm({ ...childForm, gender: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="text" placeholder="School" value={childForm.school} onChange={(e) => setChildForm({ ...childForm, school: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" />
<textarea placeholder="Medical Notes (optional)" value={childForm.medical_notes} onChange={(e) => setChildForm({ ...childForm, medical_notes: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows="3" />
          <input type="text" placeholder="Allergies (optional)" value={childForm.allergies} onChange={(e) => setChildForm({ ...childForm, allergies: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" />
          <input type="text" placeholder="Emergency Contact Name (optional)" value={childForm.emergency_contact} onChange={(e) => setChildForm({ ...childForm, emergency_contact: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" />
          <input type="tel" placeholder="Emergency Phone (optional)" value={childForm.emergency_phone} onChange={(e) => setChildForm({ ...childForm, emergency_phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" />
          <input type="url" placeholder="Profile Image URL (optional - paste image link)" value={childForm.profile_image} onChange={(e) => setChildForm({ ...childForm, profile_image: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
        </Modal>
      )}

{/* Create Event Modal */}
      {showCreateEventModal && (
        <Modal title="Create New Event" onClose={() => setShowCreateEventModal(false)} onSubmit={handleCreateEvent} submitting={submitting}>
          <input type="text" placeholder="Event Title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required />
          {/* Backend expects event_date, not datetime */}
          <input type="datetime-local" value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required />
          <input type="text" placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required />
          {/* Add child selection for events (child_id is needed for family events) */}
<select value={eventForm.child_id} onChange={(e) => setEventForm({ ...eventForm, child_id: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required>
            <option value="">Select Child</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.full_name || child.name}</option>
            ))}
          </select>
          <textarea placeholder="Description (optional)" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows="3" />
        </Modal>
      )}

{/* Add Task Modal */}
      {showAddTaskModal && (
        <Modal title="Add New Task" onClose={() => setShowAddTaskModal(false)} onSubmit={handleAddTask} submitting={submitting}>
          <input type="text" placeholder="Task Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required />
          {/* Backend expects due_date, not deadline */}
          <input type="date" placeholder="Due Date" value={taskForm.due_date} onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" />
{/* child_id is required by backend */}
          <select value={taskForm.child_id} onChange={(e) => setTaskForm({ ...taskForm, child_id: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required>
            <option value="">Select Child</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.full_name || child.name}</option>
            ))}
          </select>
          <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </Modal>
      )}

{/* Add Contact Modal */}
      {showAddContactModal && (
        <Modal title="Add Trusted Contact" onClose={() => setShowAddContactModal(false)} onSubmit={handleAddContact} submitting={submitting}>
          <input type="text" placeholder="Contact Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required />
          <input type="tel" placeholder="Phone Number" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" />
          <input type="email" placeholder="Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" />
          <select value={contactForm.role} onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="babysitter">Babysitter</option>
            <option value="neighbor">Neighbor</option>
          </select>
        </Modal>
      )}

      {/* Add Schedule Modal */}
      {showScheduleModal && (
        <Modal title="Add New Schedule" onClose={() => setShowScheduleModal(false)} onSubmit={handleAddSchedule} submitting={submitting}>
          <input type="text" placeholder="Schedule Title" value={scheduleForm.title} onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required />
          {/* Backend requires start_time and end_time in ISO format */}
          <label className="text-sm text-gray-600 mb-1 block">Start Time</label>
          <input type="datetime-local" value={scheduleForm.start_time} onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required />
          <label className="text-sm text-gray-600 mb-1 block">End Time</label>
          <input type="datetime-local" value={scheduleForm.end_time} onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required />
{/* child_id is required by backend */}
          <select value={scheduleForm.child_id} onChange={(e) => setScheduleForm({ ...scheduleForm, child_id: e.target.value })} className="w-full px-4 py-2 border rounded-lg mb-3" required>
            <option value="">Select Child</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.full_name || child.name}</option>
            ))}
          </select>
          <textarea placeholder="Description (optional)" value={scheduleForm.description} onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows="3" />
        </Modal>
      )}
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{subtitle}</p>
          <h2 className="text-4xl font-bold mt-3">{value}</h2>
          <p className="text-gray-600 mt-2">{title}</p>
        </div>
        <div className="text-indigo-500">{icon}</div>
      </div>
    </div>
  );
};

const QuickAction = ({ title, icon, onClick }) => {
  return (
    <button onClick={onClick} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition text-center">
      <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
        {icon}
      </div>
      <p className="font-medium">{title}</p>
    </button>
  );
};

const Modal = ({ title, children, onClose, onSubmit, submitting }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6">
          {children}
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
