import { useState } from "react";
import { updateUserGoal } from "../api/userGoals";
import { updateUserXP } from "../api/userProgress";
import { useAuth } from "../../../app/AuthProvider";

export default function ViewAllGoalsModal({
  isOpen,
  onClose,
  goals,
  onGoalCompleted,
}) {
  const { user, refreshUser } = useAuth();
  const [completing, setCompleting] = useState(null);
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return null;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatGoalDetail = (label, value) => {
    if (!value || value === 0) return null;
    return (
      <div key={label} className="text-sm text-base-content">
        <span className="font-semibold text-secondary">{label}:</span> {value}
      </div>
    );
  };

  if (!isOpen) return null;

  // Filter goals to only show incomplete goals
  const incompleteGoals = goals.filter((goal) => !goal.completed);

  // Sort goals by updated_at (newest first)
  const sortedGoals = [...incompleteGoals].sort((a, b) => {
    const dateA = new Date(a.updated_at);
    const dateB = new Date(b.updated_at);
    return dateB - dateA;
  });

  const handleMarkCompleted = async (goalId) => {
    setCompleting(goalId);
    try {
      // Update goal completion status
      await updateUserGoal(goalId, { completed: true });

      // Increment user XP by 100
      if (user && user.id) {
        const currentXp = parseInt(user.xp) || 0;
        const newXp = currentXp + 100;
        await updateUserXP(user.id, newXp);
        await refreshUser();
      }

      onGoalCompleted(goalId);
    } catch (err) {
      console.error("Error marking goal as completed:", err);
    } finally {
      setCompleting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-200 border border-base-300 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary tracking-wide">
            Active Goals ({incompleteGoals.length})
          </h2>
          <button
            onClick={onClose}
            className="text-base-content/50 hover:text-primary cursor-pointer text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {incompleteGoals.length > 0 ? (
            <div className="space-y-4 pr-2">
              {sortedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="relative border-l-4 border-l-primary rounded-2xl pl-4 pb-2 hover:bg-base-300 group transition-colors"
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMarkCompleted(goal.id)}
                      disabled={completing === goal.id}
                      className="btn btn-xs btn-success"
                    >
                      {completing === goal.id ? "Completing..." : "✓ Complete"}
                    </button>
                  </div>
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
                  <div className="flex flex-col mt-2 pt-2 border-t border-base-300 text-xs text-base-content/50 ">
                    <p>Notes: {goal.notes}</p>
                    {goal.updated_at && (
                      <p>Modified at {formatDate(goal.updated_at)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-base-content/70">No goals found.</p>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t border-base-300">
          <button onClick={onClose} className="btn btn-sm btn-primary flex-1">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
