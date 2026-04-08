import { useEffect, useState } from "react";

const rankColors = {
  Gold:   "text-yellow-400",
  Silver: "text-gray-300",
  Bronze: "text-orange-400",
};

const medals = ["🥇", "🥈", "🥉"];

export default function EventLeaderboard({ selectedEvent }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedEvent?.id) return;
    setLoading(true);
    setError(null);
    // Expects backend route: GET /events/:id/leaderboard
    fetch(`http://localhost:8080/events/${selectedEvent.id}/leaderboard`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        return res.json();
      })
      .then((data) => setEntries(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedEvent?.id]);

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

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#c084fc]">Leaderboard</h2>
      <p className="text-sm text-[#a78bfa]">{selectedEvent.name}</p>

      {loading && <p className="text-sm text-[#e2dff5]/50">Loading...</p>}
      {error && <p className="text-sm text-[#f87171]">{error}</p>}

      {!loading && !error && entries.length === 0 && (
        <div className="card bg-[#16112a] border border-[#1e1838] shadow p-4 text-sm text-[#e2dff5]/50">
          No results yet.
        </div>
      )}

      {entries.map((entry, index) => (
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
      ))}
    </div>
  );
}