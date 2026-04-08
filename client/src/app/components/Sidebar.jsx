import { Link } from "react-router-dom";
import CloseIcon from "./CloseIcon.jsx";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <div
      className={`sidebar fixed inset-y-0 left-0 z-50 w-64 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="px-4 py-8">
        <button
          onClick={onClose}
          className="hover:text-primary mb-4 flex items-center gap-2 ml-auto"
          aria-label="Close sidebar"
        >
          <CloseIcon />
        </button>
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="block py-2 px-4 hover:bg-primary rounded"
          >
            Dashboard
          </Link>
          <Link
            to="/calendar"
            className="block py-2 px-4 hover:bg-primary rounded"
          >
            Calendar
          </Link>
          <Link
            to="/events"
            className="block py-2 px-4 hover:bg-primary rounded"
          >
            Events
          </Link>
          <Link
            to="/leaderboard"
            className="block py-2 px-4 hover:bg-primary rounded"
          >
            Leaderboards
          </Link>
          <Link
            to="/workouts"
            className="block py-2 px-4 hover:bg-primary rounded"
          >
            Workouts
          </Link>
          <Link
            to="/chatandgroups"
            className="block py-2 px-4 hover:bg-primary rounded"
          >
            Chat & Groups
          </Link>
        </nav>
      </div>
    </div>
  );
}
