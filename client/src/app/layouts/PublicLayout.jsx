import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#0f0d17]">
      <Outlet />
    </div>
  );
}
