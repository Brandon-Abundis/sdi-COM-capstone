export default function ViewAllGoalsModal({ isOpen, onClose, goals }) {
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return null;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-200 border border-base-300 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary tracking-wide">
            All Goals ({goals.length})
          </h2>
          <button
            onClick={onClose}
            className="text-base-content/50 hover:text-primary cursor-pointer text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {goals.length > 0 ? (
            <div className="space-y-4 pr-2">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="border-l-4 border-primary pl-4 pb-4"
                >
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
