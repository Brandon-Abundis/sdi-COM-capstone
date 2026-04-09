import { useState, useEffect } from "react";
import { useAuth } from "../../../app/AuthProvider";
import { fetchUserGoals } from "../api/userGoals";

export default function GoalsWidget() {
  const { user } = useAuth();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGoals = async () => {
      if (!user?.id) return;
      try {
        const goalsData = await fetchUserGoals(user.id);
        setGoal(goalsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadGoals();
  }, [user?.id]);

  if (loading)
    return <div className="card bg-base-200 p-4">Loading goals...</div>;
  if (error)
    return (
      <div className="card bg-base-200 p-4 text-error">Error: {error}</div>
    );

  // Helper to format the time to "minutes:seconds"
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return null;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper to format the goal and check if it exists
  const formatGoalDetail = (label, value) => {
    if (!value || value === 0) return null;
    return (
      <div key={label} className="text-sm text-base-content">
        <span className="font-semibold text-secondary">{label}:</span> {value}
      </div>
    );
  };

  return (
    <div className="card bg-base-200 p-4">
      <h3 className="text-2xl font-semibold text-primary mb-4">Active Goals</h3>
      {goal ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-bold text-secondary">{goal.name}</h4>
            {goal.type && (
              <p className="text-sm text-base-content capitalize">
                {goal.type} Goal
              </p>
            )}
          </div>

          <div className="space-y-1">
            {formatGoalDetail("Target Time", formatTime(goal.time))}
            {formatGoalDetail(
              "Target Distance",
              goal.distance ? `${goal.distance} miles` : null,
            )}
            {formatGoalDetail("Target Reps", goal.reps)}
            {formatGoalDetail(
              "Target Weight",
              goal.weight ? `${goal.weight} lbs` : null,
            )}
            {formatGoalDetail("Focus Area", goal.muscle_group)}
          </div>
        </div>
      ) : (
        <p className="text-md text-base-content">No active goals.</p>
      )}
    </div>
  );
}
