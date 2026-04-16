import { useState } from "react";
import UpcomingEvents from "./components/UpcomingEvents";
import AllEvents from "./components/AllEvents";
import EventLeaderboard from "./components/EventLeaderboard";

/**
 * Events — Top-level page that orchestrates the three events sub-components.
 * Owns `selectedEvent` state and passes it down so AllEvents and EventLeaderboard
 * stay in sync: clicking a card in AllEvents drives the leaderboard on the right.
 *
 * Layout (3-column grid on md+):
 *   UpcomingEvents | AllEvents (current) | EventLeaderboard
 */
export default function Events() {
  // The event the user has clicked in AllEvents — null means nothing selected
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <h1 className="text-3xl font-bold text-primary mb-6 tracking-wide">
        EVENTS
      </h1>
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
