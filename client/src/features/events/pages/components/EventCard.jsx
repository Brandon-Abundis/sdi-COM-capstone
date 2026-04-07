function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function CountdownBadge({ date }) {
  const days = getDaysUntil(date);

  if (days < 0) {
    return <span className="badge badge-sm bg-[#2a2245] text-[#e2dff5]/50 border-0">In Progress</span>;
  }
  if (days === 0) {
    return <span className="badge badge-sm bg-[#7c3aed] text-white border-0">Today</span>;
  }
  return (
    <span className="badge badge-sm bg-[#1e1838] text-[#a78bfa] border border-[#7c3aed]">
      Starts in {days}d
    </span>
  );
}

function DurationBadge({ duration }) {
  return (
    <span className="badge badge-sm bg-[#1e1838] text-[#c084fc] border border-[#2a2245]">
      ⏱ {duration}
    </span>
  );
}

export default function EventCard({ event, isSelected, onClick, showCountdown }) {
  return (
    <div
      className={`card bg-[#16112a] shadow cursor-pointer border-2 transition-all hover:border-[#a78bfa] ${
        isSelected ? "border-[#7c3aed]" : "border-[#1e1838]"
      }`}
      onClick={() => onClick(event)}
    >
      <div className="card-body p-4 gap-2">
        <h3 className="card-title text-sm text-[#a78bfa]">{event.name}</h3>
        <div className="text-xs text-[#e2dff5]/70 space-y-1">
          <p>📅 {event.date}</p>
          <p>🏋️ {event.class}</p>
          <p>⚡ {event.type}</p>
        </div>
        <div className="mt-1">
          {showCountdown
            ? <CountdownBadge date={event.date} />
            : <DurationBadge duration={event.duration} />
          }
        </div>
      </div>
    </div>
  );
}