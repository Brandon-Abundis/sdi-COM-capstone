import { useEffect, useState } from "react";
import EventCard from "./EventCard";

function isCurrentEvent(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateStr);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate <= today;
}

export default function AllEvents({ selectedEvent, onSelectEvent }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const current = results.flat().filter((e) => isCurrentEvent(e.date));
        setEvents(current);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#c084fc]">Current Events</h2>

      {loading && <p className="text-sm text-[#e2dff5]/50">Loading...</p>}
      {error && <p className="text-sm text-[#f87171]">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p className="text-sm text-[#e2dff5]/50">No current events.</p>
      )}

      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isSelected={selectedEvent?.id === event.id}
          onClick={onSelectEvent}
          showCountdown={false}
        />
      ))}
    </div>
  );
}