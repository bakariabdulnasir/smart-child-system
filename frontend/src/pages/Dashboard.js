import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Smart Child Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Hi, {user?.full_name}</span>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-1 rounded">Logout</button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Welcome to Smart Child</h2>
          <p>You are now logged in. Your dashboard will show upcoming events, tasks, and children's schedules soon.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
