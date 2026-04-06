import EventCard from "./EventCard";

// Mock data — field names match the group_events schema
const mockAllEvents = [
  {
    id: 10,
    name: "March Mileage Madness",
    date: "2026-04-10",
    time: "0600",
    duration: "1 month",
    class: "runner",
    type: "cardio",
    goals: ["unit-wide mileage goal"],
    workouts: [101, 102],
    group_id: 1,
  },
  {
    id: 11,
    name: "Unit Bench Press Challenge",
    date: "2026-04-15",
    time: "1400",
    duration: "1 week",
    class: "weight lifting",
    type: "strength",
    goals: ["highest total weight"],
    workouts: [201],
    group_id: 1,
  },
  {
    id: 12,
    name: "Leg Day Gauntlet",
    date: "2026-04-20",
    time: "0700",
    duration: "1 day",
    class: "weight lifting",
    type: "strength",
    goals: ["most reps"],
    workouts: [301, 302],
    group_id: 2,
  },
  {
    id: 13,
    name: "5K Time Trial",
    date: "2026-04-25",
    time: "0500",
    duration: "2 weeks",
    class: "runner",
    type: "cardio",
    goals: ["fastest time"],
    workouts: [401],
    group_id: 2,
  },
];

export default function AllEvents({ selectedEvent, onSelectEvent }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#c084fc]">All Events</h2>
      {mockAllEvents.map((event) => (
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