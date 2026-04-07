import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-[#0f0d17]">
      <Navbar />
      <Outlet />
    </div>
  );
}
