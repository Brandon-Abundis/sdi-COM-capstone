import "./Calendar.css";
import CalendarApp from "../programs/CalendarApp.jsx";

export default function Calendar() {
  return (
    <>
      <h1>Hello! This is the calendar page.</h1>
      <div className="calendar-box">
        <CalendarApp />
      </div>
      <aside>
        {/* Section dedicated to whatever date was clicked. Will take half the screen */}
      </aside>
    </>
  );
}
