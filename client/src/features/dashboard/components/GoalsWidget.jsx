import { useState, useEffect } from "react";
import { useAuth } from "../../../app/AuthProvider";
import { fetchUserGoals } from "../api/userGoals";
import ViewAllGoalsModal from "./ViewAllGoalsModal";
import AddNewGoalModal from "./AddNewGoalModal";

export default function GoalsWidget() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllGoalsModal, setShowAllGoalsModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  useEffect(() => {
    const loadGoals = async () => {
      if (!user?.id) return;
      try {
        const goalsData = await fetchUserGoals(user.id);
        setGoals(Array.isArray(goalsData) ? goalsData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadGoals();
  }, [user?.id]);

  const handleGoalCreated = async (newGoal) => {
    // Add the new goal to the list
    setGoals((prevGoals) => [newGoal, ...prevGoals]);
    setShowAddGoalModal(false);
  };

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

      {goals.length > 0 && (
        <p className="text-sm text-base-content/70 mb-4">
          {goals.length} active goal{goals.length !== 1 ? "s" : ""}
        </p>
      )}

      {goals.length > 0 ? (
        <>
          <div className="space-y-4 mb-4">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="border-l-2 border-primary pl-4">
                <h4 className="text-lg font-bold text-secondary">
                  {goal.name}
                </h4>
                {goal.type && (
                  <p className="text-sm text-base-content capitalize">
                    {goal.type} Goal
                  </p>
                )}
                <div className="space-y-1 mt-2">
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
            ))}
          </div>

          <div className="flex gap-2 pt-4 border-t border-base-300">
            {goals.length > 3 && (
              <button
                onClick={() => setShowAllGoalsModal(true)}
                className="btn btn-sm btn-outline flex-1"
              >
                View All Goals ({goals.length})
              </button>
            )}
            <button
              onClick={() => setShowAddGoalModal(true)}
              className="btn btn-sm btn-outline flex-1"
            >
              Add New Goal
            </button>
          </div>
        </>
      ) : (
        <p className="text-md text-base-content">No active goals.</p>
      )}

      <ViewAllGoalsModal
        isOpen={showAllGoalsModal}
        onClose={() => setShowAllGoalsModal(false)}
        goals={goals}
      />

      <AddNewGoalModal
        isOpen={showAddGoalModal}
        onClose={() => setShowAddGoalModal(false)}
        userId={user?.id}
        onGoalCreated={handleGoalCreated}
      />
    </div>
  );
}
