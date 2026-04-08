import { useState, useEffect } from "react";
import "./Calendar.css";
<<<<<<< HEAD
import CalendarApp from "../programs/CalendarApp.jsx";
import { useAuth } from "../../../app/AuthProvider.jsx";
=======
import CalendarApp from "../components/CalendarApp.jsx";
>>>>>>> b4dcd50 (updated Calendar display, built temp to-do list)

export default function Calendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: "", time: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/users/user_events/id/${user.id}`)
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]));
  }, [user?.id]);

  // Clear selected day when month changes so the side panel doesn't show stale data
  function handleMonthChange(newDate) {
    setCurrentDate(newDate);
    setSelectedDay(null);
  }

  const selectedDate =
    selectedDay != null ? new Date(Date.UTC(year, month, selectedDay)) : null;

  const dayEvents = selectedDate
    ? events.filter((e) => {
        const d = new Date(e.date);
        return (
          d.getUTCFullYear() === selectedDate.getUTCFullYear() &&
          d.getUTCMonth() === selectedDate.getUTCMonth() &&
          d.getUTCDate() === selectedDate.getUTCDate()
        );
      })
    : [];

  async function handleAddEvent(e) {
    e.preventDefault();
    setSaveError("");
    if (!form.name.trim() || !selectedDate || !user?.id) return;
    setSaving(true);
    try {
      const res = await fetch("/api/users/user_events/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          date: selectedDate.toISOString().split("T")[0],
          time: form.time || null,
          user_id: user.id,
        }),
      });
      if (res.ok) {
        const newEvent = await res.json();
        setEvents((prev) => [...prev, newEvent]);
        setForm({ name: "", time: "" });
      } else {
        const body = await res.json().catch(() => ({}));
        setSaveError(body.message || `Error ${res.status}`);
      }
    } catch {
      setSaveError("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  }

  const selectedLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  return (
    <div className="calendar-page">
      <div className="calendar-box">
        <CalendarApp
          currentDate={currentDate}
          onMonthChange={handleMonthChange}
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
          events={events}
        />
      </div>

      <aside className="calendar-side-panel">
        {selectedDay == null ? (
          <p className="panel-empty">Select a day to see or add events.</p>
        ) : (
          <>
            <div className="panel-date-heading">{selectedLabel}</div>

            {dayEvents.length === 0 ? (
              <p className="no-events">No events yet.</p>
            ) : (
              <ul className="event-list">
                {dayEvents.map((ev) => (
                  <li key={ev.id}>
                    <span className="event-name">{ev.name}</span>
                    {ev.time && <span className="event-time">{ev.time}</span>}
                  </li>
                ))}
              </ul>
            )}

            <form className="add-event-form" onSubmit={handleAddEvent}>
              <h3>Add Event</h3>
              <input
                type="text"
                placeholder="Event name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
              {saveError && <p className="save-error">{saveError}</p>}
              <button type="submit" disabled={saving || !form.name.trim()}>
                {saving ? "Saving..." : "Add Event"}
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}
