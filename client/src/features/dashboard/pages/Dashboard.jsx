import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/AuthProvider";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0f0d17] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl pt-3">
        Dashboard content will be displayed here
      </h1>
      <h2 className="text-xl pt-3">For now, navigate to:</h2>
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
  );
}
