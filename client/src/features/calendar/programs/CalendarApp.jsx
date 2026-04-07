import { useState, useEffect } from "react";

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();

  let firstDayOfMonth = new Date(year, month, 1).getDay();
  let daysInMonth = new Date(year, month + 1, 0).getDate();

  let days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  let blanks = Array.from({ length: firstDayOfMonth });

  useEffect(() => {
    console.log(selectedDay);
  }, [selectedDay]);
  return (
    <div className="calendar">
      <header>
        <button
          onClick={() => {
            setCurrentDate(year, month - 1);
          }}
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
          onClick={() => {
            setCurrentDate(year, month + 1);
          }}
        >
          Next
        </button>
      </header>
      <div className="calendarGuts">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="day-names">
            {d}
          </div>
        ))}

        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="blank" />
        ))}

        {days.map((day) => (
          <>
            <div
              key={day}
              className={`day ${selectedDay === day ? "selected" : ""}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
              <div className="Workouts">
                {/* <ul>
                  <li>test1</li>
                  <li>test2</li>
                  <li>test3</li>
                </ul> */}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
