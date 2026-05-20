import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { Plus, X } from "lucide-react";

const ParentSchedulePage = () => {
  // ================= STATE =================
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    event_date: "",
    location: "",
    description: ""
  });

  // ================= LOAD EVENTS =================
  const loadEvents = async () => {
    try {
      const res = await apiFetch("/events");
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // ================= CREATE EVENT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiFetch("/events", {
      method: "POST",
      body: JSON.stringify(form)
    });

    setForm({
      title: "",
      event_date: "",
      location: "",
      description: ""
    });

    setShowModal(false);
    loadEvents();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parent Schedule Page</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {/* EVENTS */}
      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center text-gray-500 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">No events yet</h3>
          <p>Create your first schedule to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500"
            >
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-gray-600 text-sm">
                {event.event_date} • {event.location}
              </p>
              <p className="text-gray-500 mt-2 text-sm">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Add Event</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                className="w-full border p-2 rounded"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />

              <input
                type="datetime-local"
                className="w-full border p-2 rounded"
                value={form.event_date}
                onChange={(e) =>
                  setForm({ ...form, event_date: e.target.value })
                }
                required
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />

              <textarea
                className="w-full border p-2 rounded"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded"
              >
                Save Event
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ParentSchedulePage;