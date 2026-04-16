// Static lookup for friendly descriptions by event name — falls back to a generic label
const DESCRIPTIONS = {
  "Squad PT":        "Group strength & endurance training",
  "Formation Run":   "Unit run maintaining formation pace and cohesion",
  "Mock PFA":        "Practice assessment — push-ups, sit-ups, 2-mile run",
  "Section Training":"Drill and physical readiness exercises",
};

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

/**
 * EndsInBadge — Small badge showing how many days until (or since) an event ends.
 * Used on "current events" cards where the end date is the relevant countdown.
 */
function EndsInBadge({ date }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const days = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  const label = days === 0 ? "Ends today" : days > 0 ? `Ends in ${days}d` : `Ended ${Math.abs(days)}d ago`;
  return (
    <span className="badge badge-sm bg-base-300 text-secondary border border-primary">
      {label}
    </span>
  );
}

/**
 * CountdownBadge — Badge showing how many days until an event starts.
 * Shows "Today" with a primary-color badge when the event is today.
 * Used on "upcoming events" cards where the start date is the relevant countdown.
 */
function CountdownBadge({ date }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const days = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (days === 0) return <span className="badge badge-sm bg-primary text-primary-content border-0">Today</span>;
  return (
    <span className="badge badge-sm bg-base-300 text-secondary border border-primary">
      In {days}d
    </span>
  );
}

/**
 * EventCard — Selectable card representing a single group event.
 * Used in both AllEvents (current) and potentially UpcomingEvents contexts.
 *
 * Props:
 *   event         — the event object from the API
 *   isSelected    — highlights the card with a primary border when true
 *   onClick       — called with the full event object when the card is clicked
 *   showCountdown — if true shows CountdownBadge (start date), else EndsInBadge (end date)
 */
export default function EventCard({ event, isSelected, onClick, showCountdown }) {
  // Look up a friendly description or fall back to a generic label
  const description = DESCRIPTIONS[event.name] ?? "Physical training event";

  return (
    <div
      className={`card bg-base-200 shadow cursor-pointer border-2 transition-all hover:border-secondary ${
        isSelected ? "border-primary" : "border-base-300"
      }`}
      onClick={() => onClick(event)}
    >
      <div className="card-body p-4 gap-2">
        <h3 className="card-title text-sm text-secondary">{event.name}</h3>
        <p className="text-xs text-base-content/60 italic">{description}</p>
        <p className="text-xs text-base-content/70">
          📅 {formatDate(event.start_date)} · {formatTime(event.start_time)}
        </p>
        <div className="mt-1">
          {showCountdown
            ? <CountdownBadge date={event.start_date} />
            : <EndsInBadge date={event.end_date} />
          }
        </div>
      </div>
    </div>
  );
}
