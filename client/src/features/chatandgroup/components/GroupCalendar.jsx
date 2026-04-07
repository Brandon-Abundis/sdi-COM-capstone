// Mock group events keyed by group_id — matches group_events schema
const mockGroupEvents = {
  1: [
    { id: 10, name: "March Mileage Madness",     date: "2026-04-10", time: "0600", duration: "1 month", type: "cardio" },
    { id: 11, name: "Unit Bench Press Challenge", date: "2026-04-15", time: "1400", duration: "1 week",  type: "strength" },
  ],
  2: [
    { id: 12, name: "Leg Day Gauntlet", date: "2026-04-20", time: "0700", duration: "1 day",   type: "strength" },
    { id: 13, name: "5K Time Trial",    date: "2026-04-25", time: "0500", duration: "2 weeks", type: "cardio" },
  ],
  3: [
    { id: 14, name: "Iron Company Games", date: "2026-05-01", time: "0800", duration: "3 days",  type: "sports" },
  ],
};

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

const typeColors = {
  cardio:   "border-[#818cf8] text-[#818cf8]",
  strength: "border-[#c084fc] text-[#c084fc]",
  sports:   "border-[#34d399] text-[#34d399]",
};

export default function GroupCalendar({ group }) {
  const events = mockGroupEvents[group.id] ?? [];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-lg font-bold text-[#c084fc] mb-4">📅 {group.name} — Events</h2>

      {events.length === 0 ? (
        <p className="text-sm text-[#e2dff5]/50">No events scheduled for this group.</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const days = getDaysUntil(event.date);
            return (
              <div
                key={event.id}
                className={`bg-[#16112a] border-l-4 rounded-lg p-4 flex items-center justify-between ${
                  typeColors[event.type] ?? "border-[#2a2245] text-[#e2dff5]"
                }`}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-[#e2dff5]">{event.name}</p>
                  <p className="text-xs text-[#e2dff5]/60">
                    📅 {event.date} &nbsp;·&nbsp; 🕐 {event.time} &nbsp;·&nbsp; ⏱ {event.duration}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  {days < 0 ? (
                    <span className="badge badge-sm bg-[#2a2245] text-[#e2dff5]/50 border-0">In Progress</span>
                  ) : days === 0 ? (
                    <span className="badge badge-sm bg-[#7c3aed] text-white border-0">Today</span>
                  ) : (
                    <span className="badge badge-sm bg-[#1e1838] text-[#a78bfa] border border-[#7c3aed]">
                      In {days}d
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}