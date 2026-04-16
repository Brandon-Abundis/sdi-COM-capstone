import { useEffect, useState } from "react";

/** Formats a date string to "Apr 15, 2026" style */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Converts a 24-hour "HH:MM" time string to "3:45 PM" style */
function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const mins = (m || 0) > 0 ? `:${String(m).padStart(2, "0")}` : "";
  return `${hour}${mins} ${ampm}`;
}

/** Returns integer days from today to dateStr (negative = past) */
function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

/**
 * UpcomingEvents — Left column on the Events page showing future group events.
 * Fetches every group's events, discards past ones, then splits the remaining
 * events into two buckets:
 *   - within7: starting within the next 7 days (shown first)
 *   - beyond7: starting more than 7 days out (shown under "Further Out" heading)
 */
export default function UpcomingEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/groups/")
      .then((res) => (res.ok ? res.json() : []))
      .then((groups) =>
        Promise.all(
          groups.map((g) =>
            fetch(`http://localhost:8080/groups/group_events/id/${g.id}`)
              .then((res) => (res.ok ? res.json() : []))
              .catch(() => [])
          )
        )
      )
      .then((results) => {
        const future = results
          .flat()
          .filter((e) => getDaysUntil(e.start_date) >= 0)
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        setAllEvents(future);
      })
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const within7 = allEvents.filter((e) => getDaysUntil(e.start_date) <= 7);
  const beyond7 = allEvents.filter((e) => getDaysUntil(e.start_date) > 7);

  /** Renders a single upcoming event row with its date, time, and days-until badge */
  function renderCard(event) {
    const days = getDaysUntil(event.start_date);
    return (
      <div
        key={event.id}
        className="card bg-base-200 border border-base-300 p-4 flex items-center justify-between gap-3"
      >
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-base-content">{event.name}</p>
          <p className="text-xs text-base-content/50">
            {formatDate(event.start_date)} · {formatTime(event.start_time)}
          </p>
        </div>
        <span className="text-xs font-bold flex-shrink-0 px-2 py-1 rounded-md bg-base-300 text-secondary border border-primary">
          {days === 0 ? "Today" : `In ${days}d`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-accent">Upcoming Events</h2>

      {loading && <p className="text-sm text-base-content/50">Loading...</p>}

      {!loading && allEvents.length === 0 && (
        <p className="text-sm text-base-content/50">No upcoming events.</p>
      )}

      {within7.map(renderCard)}

      {beyond7.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-bold text-base-content/30 uppercase tracking-wider mb-2">Further Out</p>
          {beyond7.map(renderCard)}
        </div>
      )}
    </div>
  );
}
