import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e1838] transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="px-4 py-8">
        <button
          onClick={onClose}
          className="text-[#e2dff5] hover:text-[#7c3aed] mb-4"
        >
          ✕ Close
        </button>
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="block py-2 px-4 text-[#e2dff5] hover:bg-[#7c3aed] rounded"
          >
            Dashboard
          </Link>
          <Link
            to="/calendar"
            className="block py-2 px-4 text-[#e2dff5] hover:bg-[#7c3aed] rounded"
          >
            Calendar
          </Link>
          <Link
            to="/events"
            className="block py-2 px-4 text-[#e2dff5] hover:bg-[#7c3aed] rounded"
          >
            Events
          </Link>
          <Link
            to="/leaderboard"
            className="block py-2 px-4 text-[#e2dff5] hover:bg-[#7c3aed] rounded"
          >
            Leaderboards
          </Link>
          <Link
            to="/workouts"
            className="block py-2 px-4 text-[#e2dff5] hover:bg-[#7c3aed] rounded"
          >
            Workouts
          </Link>
          <Link
            to="/chatandgroups"
            className="block py-2 px-4 text-[#e2dff5] hover:bg-[#7c3aed] rounded"
          >
            Chat & Groups
          </Link>
        </nav>
      </div>
    </div>
  );
}
