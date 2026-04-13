import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";
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

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <TopBar
        user={user}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

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
