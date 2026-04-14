import { useState, useEffect } from "react";
import "./Calendar.css";
import CalendarApp from "../components/CalendarApp.jsx";
import useCreateUserEvent from "../customHooks/UseEventCreator.jsx"
// import CalUpcomingEvents  from "../components/CalUpcomingEvents.jsx";
import { useAuth } from "../../../app/AuthProvider.jsx";

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const mins = (m || 0) > 0 ? `:${String(m).padStart(2, "0")}` : "";
  return `${hour}${mins} ${ampm}`;
}


function timeToMinutes(timeStr) {
  if (!timeStr) return Infinity;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
}

export default function Calendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: "", time: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  // const [dayWorkouts, setDayWorkouts] = useState(null)
  const [userWorkouts, setUserWorkouts] = useState([]);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:8080/users/user_events/id/${user.id}`)
    .then((r) => r.json())
    .then((data) => setEvents(Array.isArray(data) ? data : []))
    .catch(() => setEvents([]));

    fetch(`http://localhost:8080/users/user_workouts/id/${user.id}`)
  .then((r) => r.json())
  .then((data) => setUserWorkouts(Array.isArray(data) ? data : []))
  .catch(() => setUserWorkouts([]));
  }, [user?.id]);

  // Clear selected day when month changes so the side panel doesn't show stale data
  function handleMonthChange(newDate) {
    setCurrentDate(newDate);
    setSelectedDay(null);
  }
  
  function getDaysAway(eventStartDate) {
    const eventDate = new Date(eventStartDate)
    const transferSelectedDate = new Date(selectedDate)

    const d1 = Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
    const d2 = Date.UTC(transferSelectedDate.getUTCFullYear(), transferSelectedDate.getUTCMonth(), transferSelectedDate.getUTCDate())

    const dayDiff = d1 - d2;
    const daysAway = Math.ceil(dayDiff / (1000 * 60 * 60 * 24));


    if (daysAway === 1) {
      return (<span className="event-time">Tomorrow</span>);
    }
    if (daysAway > 1  && daysAway <=7 ) return (<span className="event-time">{daysAway} days away</span>)
    return ""
  }
  
  const selectedDate =
  selectedDay != null ? new Date(Date.UTC(year, month, selectedDay)) : null;
  
  const upcomingDateWindowStart =
  selectedDay != null
  ? new Date(Date.UTC(year, month, selectedDay + 1))
  : null;
  const upcomingDateWindowEnd =
  selectedDay != null
  ? new Date(Date.UTC(year, month, selectedDay + 7))
  : null;
  
  
  
  const dayEvents = selectedDate
  ? events
    .filter((e) => {
      // const d = new Date(e.start_date);
      // return (
      //   d.getUTCFullYear() === selectedDate.getUTCFullYear() &&
      //   d.getUTCMonth() === selectedDate.getUTCMonth() &&
      //   d.getUTCDate() === selectedDate.getUTCDate()
      // );
      const eventDateStr = new Date(e.start_date)
        .toISOString()
        .split("T")[0]
      const selectedDateStr = selectedDate
        .toISOString()
        .split("T")[0];

      return eventDateStr === selectedDateStr
  })
  .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
  : [];
  
  const dayWorkouts = dayEvents.length > 0
    ? dayEvents.flatMap((event) => 
    (event.workouts_list || [])
      .map((workoutId) => userWorkouts.find((w) => w.id === workoutId))
      .filter(Boolean)
) : [];

  const upcomingWeekEvents = upcomingDateWindowStart && upcomingDateWindowEnd
  ? events
  .filter((e) => {
    const d = new Date(e.start_date).getTime();

    return (
      d >= upcomingDateWindowStart.getTime() &&
      d <= upcomingDateWindowEnd.getTime()
    );
  })
  .sort((a, b) => {
    const dateA = new Date(a.start_date)
    const dateB = new Date(b.start_date)
    const dateDiff = dateA - dateB;
    if (dateDiff !== 0) return dateDiff;

    return timeToMinutes(a.time) - timeToMinutes(b.time)
  })
  : [];
  
  async function handleDeleteEvent(id) {
    try {
      const res = await fetch(
        `http://localhost:8080/users/user_events/id/${id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
      }
    } catch {
      // silently fail — event stays in list if request fails
    } finally {
      setConfirmDeleteId(null);
    }
  }
  
  async function handleAddEvent(e) {
    const customFetch = useCreateUserEvent().submitEvent
    const eventObject = {
      name: "TestDataName",
      start_date: selectedDay,
      end_date: selectedDay,
      start_time: "test",
      end_time:"test",
      user_id: user.id
    };
    customFetch(eventObject)
    // e.preventDefault();
    // setSaveError("");
    // if (!form.name.trim() || !selectedDate || !user?.id) return;
    // setSaving(true);
    // try {
    //   const res = await fetch("http://localhost:8080/users/user_events", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       name: form.name.trim(),
    //       date: selectedDate.toISOString().split("T")[0],
    //       time: form.time || null,
    //       user_id: user.id,
    //     }),
    //   });
    //   if (res.ok) {
    //     const newEvent = await res.json();
    //     setEvents((prev) => [...prev, newEvent]);
    //     setForm({ name: "", time: "" });
    //   } else {
    //     const body = await res.json().catch(() => ({}));
    //     setSaveError(body.message || `Error ${res.status}`);
    //   }
    // } catch {
    //   setSaveError("Could not reach the server.");
    // } finally {
    //   setSaving(false);
    // }
  }
  
  const selectedLabel = selectedDate
  ? selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
  : null;
  
  const upcomingSelectedLabel = upcomingDateWindowStart
  ? upcomingDateWindowStart.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
  : null;
  


  return (
    <div className="calendar-page">
      {selectedDay === null ? (
        <></>
      ) : (
        <aside className="calendar-side-panel">
          <div className="panel-date-heading">Upcoming Events</div>
          {upcomingWeekEvents.length === 0 ? (
            <p className="no-events">No events yet.</p>
          ) : (
            <ul className="event-list upcoming-events" /*POSSIBLE UPDATE TO NEW DESIGN WITH WORKOUTS GREYED OUT*/ >
              {upcomingWeekEvents.map((ev) => (
                <li key={ev.id}>
                  <span className="event-name">{ev.name}</span>
                  {ev.time && <span className="event-time">{ev.time}</span>}
                  <span className="event-name">{getDaysAway(ev.start_date, selectedDate)}</span> {/*will resolve issue eventually*/}
                </li>
              ))}
            </ul>
          )}
        </aside>
      )}

      <div className="calendar-box">
        <CalendarApp
          currentDate={currentDate}
          onMonthChange={handleMonthChange}
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
          events={events}
          dayEvents={dayEvents}
          dayWorkouts={dayWorkouts}
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
                    {ev.time && (
                      <span className="event-time">{formatTime(ev.time)}</span>
                    )}
                    {confirmDeleteId === ev.id ? (
                      <span className="delete-confirm">
                        Remove?{" "}
                        <button onClick={() => handleDeleteEvent(ev.id)}>
                          Yes
                        </button>
                        <button onClick={() => setConfirmDeleteId(null)}>
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        className="delete-btn"
                        onClick={() => setConfirmDeleteId(ev.id)}
                      >
                        ✕
                      </button>
                    )}
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <input
                type="time"
                value={form.time}
                onChange={(e) =>
                  setForm((f) => ({ ...f, time: e.target.value }))
                }
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
