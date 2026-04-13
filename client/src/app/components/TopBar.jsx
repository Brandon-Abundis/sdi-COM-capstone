import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import OpenIcon from "./OpenIcon.jsx";

export default function TopBar({ user, onToggleSidebar, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const closeTimer = useRef(null);

  function openProfile() {
    clearTimeout(closeTimer.current);
    setProfileOpen(true);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setProfileOpen(false), 100);
  }

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div className="sticky top-0 z-40 flex items-center p-4 border-b border-base-300 bg-base-100">
      <div className="flex-1">
        <button
          onClick={onToggleSidebar}
          className="text-base-content hover:text-primary text-2xl hover:cursor-pointer"
        >
          <OpenIcon />
        </button>
      </div>

      <div className="flex-1 flex justify-center">
        <h1 className="text-3xl font-bold text-base-content">WarfighterFit</h1>
      </div>

      {/* PFP hover dropdown */}
      <div className="flex-1 flex justify-end relative">
        <div
          role="button"
          onMouseEnter={openProfile}
          onMouseLeave={scheduleClose}
          className="btn btn-ghost btn-circle avatar outline-1 outline-accent hover:outline-primary bg-neutral select-none"
        >
          <span className="text-sm font-bold text-accent">{initials}</span>
        </div>

        <ul
          onMouseEnter={openProfile}
          onMouseLeave={scheduleClose}
          className={`absolute right-0 z-50 mt-2 w-52 rounded-xl border border-base-300 bg-base-200 p-2 shadow-xl flex flex-col gap-0.5 ${
            profileOpen ? "block" : "hidden"
          }`}
        >
          {/* User info header */}
          <li className="px-3 py-2 border-b border-base-300 mb-1">
            <p className="text-sm font-semibold text-base-content">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-secondary">{user?.rank}</p>
          </li>

          <li>
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-base-content hover:bg-neutral hover:text-accent transition-colors"
            >
              <span>👤</span> My Profile
            </Link>
          </li>

          <li>
            <Link
              to="/settings"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-base-content hover:bg-neutral hover:text-accent transition-colors"
            >
              <span>⚙️</span> Settings
            </Link>
          </li>

          <li className="border-t border-base-300 mt-1 pt-1">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
            >
              <span>🚪</span> Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
