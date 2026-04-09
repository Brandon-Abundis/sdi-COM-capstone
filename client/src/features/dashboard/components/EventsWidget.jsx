import { useState, useEffect } from "react";
import { useAuth } from "../../../app/AuthProvider";
import { fetchUserEvents, fetchUserWorkouts } from "../api/userEvents";

export default function EventsWidget() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        const [eventsData, workoutsData] = await Promise.all([
          fetchUserEvents(user.id),
          fetchUserWorkouts(user.id),
        ]);
        setEvents(eventsData);
        setWorkouts(workoutsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  if (loading)
    return <div className="card bg-base-200 p-4">Loading workouts...</div>;
  if (error)
    return (
      <div className="card bg-base-200 p-4 text-error">Error: {error}</div>
    );

  // Create an object mapping workout id to workout name
  const workoutMap = workouts.reduce((map, workout) => {
    map[workout.id] = workout.name;
    return map;
  }, {});

  // Filter events with workouts
  const eventsWithWorkouts = events.filter(
    (event) => event.workouts_list && event.workouts_list.length > 0,
  );

  // Sort by events by date
  const sortedEvents = eventsWithWorkouts.sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  // Today's date in date-only ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  // Get today's events and upcoming events (near-term events past today)
  const todayEvents = sortedEvents.filter((event) => event.date === today);
  const upcomingEvents = sortedEvents
    .filter((event) => event.date > today)
    .slice(0, 3);

  return (
    <div className="card bg-base-200 p-4">
      <h3 className="text-2xl font-semibold text-primary mb-4">Events</h3>
      {todayEvents.length > 0 && (
        <div className="pb-4 border-b">
          <h4 className="text-md font-medium text-secondary pb-2">Today</h4>
          <ul className="space-y-1">
            {todayEvents.map((event) => (
              <li key={event.id} className="text-sm">
                <strong>{event.name}</strong> - {event.time}
                {event.workouts_list.length > 0 && (
                  <div className="ml-2 text-xs text-gray-400">
                    Workouts:{" "}
                    {event.workouts_list.map((id) => workoutMap[id]).join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {upcomingEvents.length > 0 && (
        <div>
          <h4 className="text-md font-extrabold text-secondary pb-2">
            Upcoming:
          </h4>
          <ul className="space-y-1">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="text-sm">
                <strong>{event.name}</strong> -{" "}
                {new Date(event.date).toLocaleDateString()} {event.time}
                {event.workouts_list.length > 0 && (
                  <div className="ml-2 text-xs text-gray-400">
                    Workouts:{" "}
                    {event.workouts_list.map((id) => workoutMap[id]).join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {todayEvents.length === 0 && upcomingEvents.length === 0 && (
        <p className="text-md text-base-content">No upcoming events.</p>
      )}
    </div>
  );
}
