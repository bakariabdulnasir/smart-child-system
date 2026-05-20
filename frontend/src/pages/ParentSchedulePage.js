import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const ParentSchedulePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Parent Schedule Page</h1>
    </div>
  );
};

const [events, setEvents] = useState([]);

useEffect(() => {
  loadEvents();
}, []);

const loadEvents = async () => {
  const res = await apiFetch("/events");
  const data = await res.json();
  setEvents(data.data || []);
};

return (
  <div>
    {events?.length > 0 ? (
      events.map((event) => (
        <div key={event.id}>
          {event.title}
        </div>
      ))
    ) : (
      <p>No events found</p>
    )}
  </div>
);

const [form, setForm] = useState({
  title: "",
  event_date: "",
  location: "",
  description: ""
});

const handleSubmit = async (e) => {
  e.preventDefault();

  await apiFetch("/events", {
    method: "POST",
    body: JSON.stringify(form)
  });

  loadEvents();
};

export default ParentSchedulePage;