// this will populate into each calendar day, if data is available.
//types of workouts:
// Group Workouts: -Workouts fetched from group
// Personal Workouts: -Workouts personally tracking
//Rival Workout: -Workout you and rival competing on (have questions on mechanic, will rival and you have to match eachother? if so will rival be public or priv? if not then does that mean rival workout is optional?)
//Special Workout Events: -Workout events app-wide(?) (e.g Pushups x2 XP or other)


export default function CalendarPopulator({day, dayEvents, dayWorkouts, events, selectedDay}) {

    if (!dayWorkouts || dayWorkouts.length === 0) return null

    if (day !== selectedDay) return null

    return (
            <ul className="cal-block-event">
                {dayWorkouts.map((ev) => (
                    <li key={ev.id}>
                    <p className="cal-block-event">{ev.name}</p>
                    {ev.time && <span className="event-time">{ev.time}</span>}
                    </li>
                ))}
            </ul>
    )
}
