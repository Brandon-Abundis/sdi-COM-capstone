import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import OpenIcon from "./OpenIcon.jsx";
import Avatar from "../../features/profile/Components/Avatar.jsx";

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

  return (
    <div className="sticky top-0 z-40 flex items-center px-4 py-2 border-b border-base-300 bg-base-100">
      <div className="flex-1">
        <button
          onClick={onToggleSidebar}
          className="text-base-content hover:text-primary hover:cursor-pointer p-2"
        >
          <OpenIcon />
        </button>
      </div>

      <div className="flex-1 flex justify-center">
        <Link to="/dashboard">
          <img className="h-20 cursor-pointer" src="/WarfighterFit_logo.png" />
        </Link>
      </div>

      {/* PFP hover dropdown */}
      <div className="flex-1 flex justify-end items-center gap-4">
        {/* Logged in as section */}
        <div className="flex flex-col items-end">
          <p className="text-xs text-secondary">Logged in as:</p>
          <p className="text-sm font-semibold text-base-content">
            {user?.username}
          </p>
        </div>

        <div className="relative">
          <div
            role="button"
            onMouseEnter={openProfile}
            onMouseLeave={scheduleClose}
            className="btn btn-ghost btn-circle avatar ring-1 ring-accent hover:ring-primary bg-neutral select-none w-11 h-11"
          >
            <Avatar userData={user}> </Avatar>
          </div>

          <ul
            onMouseEnter={openProfile}
            onMouseLeave={scheduleClose}
            className={`absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-base-300 bg-base-200 p-2 shadow-xl flex flex-col gap-0.5 ${
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
    </div>
  );
}
