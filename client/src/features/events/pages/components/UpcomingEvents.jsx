import { useEffect, useState } from "react";
import { useAuth } from "../../../../app/AuthProvider";

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export default function UpcomingEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const url = user.is_admin
      ? "http://localhost:8080/users/user_events/"
      : `http://localhost:8080/users/user_events/id/${user.id}`;

    fetch(url)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : [data].filter(Boolean);
        const upcoming = list
          .filter((e) => getDaysUntil(e.date) >= 0)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(upcoming);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#c084fc]">
        Upcoming Events {user?.is_admin && <span className="text-xs text-[#a78bfa] font-normal">(All Users)</span>}
      </h2>

      {loading && <p className="text-sm text-[#e2dff5]/50">Loading...</p>}

      {!loading && events.length === 0 && (
        <p className="text-sm text-[#e2dff5]/50">No upcoming events.</p>
      )}

      {events.map((event) => {
        const days = getDaysUntil(event.date);
        return (
          <div key={event.id} className="card bg-[#16112a] border border-[#1e1838] p-4 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[#e2dff5]">{event.name}</p>
              <p className="text-xs text-[#e2dff5]/50">
                {event.date} · {event.time}
                {user?.is_admin && event.user_id && (
                  <span className="ml-2 text-[#a78bfa]">uid:{event.user_id}</span>
                )}
              </p>
            </div>
            <span className={`text-xs font-bold flex-shrink-0 px-2 py-1 rounded-md ${
              days === 0
                ? "bg-[#7c3aed] text-white"
                : "bg-[#1e1838] text-[#a78bfa] border border-[#7c3aed]"
            }`}>
              {days === 0 ? "Today" : `In ${days}d`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
