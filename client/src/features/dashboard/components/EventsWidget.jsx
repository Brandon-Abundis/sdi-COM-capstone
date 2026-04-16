import { useState, useEffect } from "react";
import { useAuth } from "../../../app/AuthProvider";
import { fetchUserEvents, fetchUserWorkouts } from "../api/userEvents";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const mins = (m || 0) > 0 ? `:${String(m).padStart(2, "0")}` : "";
  return `${hour}${mins} ${ampm}`;
}

function getDaysUntil(isoString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoString);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export default function EventsWidget() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        const [eventsData, workoutsData] = await Promise.all([
          fetchUserEvents(user.id),
          fetchUserWorkouts(user.id),
        ]);
        setEvents(eventsData);
        setWorkouts(workoutsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  if (loading)
    return (
      <div className="card bg-base-200 p-4">
        <h3 className="text-lg font-bold text-accent flex items-center gap-1.5 mb-4">
          <span className="inline-block w-0.75 h-4 rounded-full bg-yellow-400/70 mr-1" />{" "}
          Events
        </h3>
        <p className="text-sm text-base-content/50">Loading events...</p>
      </div>
    );

  if (error)
    return (
      <div className="card bg-base-200 p-4">
        <h3 className="text-lg font-bold text-accent flex items-center gap-1.5 mb-4">
          <span className="inline-block w-0.75 h-4 rounded-full bg-yellow-400/70 mr-1" />{" "}
          Events
        </h3>
        <p className="text-sm text-error">Error: {error}</p>
      </div>
    );

  const workoutMap = workouts.reduce((map, w) => {
    map[w.id] = w.name;
    return map;
  }, {});

  const eventsWithWorkouts = events
    .filter((e) => e.workouts_list?.length > 0)
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  const todayEvents = eventsWithWorkouts.filter(
    (e) => getDaysUntil(e.start_date) === 0,
  );
  const upcomingEvents = eventsWithWorkouts
    .filter((e) => getDaysUntil(e.start_date) > 0)
    .slice(0, 3);

  function renderEventRow(event) {
    const days = getDaysUntil(event.start_date);
    return (
      <div
        key={event.id}
        className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-base-300 transition-colors cursor-default"
      >
        <div className="space-y-0.5 min-w-0">
          <p className="text-sm font-semibold text-secondary truncate">
            {event.name}
          </p>
          <p className="text-xs text-base-content">
            {formatDate(event.start_date)}
            {event.start_time && ` · ${formatTime(event.start_time)}`}
            {event.end_time && ` – ${formatTime(event.end_time)}`}
          </p>
          {event.workouts_list?.length > 0 && (
            <p className="text-[10px] text-base-content/40">
              {event.workouts_list.map((id) => workoutMap[id]).join(", ")}
            </p>
          )}
        </div>
        <span
          className={`text-xs font-bold shrink-0 px-2 py-1 rounded-md border ${
            days === 0
              ? "bg-primary text-primary-content border-transparent"
              : "bg-base-300 text-secondary border-primary"
          }`}
        >
          {days === 0 ? "Today" : `In ${days}d`}
        </span>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 p-4">
      <h3 className="text-2xl font-bold text-primary flex items-center gap-1.5 mb-4">
        ⚡ Your Events
      </h3>

      {todayEvents.length === 0 && upcomingEvents.length === 0 && (
        <p className="text-sm text-base-content/50">No upcoming events.</p>
      )}

      {todayEvents.length > 0 && (
        <div className="mb-2">
          <p className="text-sm font-bold text-base-content/70 uppercase tracking-wider px-3">
            Today
          </p>
          {todayEvents.map(renderEventRow)}
        </div>
      )}

      {upcomingEvents.length > 0 && (
        <div>
          {todayEvents.length > 0 && (
            <p className="text-sm font-bold text-base-content/70 uppercase tracking-wider px-3 mt-2">
              Upcoming
            </p>
          )}
          {upcomingEvents.map(renderEventRow)}
        </div>
      )}
    </div>
  );
}
