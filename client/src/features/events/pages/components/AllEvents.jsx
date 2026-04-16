import { useEffect, useState } from "react";
import EventCard from "./EventCard";

/**
 * Returns true if today falls within [startDate, endDate].
 * When no endDate is provided the event is treated as a single-day event.
 */
function isCurrentEvent(startDateStr, endDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(startDateStr);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(endDateStr || startDateStr);
  endDate.setHours(0, 0, 0, 0);
  return startDate <= today && today <= endDate;
}

/**
 * AllEvents — "Current Events" column on the Events page.
 * Fetches every group and their events, then keeps only those where today falls
 * within the event's date range. Clicking an EventCard lifts the selection up
 * to the parent Events component so the leaderboard can update.
 */
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
        const current = results.flat().filter((e) => isCurrentEvent(e.start_date, e.end_date));
        setEvents(current);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-accent">Current Events</h2>

      {loading && <p className="text-sm text-base-content/50">Loading...</p>}
      {error && <p className="text-sm text-error">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p className="text-sm text-base-content/50">No current events.</p>
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