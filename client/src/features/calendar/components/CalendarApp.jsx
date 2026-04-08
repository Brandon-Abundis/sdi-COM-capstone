<<<<<<< HEAD:client/src/features/calendar/programs/CalendarApp.jsx
=======
import { useState, useEffect } from "react";
import { selectDayDisplay } from "./CalendarFuncs.jsx"
import CalendarPopulator from "./CalendarPopulator.jsx";
>>>>>>> b4dcd50 (updated Calendar display, built temp to-do list):client/src/features/calendar/components/CalendarApp.jsx

export default function CalendarApp({ currentDate, onMonthChange, selectedDay, onDaySelect, events }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth });

<<<<<<< HEAD:client/src/features/calendar/programs/CalendarApp.jsx
  function eventsForDay(day) {
    return events.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getUTCFullYear() === year &&
        d.getUTCMonth() === month &&
        d.getUTCDate() === day
      );
    });
  }

  function handleDayClick(day) {
    onDaySelect(selectedDay === day ? null : day);
  }

=======
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();
  let firstDayOfMonth = new Date(year, month, 1).getDay();
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  let blanks = Array.from({ length: firstDayOfMonth });


  useEffect(() => {
    console.log(selectedDay);
  }, [selectedDay]);
>>>>>>> b4dcd50 (updated Calendar display, built temp to-do list):client/src/features/calendar/components/CalendarApp.jsx
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
        >
          Next
        </button>
      </header>
<<<<<<< HEAD:client/src/features/calendar/programs/CalendarApp.jsx

=======
      <div className="day-names">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="day-names-height">
              {d}
            </div>
          ))}
      </div>
>>>>>>> b4dcd50 (updated Calendar display, built temp to-do list):client/src/features/calendar/components/CalendarApp.jsx
      <div className="calendarGuts">

        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="blank" />
        ))}

        {days.map((day) => {
          const dayEvents = eventsForDay(day);
          return (
            <div
              key={day}
<<<<<<< HEAD:client/src/features/calendar/programs/CalendarApp.jsx
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
=======
              className={`day ${selectDayDisplay(selectedDay, day)}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
              <div className="Workouts">
                <CalendarPopulator/>
              </div>
>>>>>>> b4dcd50 (updated Calendar display, built temp to-do list):client/src/features/calendar/components/CalendarApp.jsx
            </div>
          );
        })}
      </div>
    </div>
  );
}
