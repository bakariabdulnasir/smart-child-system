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
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { apiFetch } from "../services/api";



const Dashboard = () => {

  const { user, logout } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    fetchDashboard();

  }, []);



  const fetchDashboard = async () => {

    try {

      const response = await apiFetch(
        "/dashboard/summary"
      );

      const result = await response.json();

      console.log(result);

      if (result.success) {

        setDashboardData(result.data);
      }

    } catch (error) {

      console.error(
        "Dashboard Error:",
        error
      );

    } finally {

      setLoading(false);
    }
  };



  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-2xl font-bold">
          Loading Dashboard...
        </h1>

      </div>
    );
  }



  if (!dashboardData) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-2xl font-bold text-red-500">

          Failed To Load Dashboard

        </h1>

      </div>
    );
  }



  const {
    counts,
    children,
    recent_tasks,
    upcoming_events,
    trusted_contacts,
    recent_notifications,
  } = dashboardData;



  return (

    <div className="min-h-screen bg-gray-100">


      {/* ========================= NAVBAR ========================= */}

      <nav className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-10">

            <h1 className="text-2xl font-bold text-indigo-600">

              Smart Child

            </h1>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium">

              <button className="text-indigo-600">
                Dashboard
              </button>

              <button className="text-gray-500 hover:text-indigo-600">
                Schedule
              </button>

              <button className="text-gray-500 hover:text-indigo-600">
                Tasks
              </button>

              <button className="text-gray-500 hover:text-indigo-600">
                Family
              </button>

            </div>
          </div>



          <div className="flex items-center gap-5">

            <Bell
              className="text-gray-500"
              size={20}
            />

            <div className="flex items-center gap-2">

              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="w-10 h-10 rounded-full"
              />

              <span className="font-medium">

                {user?.full_name || "User"}

              </span>
            </div>



            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-500"
            >

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

            Welcome back,
            {" "}
            {user?.full_name || "Parent"}!

          </h1>

          <p className="text-lg opacity-90">

            Your family's day is looking productive.

            You have
            {" "}
            {counts.events}
            {" "}
            upcoming events and
            {" "}
            {counts.pending_tasks}
            {" "}
            pending tasks.

          </p>

        </div>



        {/* ========================= STATS ========================= */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <StatCard
            title="Upcoming Events"
            value={counts.events}
            subtitle="This Week"
            icon={<Calendar />}
          />

          <StatCard
            title="Pending Tasks"
            value={counts.pending_tasks}
            subtitle="High Priority"
            icon={<ClipboardList />}
          />

          <StatCard
            title="Children Tracked"
            value={counts.children}
            subtitle="Active Profiles"
            icon={<Users />}
          />

          <StatCard
            title="Notifications"
            value={counts.notifications}
            subtitle="Recent Alerts"
            icon={<Bell />}
          />

        </div>



        {/* ========================= QUICK ACTIONS ========================= */}

        <div className="mb-10">

          <h2 className="text-2xl font-bold mb-6">

            Quick Actions

          </h2>

          <div className="grid md:grid-cols-4 gap-5">

            <QuickAction
              title="Add Child"
              icon={<Users />}
            />

            <QuickAction
              title="Create Event"
              icon={<Calendar />}
            />

            <QuickAction
              title="Add Task"
              icon={<ClipboardList />}
            />

            <QuickAction
              title="Add Contact"
              icon={<Plus />}
            />

          </div>
        </div>



        {/* ========================= CHILDREN ========================= */}

        <div className="mb-10">

          <h2 className="text-2xl font-bold mb-6">

            Our Children

          </h2>


          <div className="grid md:grid-cols-2 gap-6">

            {children.length > 0 ? (

              children.map((child) => (

                <div
                  key={child.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm"
                >

                  <img
                    src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&auto=format&fit=crop"
                    alt="child"
                    className="w-full h-60 object-cover"
                  />

                  <div className="p-6">

                    <div className="flex justify-between items-start mb-3">

                      <div>

                        <h3 className="text-2xl font-bold">

                          {child.name}

                        </h3>

                        <p className="text-gray-500">

                          {child.age} Years Old

                        </p>

                      </div>

                      <User className="text-pink-500" />

                    </div>


                    <p className="text-gray-600 mb-6">

                      {child.medical_notes ||
                        "No medical notes available."}

                    </p>


                    <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-2xl font-medium">

                      View Details

                    </button>

                  </div>
                </div>
              ))

            ) : (

              <div className="bg-white rounded-3xl p-8 shadow-sm">

                No children found

              </div>
            )}
          </div>
        </div>



        {/* ========================= TASKS & EVENTS ========================= */}

        <div className="grid lg:grid-cols-2 gap-6 mb-10">


          {/* TASKS */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-2xl font-bold mb-6">

              Recent Tasks

            </h2>


            <div className="space-y-4">

              {recent_tasks.length > 0 ? (

                recent_tasks.map((task) => (

                  <div
                    key={task.id}
                    className="flex items-center justify-between border rounded-2xl p-4"
                  >

                    <div>

                      <h3 className="font-semibold">

                        {task.title}

                      </h3>

                      <p className="text-sm text-gray-500">

                        {task.status}

                      </p>

                    </div>


                    <CheckCircle
                      className={
                        task.status === "completed"
                          ? "text-green-500"
                          : "text-orange-400"
                      }
                    />

                  </div>
                ))

              ) : (

                <p>No tasks available</p>
              )}
            </div>
          </div>



          {/* EVENTS */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-2xl font-bold mb-6">

              Upcoming Events

            </h2>


            <div className="space-y-4">

              {upcoming_events.length > 0 ? (

                upcoming_events.map((event) => (

                  <div
                    key={event.id}
                    className="border rounded-2xl p-4"
                  >

                    <h3 className="font-semibold">

                      {event.title}

                    </h3>

                    <p className="text-gray-500 text-sm">

                      {event.location}

                    </p>

                    <p className="text-gray-400 text-xs mt-1">

                      {event.datetime}

                    </p>

                  </div>
                ))

              ) : (

                <p>No upcoming events</p>
              )}
            </div>
          </div>
        </div>



        {/* ========================= CONTACTS ========================= */}

        <div className="bg-white rounded-3xl p-6 shadow-sm mb-10">

          <h2 className="text-2xl font-bold mb-6">

            Trusted Contacts

          </h2>


          <div className="grid md:grid-cols-2 gap-5">

            {trusted_contacts.length > 0 ? (

              trusted_contacts.map((contact) => (

                <div
                  key={contact.id}
                  className="border rounded-2xl p-5"
                >

                  <h3 className="font-bold text-lg">

                    {contact.name}

                  </h3>

                  <p className="text-gray-500">

                    {contact.phone}

                  </p>

                </div>
              ))

            ) : (

              <p>No trusted contacts found</p>
            )}
          </div>
        </div>



        {/* ========================= NOTIFICATIONS ========================= */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">

            Recent Notifications

          </h2>


          <div className="space-y-4">

            {recent_notifications.length > 0 ? (

              recent_notifications.map((notification) => (

                <div
                  key={notification.id}
                  className="border rounded-2xl p-4"
                >

                  {notification.message}

                </div>
              ))

            ) : (

              <p>No notifications</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};



const StatCard = ({
  title,
  value,
  subtitle,
  icon,
}) => {

  return (

    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-gray-500 text-sm">

            {subtitle}

          </p>

          <h2 className="text-4xl font-bold mt-3">

            {value}

          </h2>

          <p className="text-gray-600 mt-2">

            {title}

          </p>

        </div>


        <div className="text-indigo-500">

          {icon}

        </div>

      </div>
    </div>
  );
};



const QuickAction = ({
  title,
  icon,
}) => {

  return (

    <button className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition text-center">

      <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">

        {icon}

      </div>

      <p className="font-medium">

        {title}

      </p>

    </button>
  );
};



export default Dashboard;