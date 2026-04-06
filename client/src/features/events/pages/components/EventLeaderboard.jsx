// Mock leaderboard data keyed by event id
// Fields align with user schema: last_name, full_name, rank, goal
const mockLeaderboards = {
  10: [
    { user_id: 1, full_name: "J. DeCarlo", rank: "Gold",   goal_mark: "48.2 miles" },
    { user_id: 2, full_name: "E. Ortiz",   rank: "Silver", goal_mark: "41.5 miles" },
    { user_id: 3, full_name: "B. Adams",   rank: "Bronze", goal_mark: "35.0 miles" },
  ],
  11: [
    { user_id: 2, full_name: "E. Ortiz",   rank: "Gold",   goal_mark: "315 lbs" },
    { user_id: 4, full_name: "J. Torres",  rank: "Silver", goal_mark: "285 lbs" },
    { user_id: 1, full_name: "J. DeCarlo", rank: "Bronze", goal_mark: "275 lbs" },
  ],
  12: [
    { user_id: 3, full_name: "B. Adams",   rank: "Gold",   goal_mark: "120 reps" },
    { user_id: 1, full_name: "J. DeCarlo", rank: "Silver", goal_mark: "98 reps" },
    { user_id: 4, full_name: "J. Torres",  rank: "Bronze", goal_mark: "85 reps" },
  ],
  13: [
    { user_id: 4, full_name: "J. Torres",  rank: "Gold",   goal_mark: "18:42" },
    { user_id: 2, full_name: "E. Ortiz",   rank: "Silver", goal_mark: "19:15" },
    { user_id: 3, full_name: "B. Adams",   rank: "Bronze", goal_mark: "20:01" },
  ],
};

const rankColors = {
  Gold:   "text-yellow-400",
  Silver: "text-gray-300",
  Bronze: "text-orange-400",
};

const medals = ["🥇", "🥈", "🥉"];

export default function EventLeaderboard({ selectedEvent }) {
  if (!selectedEvent) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[#c084fc]">Leaderboard</h2>
        <div className="card bg-[#16112a] border border-[#1e1838] shadow p-4 text-[#e2dff5]/50 text-sm">
          Select an event to see rankings.
        </div>
      </div>
    );
  }

  const entries = mockLeaderboards[selectedEvent.id] ?? [];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#c084fc]">Leaderboard</h2>
      <p className="text-sm text-[#a78bfa]">{selectedEvent.name}</p>
      {entries.length === 0 ? (
        <div className="card bg-[#16112a] border border-[#1e1838] shadow p-4 text-sm text-[#e2dff5]/50">
          No results yet.
        </div>
      ) : (
        entries.map((entry, index) => (
          <div key={entry.user_id} className="card bg-[#16112a] border border-[#1e1838] shadow">
            <div className="card-body p-4 flex flex-row items-center gap-3">
              <span className="text-xl">{medals[index] ?? "🏅"}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#e2dff5]">{entry.full_name}</p>
                <p className="text-xs text-[#e2dff5]/60">{entry.goal_mark}</p>
              </div>
              <span className={`text-xs font-bold ${rankColors[entry.rank] ?? ""}`}>
                {entry.rank}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}