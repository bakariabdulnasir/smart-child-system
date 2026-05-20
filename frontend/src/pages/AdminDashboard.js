import React, { useEffect, useState } from "react";
import {
  Bell,
  LogOut,
  Users,
  User,
  Shield,
  Trash2,
  AlertCircle,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(data.data.users);
      } else {
        showError(data.message || "Failed to load users");
      }
    } catch (error) {
      showError("Network error - is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        const response = await adminAPI.deleteUser(userId);
        const data = await response.json();
        if (response.ok && data.success) {
          showSuccess("User deleted successfully");
          fetchUsers(); // Refresh the list
        } else {
          showError(data.message || "Failed to delete user");
        }
      } catch (error) {
        showError("Network error");
      }
    }
  };

  const showSuccess = (text) => {
    setMessage({ text, type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const showError = (text) => {
    setMessage({ text, type: "error" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-indigo-600">Smart Child Admin</h1>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button className="text-indigo-600">Admin Dashboard</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/dashboard")} 
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-5">
            <Bell className="text-gray-500" size={20} />
            <div className="flex items-center gap-2">
              {user?.profile_image ? (
                <img 
                  src={user.profile_image} 
                  alt="profile" 
                  className="w-10 h-10 rounded-full object-cover" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="text-indigo-600" size={20} />
                </div>
              )}
              <span className="font-medium">{user?.full_name || "Admin"}</span>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                Admin
              </span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ========================= HERO ========================= */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-8 text-white mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-3">
            Welcome back, {user?.full_name || "Admin"}!
          </h1>
          <p className="text-lg opacity-90">
            You have {users.length} registered users in the system.
          </p>
        </div>

        {/* ========================= USER MANAGEMENT ========================= */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="text-indigo-600" />
              All Users
            </h2>
            <span className="text-gray-500">{users.length} users total</span>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No users found in the system.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem) => (
                    <tr key={userItem.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{userItem.id}</td>
                      <td className="py-3 px-4 font-medium">{userItem.full_name}</td>
                      <td className="py-3 px-4 text-gray-600">{userItem.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          userItem.role === 'admin' 
                            ? 'bg-red-100 text-red-600'
                            : userItem.role === 'parent'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          userItem.is_active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {userItem.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(userItem.id, userItem.full_name)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
