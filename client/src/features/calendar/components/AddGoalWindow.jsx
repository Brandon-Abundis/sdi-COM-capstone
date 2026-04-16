import React, { useState, useEffect} from 'react';
import { useAuth } from "../../../app/AuthProvider.jsx";

export default function AddGoalWindow(setAddWorkoutOpen) {
  const { user } = useAuth();

  return (
    
    <>
      <p>This likely needs to change.
          I will first need to populate the calendar with goals for the day, or not.
          Possibly change first window to show the goals for the scheduled day w/ a switch.
          ignore add goals for now, only add Workout for now.
      </p>
    </>
  );
};