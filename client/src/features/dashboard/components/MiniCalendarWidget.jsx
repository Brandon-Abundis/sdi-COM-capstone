import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MiniCalendarWidget() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [eventDays, setEventDays] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/groups/")
      .then((r) => (r.ok ? r.json() : []))
      .then((groups) =>
        Promise.all(
          groups.map((g) =>
            fetch(`http://localhost:8080/groups/group_events/id/${g.id}`)
              .then((r) => (r.ok ? r.json() : []))
              .catch(() => []),
          ),
        ),
      )
      .then((results) => {
        const days = new Set();
        results.flat().forEach((e) => {
          if (e.start_date) {
            const d = new Date(e.start_date);
            days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
          }
        });
        setEventDays(days);
      })
      .catch(() => {});
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-base-200 rounded-xl p-4">
        {/* Month navigation */}
        <h3 className="text-2xl font-bold text-primary flex items-center gap-1.5 mb-4">
          🗓️ Calendar
        </h3>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="text-base-content/40 hover:text-primary transition-colors w-6 h-6 flex items-center justify-center text-lg font-bold"
          >
            ‹
          </button>
          <span className="text-sm font-bold text-base-content">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="text-base-content/40 hover:text-primary transition-colors w-6 h-6 flex items-center justify-center text-lg font-bold"
          >
            ›
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[10px] font-bold text-base-content/30 uppercase py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const key = `${year}-${month}-${day}`;
            const isToday = key === todayKey;
            const hasEvent = eventDays.has(key);

            return (
              <div
                key={key}
                onClick={() => navigate("/calendar")}
                className={`relative flex items-center justify-center h-7 w-7 mx-auto rounded-full text-xs font-semibold cursor-pointer transition-colors select-none ${
                  isToday
                    ? "bg-primary text-primary-content"
                    : "text-base-content/70 hover:bg-base-300"
                }`}
              >
                {day}
                {hasEvent && (
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      isToday ? "bg-yellow-400" : "bg-yellow-400/60"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-base-300">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
          <span className="text-[10px] text-base-content/30">
            Event scheduled
          </span>
        </div>
      </div>
    </div>
  );
}
