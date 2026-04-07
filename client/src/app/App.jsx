import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../features/dashboard/pages/Dashboard";
import Calendar from "../features/calendar/pages/Calendar";
import Events from "../features/events/pages/Events";
import Leaderboard from "../features/leaderboard/pages/Leaderboard";
import Profile from "../features/profile/pages/Profile";
import Workouts from "../features/workouts/pages/Workouts";
import ChatAndGroup from "../features/chatandgroup/chatandgroup";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./Navbar/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <Workouts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
