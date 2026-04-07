import EventCard from "./EventCard";

// Mock data — field names match the user_events schema
const mockUpcomingEvents = [
  {
    id: 1,
    name: "March Mileage Madness",
    date: "2026-04-10",
    duration: "1 month",
    class: "runner",
    type: "cardio",
    goals: ["run 50 miles"],
    workouts: [101, 102],
    user_id: 1,
  },
  {
    id: 2,
    name: "Unit Bench Press Challenge",
    date: "2026-04-15",
    duration: "1 week",
    class: "weight lifting",
    type: "strength",
    goals: ["hit new PR"],
    workouts: [201],
    user_id: 1,
  },
  {
    id: 3,
    name: "Leg Day Gauntlet",
    date: "2026-04-20",
    duration: "1 day",
    class: "weight lifting",
    type: "strength",
    goals: ["squat bodyweight x10"],
    workouts: [301, 302],
    user_id: 1,
  },
];

export default function UpcomingEvents({ selectedEvent, onSelectEvent }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#c084fc]">Upcoming Events</h2>
      {mockUpcomingEvents.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isSelected={selectedEvent?.id === event.id}
          onClick={onSelectEvent}
          showCountdown={true}
        />
      ))}
    </div>
  );
}