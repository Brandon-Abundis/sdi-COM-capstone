import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../../../profile/Components/Avatar";

const rankColors = {
  Gold:   "text-warning drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]",
  Silver: "text-slate-300",
  Bronze: "text-orange-400",
};

const medals = ["🥇", "🥈", "🥉"];

export default function EventLeaderboard({ selectedEvent }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedEvent?.id) return;
    setLoading(true);
    setEntries([]);

    Promise.all([
      fetch(`http://localhost:8080/groups/id/${selectedEvent.group_id}`).then((r) => r.json()),
      fetch("http://localhost:8080/scores/").then((r) => r.json()),
      fetch("http://localhost:8080/users/").then((r) => r.json()),
    ])
      .then(([group, scores, users]) => {
        const memberIds = new Set(group?.user_ids ?? []);
        const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

        const filtered = scores
          .filter((s) => memberIds.has(s.user_id))
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
          .map((s, i) => {
            const u = userMap[s.user_id];
            return {
              user_id: s.user_id,
              first_name: u?.first_name,
              last_name: u?.last_name,
              profile: u?.profile,
              username: u?.username,
              score: s.score,
              rankName: i === 0 ? "Gold" : i === 1 ? "Silver" : i === 2 ? "Bronze" : `#${i + 1}`,
              index: i
            };
          });
        setEntries(filtered);
      })
      .finally(() => setLoading(false));
  }, [selectedEvent?.id]);

  if (!selectedEvent) return (
    <div className="flex flex-col gap-3 h-full  items-center opacity-30 border-2 border-dashed border-[#2a2245] rounded-3xl p-10 mx-2">
      <span className="text-4xl">📊</span>
      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-center">
        Select an Active Group Event <br/> to display standings
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-5 px-2">
      {/* Header - Scaled Up */}
      <div className="px-1">
        <h2 className="text-lg font-bold text-accent px-1">Active Leaderboard</h2>
        <p className="text-[14px]  text-[#e2dff5]/40  tracking-tighter mt-1">
          {selectedEvent.group_name} : <span className="text-[#c084fc]/80 ">{selectedEvent.name}</span>
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-[#16112a] animate-pulse rounded-2xl border border-[#2a2245]" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {entries.map((entry, index) => {
            const isTopThree = index < 3;

            return (
              <div
                key={entry.user_id}
                onClick={() => navigate(`/profile/${entry.user_id}`)}
                className={`flex items-center justify-between p-3.5 px-5 rounded-2xl border transition-all cursor-pointer group
                  ${isTopThree
                    ? "bg-[#1c1633] border-[#7c3aed]/30 shadow-xl"
                    : "bg-[#110d21] border-[#2a2245]/60 hover:border-[#7c3aed]/40 hover:bg-[#16112a]"
                  }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank  xxx*/}
                  <span className="text-2xl w-8 flex justify-center drop-shadow-xl">
                    {medals[index] ?? <span className="text-[11px] font-black text-[#e2dff5]/20">#{index + 1}</span>}
                  </span>

                  {/* Avatar Container - fix the thingy ?????????*/}
                  <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-[#2a2245] bg-black/40 flex-shrink-0 group-hover:border-[#7c3aed]/50 transition-colors">
                    {/* Shifting the component down */}
                    <div className="relative top-[6px] scale-110">
                      <Avatar userData={entry} />
                    </div>
                  </div>

                  {/* User Card modified*/}
                  <div className="flex flex-col">
                    <p className="text-[14px] font-bold text-[#e2dff5] group-hover:text-white leading-tight tracking-tight">
                      {entry.username}
                    </p>
                    <p className="text-[10px] font-bold text-[#e2dff5]/30 uppercase tracking-widest mt-0.5">
                      Current Score: <span className="text-[10px] text-[#c084fc] font-mono font-black">{entry.score}</span>
                    </p>
                  </div>
                </div>

                {/* Status Tag */}
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-lg
                  ${rankColors[entry.rankName] ? `${rankColors[entry.rankName]} bg-[#7c3aed]/10 border border-[#7c3aed]/20` : "text-[#e2dff5]/20"}
                `}>
                  {entry.rankName}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

