import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import OpenIcon from "../components/OpenIcon.jsx";
import { useAuth } from "../AuthProvider.jsx";

export default function ProtectedLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-[#1e1838]">
        <button
          onClick={toggleSidebar}
          className="text-[#e2dff5] hover:text-primary text-2xl hover:cursor-pointer"
        >
          <OpenIcon />
        </button>

        {/* PFP hover dropdown */}
        <div className="dropdown dropdown-end dropdown-hover">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar outline-1 outline-accent hover:outline-[#7c3aed] bg-[#2a2245] select-none"
          >
            <span className="text-sm font-bold text-[#c084fc]">{initials}</span>
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content z-50 mt-2 w-52 rounded-xl border border-[#1e1838] bg-[#16112a] p-2 shadow-xl flex flex-col gap-0.5"
          >
            {/* User info header */}
            <li className="px-3 py-2 border-b border-[#1e1838] mb-1">
              <p className="text-sm font-semibold text-[#e2dff5]">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-[#a78bfa]">{user?.rank}</p>
            </li>

            <li>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#e2dff5] hover:bg-[#2a2245] hover:text-[#c084fc] transition-colors"
              >
                <span>👤</span> My Profile
              </Link>
            </li>

            <li>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#e2dff5] hover:bg-[#2a2245] hover:text-[#c084fc] transition-colors"
              >
                <span>⚙️</span> Settings
              </Link>
            </li>

            <li className="border-t border-[#1e1838] mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#f87171] hover:bg-[#2a1a1a] transition-colors"
              >
                <span>🚪</span> Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "w-full"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
