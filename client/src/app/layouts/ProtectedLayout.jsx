import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-[#0f0d17]">
      {/* Navbar inserted here when ready */}
      <Outlet />
    </div>
  );
}
