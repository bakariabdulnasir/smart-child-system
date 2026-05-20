import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { ArrowLeft, Edit, Trash2, User, Phone, AlertCircle, Save, X } from "lucide-react";

const ChildDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "male",
    school: "",
    profile_image: "",
    medical_notes: "",
    allergies: "",
    emergency_contact: "",
    emergency_phone: ""
  });

  useEffect(() => {
    fetchChild();
  }, [id]);

  const fetchChild = async () => {
    setLoading(true);
    try {
const response = await apiFetch(`/children/${id}`);
      if (response.ok) {
        const result = await response.json();
        // Handle both response formats: {success: true, data: {child: {...}}} and {child: {...}}
        const childData = result.data?.child || result.child || result;
        setChild(childData);
        setFormData({
          full_name: childData.full_name || "",
          age: childData.age || "",
          gender: childData.gender || "male",
          school: childData.school || "",
          profile_image: childData.profile_image || "",
          medical_notes: childData.medical_notes || "",
          allergies: childData.allergies || "",
          emergency_contact: childData.emergency_contact || "",
          emergency_phone: childData.emergency_phone || ""
        });
      } else {
        setError("Failed to load child details");
      }
    } catch (err) {
      setError("Network error - is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (text) => {
    setSuccess(text);
    setTimeout(() => setSuccess(""), 3000);
  };

  const showError = (text) => {
    setError(text);
    setTimeout(() => setError(""), 3000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (child) {
      setFormData({
        full_name: child.full_name || "",
        age: child.age || "",
        gender: child.gender || "male",
        school: child.school || "",
        profile_image: child.profile_image || "",
        medical_notes: child.medical_notes || "",
        allergies: child.allergies || "",
        emergency_contact: child.emergency_contact || "",
        emergency_phone: child.emergency_phone || ""
      });
    }
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updateData = {
        full_name: formData.full_name,
        age: parseInt(formData.age),
        gender: formData.gender,
        school: formData.school,
        profile_image: formData.profile_image || null,
        medical_notes: formData.medical_notes,
        allergies: formData.allergies,
        emergency_contact: formData.emergency_contact,
        emergency_phone: formData.emergency_phone
      };

const response = await apiFetch(`/children/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateData)
      });

if (response.ok) {
        const result = await response.json();
        // Handle both response formats
        const updatedChild = result.data?.child || result.child || result;
        setChild(updatedChild);
        setIsEditing(false);
        showSuccess("Child updated successfully!");
      } else {
        const err = await response.json();
        showError(err.error || "Failed to update child");
      }
    } catch (err) {
      showError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${child.full_name}? This action cannot be undone.`)) {
      try {
        const response = await apiFetch(`/children/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          navigate("/dashboard");
        } else {
          const err = await response.json();
          showError(err.error || "Failed to delete child");
        }
      } catch (err) {
        showError("Network error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-500 text-xl">Loading child details...</div>
        </div>
      </div>
    );
  }

  if (error && !child) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Message Toast */}
      {success && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg bg-green-500 text-white">
          {success}
        </div>
      )}
      {error && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg bg-red-500 text-white">
          {error}
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-indigo-600">Child Profile</h1>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing && (
              <>
                <button 
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  <Edit size={18} />
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isEditing ? (
          /* Edit Mode - Form */
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Edit Child Profile</h2>
            <form onSubmit={handleSave}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    min="0"
                    max="18"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* School */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Profile Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                  <input
                    type="url"
                    value={formData.profile_image}
                    onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Emergency Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                  <input
                    type="tel"
                    value={formData.emergency_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Medical Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Notes</label>
                  <textarea
                    value={formData.medical_notes}
                    onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                    placeholder="Any medical conditions or important health information..."
                  />
                </div>

                {/* Allergies */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                    placeholder="Food allergies, medication allergies, environmental allergies..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  <Save size={18} />
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* View Mode - Display */
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
                {child.profile_image ? (
                  <img
                    src={child.profile_image.startsWith('http') ? child.profile_image : `http://localhost:5000/${child.profile_image}`}
                    alt={child.full_name}
                    className="w-40 h-40 rounded-full mx-auto mb-6 object-cover"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full mx-auto mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                    <User className="w-20 h-20 text-indigo-300" />
                  </div>
                )}
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{child.full_name}</h2>
                <p className="text-gray-500 text-lg mb-4">{child.age} Years Old</p>
                <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium capitalize">
                  {child.gender}
                </span>
              </div>
            </div>

            {/* Details Card */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="text-indigo-500" />
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm">School</p>
                    <p className="font-medium text-lg">{child.school || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Date Added</p>
                    <p className="font-medium text-lg">
                      {child.created_at ? new Date(child.created_at).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Phone className="text-red-500" />
                  Emergency Contact
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm">Contact Name</p>
                    <p className="font-medium text-lg">{child.emergency_contact || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Phone Number</p>
                    <p className="font-medium text-lg">{child.emergency_phone || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Medical Info */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <AlertCircle className="text-yellow-500" />
                  Medical Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm">Medical Notes</p>
                    <p className="font-medium text-lg">{child.medical_notes || "No medical notes"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Allergies</p>
                    <p className="font-medium text-lg">{child.allergies || "No known allergies"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildDetail;
