import { Route, Routes, Navigate } from "react-router-dom";

import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import Dashboard from "../features/dashboard/pages/Dashboard";
import Calendar from "../features/calendar/pages/Calendar";
import Events from "../features/events/pages/Events";
import Leaderboard from "../features/leaderboard/pages/Leaderboard";
import Profile from "../features/profile/pages/Profile";
import Workouts from "../features/workouts/pages/Workouts";
import ChatAndGroup from "../features/chatandgroup/chatandgroup";
import PublicRoute from "./routes/PublicRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";

function App() {
  return (
    <Routes>
      <Route
        element={
          <PublicRoute>
            <PublicLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="events" element={<Events />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="workouts" element={<Workouts />} />
      </Route>

      {/* Catch-all for paths that do not match any listed above */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
