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
    setEntries([]);

    Promise.all([
      fetch(`http://localhost:8080/groups/id/${selectedEvent.group_id}`)
        .then((r) => (r.ok ? r.json() : null)),
      fetch("http://localhost:8080/scores/")
        .then((r) => (r.ok ? r.json() : [])),
      fetch("http://localhost:8080/users/")
        .then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([group, scores, users]) => {
        const memberIds = new Set(group?.user_ids ?? []);
        const userMap = Object.fromEntries(
          users.map((u) => [u.id, `${u.first_name} ${u.last_name}`])
        );

        const filtered = scores
          .filter((s) => memberIds.size === 0 || memberIds.has(s.user_id))
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
          .map((s, i) => ({
            user_id: s.user_id,
            full_name: userMap[s.user_id] ?? `User #${s.user_id}`,
            goal_mark: s.score,
            rank: i === 0 ? "Gold" : i === 1 ? "Silver" : i === 2 ? "Bronze" : `#${i + 1}`,
          }));

        setEntries(filtered);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedEvent?.id]);

  if (!selectedEvent) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[#c084fc]">Leaderboard</h2>
        <div className="card bg-[#16112a] border border-[#1e1838] shadow p-4 text-[#e2dff5]/50 text-sm">
          Select a current event to see rankings.
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
              <p className="text-xs text-[#e2dff5]/60">Score: {entry.goal_mark}</p>
            </div>
            <span className={`text-xs font-bold ${rankColors[entry.rank] ?? "text-[#e2dff5]/50"}`}>
              {entry.rank}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
