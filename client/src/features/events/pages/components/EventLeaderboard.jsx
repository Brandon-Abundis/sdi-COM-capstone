import { useEffect, useState } from "react";

const rankColors = {
  Gold:   "text-warning",
  Silver: "text-base-content/60",
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
        <h2 className="text-lg font-bold text-accent">Leaderboard</h2>
        <div className="card bg-base-200 border border-base-300 shadow p-4 text-base-content/50 text-sm">
          Select a current event to see rankings.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-accent">Leaderboard</h2>
      <p className="text-sm text-secondary">{selectedEvent.name}</p>

      {loading && <p className="text-sm text-base-content/50">Loading...</p>}
      {error && <p className="text-sm text-error">{error}</p>}

      {!loading && !error && entries.length === 0 && (
        <div className="card bg-base-200 border border-base-300 shadow p-4 text-sm text-base-content/50">
          No results yet.
        </div>
      )}

      {entries.map((entry, index) => (
        <div key={entry.user_id} className="card bg-base-200 border border-base-300 shadow">
          <div className="card-body p-4 flex flex-row items-center gap-3">
            <span className="text-xl">{medals[index] ?? "🏅"}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm text-base-content">{entry.full_name}</p>
              <p className="text-xs text-base-content/60">Score: {entry.goal_mark}</p>
            </div>
            <span className={`text-xs font-bold ${rankColors[entry.rank] ?? "text-base-content/50"}`}>
              {entry.rank}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
