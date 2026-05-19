import React, { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  ClipboardList,
  LogOut,
  Plus,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";

export default function SmartChildDashboard() {
  const { user, logout } = useAuth();
  const [children, setChildren] = useState([]);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Fetch children
      try {
        const childrenRes = await apiFetch('/children');
        if (childrenRes.ok) {
          const data = await childrenRes.json();
          setChildren(Array.isArray(data) ? data : []);
        } else {
          setChildren([]);
        }
      } catch (err) {
        console.error('Failed to load children:', err);
        setChildren([]);
      }

      // Fetch events
      try {
        const eventsRes = await apiFetch('/events');
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(Array.isArray(data) ? data : []);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
        setEvents([]);
      }

      // Fetch tasks
      try {
        const tasksRes = await apiFetch('/tasks');
        if (tasksRes.ok) {
          const data = await tasksRes.json();
          setTasks(Array.isArray(data) ? data : []);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error('Failed to load tasks:', err);
        setTasks([]);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Safely filter events - ensure events is an array
  const upcomingEvents = Array.isArray(events) && events.length > 0 
    ? events.filter(e => e && new Date(e.datetime) >= new Date()).slice(0, 3)
    : [];

  // Safely filter tasks
  const pendingTasks = Array.isArray(tasks) && tasks.length > 0
    ? tasks.filter(t => t && t.status !== 'completed').slice(0, 4)
    : [];

  // Sample data for display when backend has no data
  const sampleSchedule = [
    {
      date: "24 OCT",
      title: "Pediatrician Appointment",
      place: "Dr. Smith • 2:30 PM",
      tag: "LEO",
    },
    {
      date: "24 OCT",
      title: "Soccer Practice",
      place: "Central Park • 4:00 PM",
      tag: "MIA",
    },
    {
      date: "25 OCT",
      title: "School Field Trip",
      place: "Museum of Art • 9:00 AM",
      tag: "LEO",
    },
  ];

  const sampleTasks = [
    "Sign permission slip for zoo trip",
    "Refill Mia's daily vitamins",
    "Review math homework with Leo",
    "Buy birthday gift for Toby's party",
  ];

  const stats = [
    {
      title: "Upcoming Events",
      value: upcomingEvents.length > 0 ? upcomingEvents.length : "3",
      subtitle: upcomingEvents.length > 0 ? "Next 24h" : "This Week",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks.length > 0 ? pendingTasks.length : "5",
      subtitle: "High Priority",
    },
    {
      title: "Children Tracked",
      value: children.length > 0 ? children.length : "2",
      subtitle: "Active Profiles",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">Loading your dashboard</div>
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Navbar */}
        <div className="flex items-center justify-between px-8 py-5 border-b">
          <div className="flex items-center gap-10">
            <h1 className="text-xl font-bold text-blue-600">Smart Child</h1>

            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <a href="#" className="text-blue-600">
                Dashboard
              </a>
              <a href="#">Schedule</a>
              <a href="#">Tasks</a>
              <a href="#">Family</a>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <Bell className="w-5 h-5 text-gray-500" />
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40"
                alt="user"
                className="w-9 h-9 rounded-full"
              />
              <span className="text-sm font-medium">{user?.full_name?.split(' ')[0] || 'Alex'}</span>
            </div>

            <button 
              onClick={logout}
              className="flex items-center gap-1 text-red-500 text-sm hover:text-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="p-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold">Welcome back, {user?.full_name?.split(' ')[0] || 'Alex'}!</h2>
            <p className="mt-2 text-sm opacity-90">
              Your family's day is looking productive. You have {upcomingEvents.length || 3} upcoming
              events and {pendingTasks.length || 5} tasks pending for today.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 border"
              >
                <p className="text-sm text-gray-500">{item.subtitle}</p>
                <h3 className="text-3xl font-bold mt-2">{item.value}</h3>
                <p className="text-gray-700 mt-1">{item.title}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-10">
            <h3 className="font-semibold text-lg mb-5">Quick Actions</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                {
                  title: "Add Child",
                  icon: <Users className="w-6 h-6" />,
                },
                {
                  title: "New Event",
                  icon: <Calendar className="w-6 h-6" />,
                },
                {
                  title: "Create Task",
                  icon: <ClipboardList className="w-6 h-6" />,
                },
                {
                  title: "Add Record",
                  icon: <Plus className="w-6 h-6" />,
                },
              ].map((action, i) => (
                <button
                  key={i}
                  className="bg-white border rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-md transition"
                >
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    {action.icon}
                  </div>
                  <span className="mt-3 text-sm font-medium">
                    {action.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mt-10">
            {/* Schedule */}
            <div className="bg-gray-50 rounded-2xl p-6 border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Upcoming Schedule</h3>
                <button className="text-blue-600 text-sm">
                  View Calendar
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {(upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => ({
                  date: event.datetime ? new Date(event.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : "TBD",
                  title: event.title || 'Untitled',
                  place: event.location || 'Location TBD',
                  tag: Array.isArray(children) && children.find(c => c?.id === event.child_id)?.name?.substring(0, 3).toUpperCase() || 'ALL'
                })) : sampleSchedule).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white p-4 rounded-xl"
                  >
                    <div className="flex gap-4">
                      <div className="bg-gray-100 rounded-lg px-3 py-2 text-center text-xs font-bold">
                        {item.date}
                      </div>

                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.place}</p>
                      </div>
                    </div>

                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div className="bg-gray-50 rounded-2xl p-6 border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Pending Tasks</h3>
                <button className="text-blue-600 text-sm">All Tasks</button>
              </div>

              <div className="mt-5 space-y-4">
                {(pendingTasks.length > 0 ? pendingTasks.map(task => task.title) : sampleTasks).map((task, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white p-4 rounded-xl"
                  >
                    <input type="checkbox" className="mt-1" />
                    <p className="text-sm text-gray-700">{task}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Children */}
          <div className="mt-10">
            <h3 className="font-semibold text-lg mb-5">Our Children</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {Array.isArray(children) && children.length > 0 ? children.map(child => (
                <div key={child.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={`https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&auto=format&fit=crop`}
                    alt={child.name}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{child.name}</h4>
                        <p className="text-sm text-gray-500">
                          Grade {Math.floor(child.age / 1)} • {child.age} Years Old
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-600">100%</p>
                        <p className="text-xs text-gray-400">Attendance</p>
                      </div>
                    </div>
                    {child.medical_notes && (
                      <p className="text-sm text-gray-500 mt-2">{child.medical_notes}</p>
                    )}
                    <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
                      View Details
                    </button>
                  </div>
                </div>
              )) : (
                <>
                  {/* Sample child cards when no data */}
                  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&auto=format&fit=crop"
                      alt="child"
                      className="h-56 w-full object-cover"
                    />
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">Leo</h4>
                          <p className="text-sm text-gray-500">Grade 2 • 7 Years Old</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-blue-600">100%</p>
                          <p className="text-xs text-gray-400">Attendance</p>
                        </div>
                      </div>
                      <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop"
                      alt="child"
                      className="h-56 w-full object-cover"
                    />
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">Mia</h4>
                          <p className="text-sm text-gray-500">Preschool • 4 Years Old</p>
                        </div>
                        <User className="text-pink-500" />
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Mia is currently focusing on creative arts and swimming lessons.
                      </p>
                      <button className="mt-5 w-full border border-gray-300 hover:bg-gray-100 py-3 rounded-xl">
                        View Details
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
