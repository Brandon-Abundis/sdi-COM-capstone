import { useEffect, useState } from "react";
import { useAuth } from "../../../../app/AuthProvider";

// helper stuff that prob should be in a js function but idk
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
const formatSeconds = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // padStart ensures that 14:4 becomes 14:04
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const mins = (m || 0) > 0 ? `:${String(m).padStart(2, "0")}` : "";
  return `${hour}${mins} ${ampm}`;
}

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export default function UpcomingEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    fetch("http://localhost:8080/groups/")
      .then((res) => (res.ok ? res.json() : []))
      .then((groups) => {
        const myGroups = groups.filter((g) => g.user_ids?.includes(user.id));
        return Promise.all(
          myGroups.map((g) =>
            fetch(`http://localhost:8080/groups/group_events/id/${g.id}`)
              .then((res) => (res.ok ? res.json() : []))
              .catch(() => [])
          )
        );
      })
      .then((results) => {
        const future = results
          .flat()
          .filter((e) => getDaysUntil(e.start_date) >= 0)
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        setAllEvents(future);
      })
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const within7 = allEvents.filter((e) => getDaysUntil(e.start_date) <= 7);
  const beyond7 = allEvents.filter((e) => getDaysUntil(e.start_date) > 7);

  function renderCard(event) {
    const days = getDaysUntil(event.start_date);
    const isToday = days === 0;
    const isExpanded = expandedId === event.id;

    return (
      <div
        key={event.id}
        onClick={() => setExpandedId(isExpanded ? null : event.id)}
        className="flex flex-col bg-[#16112a] border border-[#2a2245] rounded-xl px-3 py-2 shadow-md transition-all hover:bg-[#1c1633] cursor-pointer group w-full"
      >
        {/* Event Name and Group .................................................................*/}
        <div className="flex items-baseline justify-between">
          <p className="text-[14.5px] font-bold text-[#e2dff5] truncate flex-shrink">
            {event.name}
          </p>
          <span className="text-[10px] font-black text-[#c084fc]/40 uppercase tracking-tighter whitespace-nowrap">
            {event.group_name || "group name not found"}
          </span>
        </div>

        {/* Date, Time, and Status Badge .....................................................*/}
        <div className="flex items-center justify-between border-t border-[#2a2245]/40 pt-1 mt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#e2dff5]/30 tracking-tight uppercase">
            <span className="opacity-40">📅</span>
            <span>{formatDate(event.start_date)} @ {formatTime(event.start_time)}</span>
          </div>

          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border transition-all
            ${isToday
              ? "bg-[#7c3aed]/20 text-[#c084fc] border-[#7c3aed]/40 shadow-[0_0_8px_rgba(124,58,237,0.15)]"
              : "bg-[#2a2245] text-[#e2dff5]/30 border-transparent group-hover:text-[#e2dff5]/50"
            }`}
          >
            {isToday ? "Today" : `In ${days}d`}
          </span>
        </div>

        {/* Expandable Content Area ...................................bruh*/}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100 mt-2.5 pb-1" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden bg-[#0d0a1a] rounded-lg border border-[#2a2245] p-2 flex flex-col gap-2">
            <p className="text-[8px] font-black text-[#e2dff5]/20 uppercase tracking-[0.2em] px-1">Group Goal Details</p>
            <div className="flex flex-col gap-1">
              {event.goalsDetails?.length > 0 ? (
                event.goalsDetails.map((w, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#16112a] p-1.5 rounded border border-[#2a2245]/50">
                    <span className="text-[10px] font-bold text-[#e2dff5]/70">{w.name}</span>
                    <span className="text-[9px] text-[#c084fc] font-mono">{w.reps ? `${w.reps} reps` : `${formatSeconds(w.time)} min`}</span>
                  </div>
                ))
              ) : (
                <p className="text-[9px] text-[#e2dff5]/20 italic text-center py-1">No additional data.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <h2 className="text-lg font-bold text-accent px-1">Upcoming Events</h2>

      {loading && <p className="text-[10px] text-[#e2dff5]/30 animate-pulse px-2 uppercase tracking-widest">Scanning frequencies...</p>}

      {!loading && allEvents.length === 0 && (
        <div className="p-6 border border-dashed border-[#2a2245] rounded-xl text-center">
          <p className="text-[10px] text-[#e2dff5]/20 font-bold uppercase tracking-[0.2em]">No Data</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {within7.map(renderCard)}
        {beyond7.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-[10px] font-black text-[#e2dff5]/20 uppercase tracking-[0.4em] px-2 mb-1">Future Group Events</p>
            {beyond7.map(renderCard)}
          </div>
        )}
      </div>
    </div>
  );
}
