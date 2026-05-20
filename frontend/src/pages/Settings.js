import React, { useState, useEffect } from "react";
import {
  Bell,
  LogOut,
  User,
  Settings as SettingsIcon,
  Upload,
  Camera,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    profile_image: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfile();
      const data = await response.json();
      if (response.ok && data.success) {
        setProfileData({
          full_name: data.data.user.full_name || "",
          email: data.data.user.email || "",
          profile_image: data.data.user.profile_image || "",
        });
      }
    } catch (error) {
      showError("Failed to load profile");
    } finally {
      setLoading(false);
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
    setSaving(true);
    try {
      const response = await userAPI.updateProfile(profileData);
      const data = await response.json();
      if (response.ok && data.success) {
        showSuccess("Profile updated successfully!");
        // Update localStorage with new profile image
        if (profileData.profile_image) {
          localStorage.setItem("profile_image", profileData.profile_image);
        }
      } else {
        showError(data.message || "Failed to update profile");
      }
    } catch (error) {
      showError("Network error");
    } finally {
      setSaving(false);
    }
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
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-500 hover:text-indigo-600"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/schedule")}
                className="text-gray-500 hover:text-indigo-600"
              >
                Schedule
              </button>
              <button
                onClick={() => navigate("/tasks")}
                className="text-gray-500 hover:text-indigo-600"
              >
                Tasks
              </button>
<button
                onClick={() => navigate("/family")}
                className="text-gray-500 hover:text-indigo-600"
              >
                Family
              </button>
              <button
                onClick={() => navigate("/amenities")}
                className="text-gray-500 hover:text-indigo-600"
              >
                Amenities
              </button>
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-red-500 hover:text-red-600"
                >
                  Admin
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Bell className="text-gray-500" size={20} />
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 text-indigo-600"
            >
              <SettingsIcon size={18} />
              Settings
            </button>
            <div className="flex items-center gap-2">
              {profileData.profile_image ? (
                <img
                  src={profileData.profile_image}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="text-indigo-600" size={20} />
                </div>
              )}
              <span className="font-medium">
                {user?.full_name || "User"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* ========================= PROFILE SETTINGS ========================= */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="text-indigo-600" />
            Profile Settings
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {profileData.profile_image ? (
                  <img
                    src={profileData.profile_image}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-200">
                    <Camera className="w-16 h-16 text-indigo-400" />
                  </div>
                )}
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition shadow-lg"
                >
                  <Upload size={18} />
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // For demo purposes, use FileReader to get data URL
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProfileData({
                          ...profileData,
                          profile_image: reader.result,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Click the upload button to add a profile image
              </p>
            </div>

            {/* Image URL Alternative */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or paste an image URL
              </label>
              <input
                type="url"
                value={profileData.profile_image || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, profile_image: e.target.value })
                }
                placeholder="https://example.com/my-photo.jpg"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.full_name || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, full_name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profileData.email || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
