import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/AuthProvider";
import EventsWidget from "../components/EventsWidget";
import GoalsWidget from "../components/GoalsWidget";
import ProgressWidget from "../components/ProgressWidget";
import MiniCalendarWidget from "../components/MiniCalendarWidget";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <h1 className="text-3xl font-bold text-primary mb-6 tracking-wide">
        DASHBOARD
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <EventsWidget />
        <GoalsWidget />
        <ProgressWidget />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-6">
        <MiniCalendarWidget />
      </div>
    </div>
  );
}
