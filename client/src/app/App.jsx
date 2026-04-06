import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../features/dashboard/pages/Dashboard";
import Calendar from "../features/calendar/pages/Calendar";
import Events from "../features/events/pages/Events";
import Leaderboard from "../features/leaderboard/pages/Leaderboard";
import Profile from "../features/profile/pages/Profile";
import Workouts from "../features/workouts/pages/Workouts";

function App() {
  return (
    <div>
      <h1 className="4xl underline">Here's your app stuff:</h1>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/events" element={<Events />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  );
}

export default App;
