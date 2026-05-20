import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Trash2,
  Edit,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";

const Schedule = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    child_id: "",
  });

  useEffect(() => {
    fetchSchedules();
    fetchChildren();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/schedules", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data && result.data.schedules) {
          setSchedules(result.data.schedules);
        } else if (result.data && Array.isArray(result.data)) {
          setSchedules(result.data);
        } else {
          setSchedules([]);
        }
      } else {
        setSchedules([]);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/children", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data && result.data.children) {
          setChildren(result.data.children);
        } else if (result.data && Array.isArray(result.data)) {
          setChildren(result.data);
        } else {
          setChildren([]);
        }
      } else {
        setChildren([]);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
      setChildren([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const scheduleData = {
        title: formData.title,
        description: formData.description,
        start_time: formData.start_time,
        end_time: formData.end_time,
        child_id: formData.child_id,
      };

      let response;
      if (editingId) {
        response = await fetch(`http://localhost:5000/api/schedules/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(scheduleData),
        });
      } else {
        response = await apiFetch("/schedules", {
          method: "POST",
          body: JSON.stringify(scheduleData),
        });
      }

      if (response.ok) {
        showSuccess(editingId ? "Schedule updated!" : "Schedule created!");
        setShowModal(false);
        resetForm();
        fetchSchedules();
} else {
        const err = await response.json();
        showError(err.message || err.error || "Failed to save schedule");
      }
    } catch (error) {
      showError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    // Convert datetime from ISO format to datetime-local format (YYYY-MM-DDTHH:mm)
    const formatForInput = (dateStr) => {
      if (!dateStr) return "";
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        // Format as YYYY-MM-DDTHH:mm
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      } catch {
        return "";
      }
    };
    setFormData({
      title: schedule.title || "",
      description: schedule.description || "",
      start_time: formatForInput(schedule.start_time),
      end_time: formatForInput(schedule.end_time),
      child_id: schedule.child_id || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const response = await apiFetch(`/schedules/${scheduleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showSuccess("Schedule deleted!");
        fetchSchedules();
} else {
        const err = await response.json();
        showError(err.message || err.error || "Failed to delete schedule");
      }
    } catch (error) {
      showError("Network error");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      child_id: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const getChildName = (childId) => {
    const child = children.find((c) => c.id === childId);
    return child ? child.full_name || child.name : "Unknown";
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Message Toast */}
      {message.text && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {message.text}
        </div>
      )}

      {/* ========================= NAVBAR ========================= */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <h1 className="text-2xl font-bold text-indigo-600">Smart Child</h1>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="/dashboard" className="text-gray-500 hover:text-indigo-600">
                Dashboard
              </a>
<button className="text-indigo-600">Schedule</button>
              <a href="/dashboard" className="text-gray-500 hover:text-indigo-600">
                Tasks
              </a>
              <a href="/dashboard" className="text-gray-500 hover:text-indigo-600">
                Family
              </a>
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
        {/* ========================= HEADER ========================= */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Schedule</h1>
            <p className="text-gray-500 mt-1">
              Manage your children's activities and appointments
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add Schedule
          </button>
        </div>

        {/* ========================= SCHEDULE LIST ========================= */}
        {loading ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-bold">Loading schedules...</h2>
          </div>
        ) : schedules.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">
              No schedules yet
            </h2>
            <p className="text-gray-500 mb-6">
              Add your first schedule to get started
            </p>
            <button
              onClick={openAddModal}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add Schedule
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Clock className="text-indigo-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{schedule.title}</h3>
                      <p className="text-sm text-gray-500">
                        {getChildName(schedule.child_id)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {schedule.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {schedule.description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={16} />
                    <span>Start: {formatDateTime(schedule.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={16} />
                    <span>End: {formatDateTime(schedule.end_time)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================= MODAL ========================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Schedule" : "Add New Schedule"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Child *
                  </label>
                  <select
                    value={formData.child_id}
                    onChange={(e) =>
                      setFormData({ ...formData, child_id: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Child</option>
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.full_name || child.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, end_time: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingId
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
