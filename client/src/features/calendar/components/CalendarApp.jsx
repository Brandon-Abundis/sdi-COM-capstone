import CalendarPopulator from "./CalendarPopulator.jsx"


function timeToMinutes(timeStr) {
  if (!timeStr) return Infinity;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
}

export default function CalendarApp({ currentDate, onMonthChange, selectedDay, onDaySelect, events, dayEvents, dayWorkouts}) {
  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth();
  const firstDayOfMonth = new Date(year, month, 1).getUTCDay();
  const daysInMonth = new Date(year, month + 1, 0).getUTCDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth });


  function eventsForDay(day) {
    return events
      .filter((e) => {
        const d = new Date(e.start_date);
        return (
          d.getUTCFullYear() === year &&
          d.getUTCMonth() === month &&
          d.getUTCDate() === day
        );
      })
      .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  }


  function handleDayClick(day) {
    onDaySelect(selectedDay === day ? null : day);
  }
//  console.log(dayEvents)


  return (
    <div className="calendar">
      <header>
        <button


          type="button"
          onClick={() => onMonthChange(new Date(year, month - 1))}
        >
          Prev
        </button>
        <h2>
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button


          type="button"
          onClick={() => onMonthChange(new Date(year, month + 1))}
          className="clickable"
        >
          Next
        </button>
      </header>
      <div className="day-names">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="day-names-height">
              {d}
            </div>
          ))}
      </div>
      <div className="calendarGuts">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="blank" />
        ))}


        {days.map((day) => {
          const dayEvents = eventsForDay(day);
          return (
            <div
              key={day}
              className={`day ${selectedDay === day ? "selected" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              <span className="day-number">{day}</span>
              {dayEvents.slice(0, 3).map((e) => (
                <span key={e.id} className="event-tab">
                  {e.name}
                </span>
              ))}
              {dayEvents.length > 3 && (
                <span className="event-tab-more">+{dayEvents.length - 3} more</span>
              )}
              {/* <div className="Workouts">
                <CalendarPopulator
                  day={day}
                  dayEvents={dayEvents}
                  dayWorkouts={dayWorkouts}
                  events={events}
                  selectedDay={selectedDay}
                />
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}




