import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div id="Navbar">
        <Link id="Links" to="/dashboard">
          Dashboard
        </Link>
        <Link id="Links" to="/calendar">
          Calendar
        </Link>
        <Link id="Links" to="/events">
          Events
        </Link>
        <Link id="Links" to="/leaderboard">
          Leaderboards
        </Link>
        <Link id="Links" to="/workouts">
          Workouts
        </Link>
        <Link id="Links" to="/profile">
          Profile
        </Link>
      </div>
    </>
  );
}
