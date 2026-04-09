const DESCRIPTIONS = {
  "Squad PT":        "Group strength & endurance training",
  "Formation Run":   "Unit run maintaining formation pace and cohesion",
  "Mock PFA":        "Practice assessment — push-ups, sit-ups, 2-mile run",
  "Section Training":"Drill and physical readiness exercises",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const mins = (m || 0) > 0 ? `:${String(m).padStart(2, "0")}` : "";
  return `${hour}${mins} ${ampm}`;
}

function getDaysElapsed(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.floor((today - target) / (1000 * 60 * 60 * 24));
}

function ElapsedBadge({ date }) {
  const days = getDaysElapsed(date);
  const label = days === 0 ? "Started today" : `Started ${days}d ago`;
  return (
    <span className="badge badge-sm bg-[#2a2245] text-[#a78bfa] border border-[#7c3aed]">
      {label}
    </span>
  );
}

function CountdownBadge({ date }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const days = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (days === 0) return <span className="badge badge-sm bg-[#7c3aed] text-white border-0">Today</span>;
  return (
    <span className="badge badge-sm bg-[#1e1838] text-[#a78bfa] border border-[#7c3aed]">
      In {days}d
    </span>
  );
}

export default function EventCard({ event, isSelected, onClick, showCountdown }) {
  const description = DESCRIPTIONS[event.name] ?? "Physical training event";

  return (
    <div
      className={`card bg-[#16112a] shadow cursor-pointer border-2 transition-all hover:border-[#a78bfa] ${
        isSelected ? "border-[#7c3aed]" : "border-[#1e1838]"
      }`}
      onClick={() => onClick(event)}
    >
      <div className="card-body p-4 gap-2">
        <h3 className="card-title text-sm text-[#a78bfa]">{event.name}</h3>
        <p className="text-xs text-[#e2dff5]/60 italic">{description}</p>
        <p className="text-xs text-[#e2dff5]/70">
          📅 {formatDate(event.date)} · {formatTime(event.time)}
        </p>
        <div className="mt-1">
          {showCountdown
            ? <CountdownBadge date={event.date} />
            : <ElapsedBadge date={event.date} />
          }
        </div>
      </div>
    </div>
  );
}