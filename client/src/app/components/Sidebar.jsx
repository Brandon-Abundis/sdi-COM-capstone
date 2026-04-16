import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "./CloseIcon.jsx";
import Avatar from "../../features/profile/Components/Avatar.jsx";
import { useAuth } from "../../app/AuthProvider";

export default function Sidebar({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  const { logout, refreshUser } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`sidebar fixed inset-y-0 left-0 z-50 w-64 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out flex flex-col`}
    >
      <div className="px-4 py-8 flex-1">
        <button
          onClick={onClose}
          className="hover:text-primary cursor-pointer mb-4 flex items-center gap-2 ml-auto"
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
            Group Events
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

      {/* Bottom-left profile widget */}
      {user && (
        <div className="px-3 py-4 border-t border-base-300">
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-base-200 transition-colors"
            onClick={() => {
              onClose();
              navigate("/profile");
            }}
          >
            <button
              onClick={handleSignOut}
              className="absolute bottom-20 left-4 z-4 px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 text-xs font-black uppercase tracking-widest border border-red-500/20 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              Log Out
            </button>
            {/* Avatar */}
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-accent bg-neutral flex-shrink-0 justify-center items-center pt-2">
              <Avatar userData={user} />
            </div>

            {/* Logged in as */}
            <div className="flex flex-col overflow-hidden">
              <p className="text-[10px] text-secondary">Logged in as:</p>
              <p className="text-sm font-semibold text-base-content truncate">
                {user?.username}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
