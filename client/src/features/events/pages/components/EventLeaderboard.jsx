import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../../../profile/Components/Avatar";

const medals = ["🥇", "🥈", "🥉"];

export default function EventLeaderboard({ selectedEvent }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
          users.map((u) => [u.id, u])
        );

        const filtered = scores
          .filter((s) => memberIds.size === 0 || memberIds.has(s.user_id))
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
          .map((s, i) => {
            const u = userMap[s.user_id];
            return {
              user_id: s.user_id,
              first_name: u?.first_name ?? "?",
              last_name: u?.last_name ?? "?",
              profile: u?.profile ?? null,
              username: u?.username ?? `User #${s.user_id}`,
              goal_mark: s.score,
              rank: i === 0 ? "Gold" : i === 1 ? "Silver" : i === 2 ? "Bronze" : `#${i + 1}`,
            };
          });

        setEntries(filtered);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedEvent?.id]);

  if (!selectedEvent) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-accent flex items-center gap-1.5">
          <span className="inline-block w-[3px] h-4 rounded-full bg-yellow-400/70 mr-1" /> Leaderboard
        </h2>
        <div className="bg-base-200 rounded-xl border border-base-300 p-4 text-base-content/50 text-sm">
          Select a current event to see rankings.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-accent flex items-center gap-1.5">
        <span className="text-yellow-400 text-base">⚡</span> Leaderboard
      </h2>
      <p className="text-sm text-secondary -mt-1">{selectedEvent.name}</p>

      {loading && <p className="text-sm text-base-content/50">Loading...</p>}
      {error && <p className="text-sm text-error">{error}</p>}

      {!loading && !error && entries.length === 0 && (
        <div className="bg-base-200 rounded-xl border border-base-300 p-4 text-sm text-base-content/50">
          No results yet.
        </div>
      )}

      {entries.map((entry, index) => {
        const pos = index + 1;
        const isTopThree = pos <= 3;
        return (
          <div
            key={entry.user_id}
            className={`flex items-center gap-3 bg-base-300 px-3 py-2.5 rounded-lg border transition-all duration-200 ${
              isTopThree
                ? "border-yellow-400/50 shadow-[0_0_8px_rgba(250,204,21,0.12)]"
                : "border-blue-400/30"
            }`}
          >
            {/* Position number */}
            <span className={`text-sm font-bold w-5 flex-shrink-0 ${isTopThree ? "text-yellow-400" : "text-gray-500"}`}>
              {pos}.
            </span>

            {/* Medal */}
            <span className="text-base flex-shrink-0">{medals[index] ?? "🏅"}</span>

            {/* Avatar */}
            <div
              className="relative w-9 h-9 rounded-full overflow-hidden bg-base-200 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all justify-center items-center pt-2"
              onClick={() => navigate(`/profile/${entry.user_id}`)}
            >
              <Avatar userData={{ first_name: entry.first_name, last_name: entry.last_name, profile: entry.profile }} />
            </div>

            {/* Name + rank */}
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/profile/${entry.user_id}`)}>
              <p className="font-semibold text-sm text-base-content hover:underline truncate">{entry.username}</p>
              <p className="text-[10px] uppercase text-base-content/50 leading-none">{entry.rank}</p>
            </div>

            {/* Score */}
            <span className="text-yellow-400 font-mono font-bold text-sm flex-shrink-0">
              {((entry.goal_mark / 20) * 1.27).toFixed(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
