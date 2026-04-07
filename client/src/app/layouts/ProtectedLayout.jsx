import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "../Navbar/Sidebar.jsx";

export default function ProtectedLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#0f0d17]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-[#0f0d17] border-b border-[#1e1838]">
        <button
          onClick={toggleSidebar}
          className="text-[#e2dff5] hover:text-[#7c3aed] text-2xl"
        >
          ☰
        </button>

        {/* Profile icon */}
        <Link to="/profile" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Profile"
              src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
            />
          </div>
        </Link>
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
