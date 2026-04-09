import { useEffect, useState } from "react";
import { useAuth } from "../../../../app/AuthProvider";

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

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export default function UpcomingEvents() {
  const { user } = useAuth();
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
          .filter((e) => getDaysUntil(e.date) > 0)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setAllEvents(future);
      })
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter in render so admin check always uses the latest auth state
  const events = user?.is_admin
    ? allEvents.filter((e) => getDaysUntil(e.date) <= 7).slice(0, 5)
    : allEvents;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#c084fc]">
        Upcoming Events
        {user?.is_admin && (
          <span className="text-xs text-[#a78bfa] font-normal ml-2">(Next 7 Days)</span>
        )}
      </h2>

      {loading && <p className="text-sm text-[#e2dff5]/50">Loading...</p>}

      {!loading && events.length === 0 && (
        <p className="text-sm text-[#e2dff5]/50">No upcoming events.</p>
      )}

      {events.map((event) => {
        const days = getDaysUntil(event.date);
        return (
          <div
            key={event.id}
            className="card bg-[#16112a] border border-[#1e1838] p-4 flex items-center justify-between gap-3"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[#e2dff5]">{event.name}</p>
              <p className="text-xs text-[#e2dff5]/50">
                {formatDate(event.date)} · {formatTime(event.time)}
              </p>
            </div>
            <span className="text-xs font-bold flex-shrink-0 px-2 py-1 rounded-md bg-[#1e1838] text-[#a78bfa] border border-[#7c3aed]">
              In {days}d
            </span>
          </div>
        );
      })}
    </div>
  );
}
