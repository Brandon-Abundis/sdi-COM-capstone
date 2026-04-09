import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/AuthProvider";
import EventsWidget from "../components/EventsWidget";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <h1 className="text-3xl font-bold text-primary mb-6 tracking-wide">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EventsWidget />
        <div className="card bg-base-200 p-4">
          <h3 className="text-2xl font-semibold text-primary mb-4">Widget 2</h3>
          <p className="text-md text-base-content">
            Placeholder for second widget.
          </p>
        </div>
        <div className="card bg-base-200 p-4">
          <h3 className="text-2xl font-semibold text-primary mb-4">Widget 3</h3>
          <p className="text-md text-base-content">
            Placeholder for third widget.
          </p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-xl pt-3">Navigate to:</h2>
        <nav className="flex flex-col text-center py-2 gap-2">
          <Link to="/calendar" className="link-primary">
            Calendar
          </Link>
          <Link to="/events" className="link-primary">
            Events
          </Link>
          <Link to="/leaderboard" className="link-primary">
            Leaderboard
          </Link>
          <Link to="/profile" className="link-primary">
            Profile
          </Link>
          <Link to="/workouts" className="link-primary">
            Workouts
          </Link>
        </nav>
        <button
          type="button"
          onClick={handleSignOut}
          className="btn btn-outline mt-4"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
