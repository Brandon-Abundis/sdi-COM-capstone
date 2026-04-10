import { useState } from "react";
import UpcomingEvents from "./components/UpcomingEvents";
import AllEvents from "./components/AllEvents";
import EventLeaderboard from "./components/EventLeaderboard";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <h1 className="text-3xl font-bold text-primary mb-6 tracking-wide">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UpcomingEvents />
        <AllEvents
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
        <EventLeaderboard selectedEvent={selectedEvent} />
      </div>
    </div>
  );
}