import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-between bg-[#a78bfa] px-100 py-5 text-[#7c3aed] underline">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/events">Events</Link>
      <Link to="/leaderboard">Leaderboards</Link>
      <Link to="/workouts">Workouts</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/chatandgroups">Chat & Groups</Link>
    </div>
  );
}
