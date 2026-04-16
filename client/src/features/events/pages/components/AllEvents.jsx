import { useEffect, useState } from "react";
import { useAuth } from "../../../../app/AuthProvider";

export default function CurrentEvents({ selectedEvent, onSelectEvent }) {
  const [allGroups, setAllGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const groupsRes = await fetch("http://localhost:8080/groups/");
        const groups = await groupsRes.json();
        setAllGroups(groups);

        // Fetching events for every group
        const eventPromises = groups.map((g) =>
          fetch(`http://localhost:8080/groups/group_events/id/${g.id}`).then(
            (res) => res.json(),
          ),
        );

        const results = await Promise.all(eventPromises);
        const now = new Date().setHours(0, 0, 0, 0);

        const current = results.flat().filter((e) => {
          const start = new Date(e.start_date).setHours(0, 0, 0, 0);
          const end = new Date(e.end_date || e.start_date).setHours(0, 0, 0, 0);
          return start <= now && now <= end;
        });

        setEvents(current);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold text-accent px-1">
          All Ongoing Events
        </h2>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
          <span className="text-[10px] font-bold text-[#e2dff5]/20 uppercase">
            Live: {events.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {events.map((event) => {
          const group = allGroups.find((g) => g.id === event.group_id);
          const isMember = group?.user_ids?.includes(user.id);
          const isSelected = selectedEvent?.id === event.id;

          return (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className={`flex flex-col rounded-2xl p-5 transition-all cursor-pointer group relative overflow-hidden
                ${isSelected ? "ring-1 ring-[#7c3aed] shadow-[0_0_20px_rgba(124,58,237,0.2)]" : "shadow-l"}
                ${
                  isMember
                    ? "bg-[#16112a] border border-[#7c3aed]/30"
                    : "bg-[#0d0a1a] border border-[#2a2245] opacity-85 hover:opacity-100"
                }`}
            >
              {/* Membership Ribbon */}
              {isMember && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-[#7c3aed] text-white text-[8px] font-black uppercase tracking-tighter rounded-bl-xl shadow-lg">
                  Active
                </div>
              )}

              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`text-[16.5px] font-bold truncate flex-shrink ${isMember ? "text-[#e2dff5]" : "text-[#e2dff5]/50"}`}
                  >
                    {event.name}
                  </h3>
                  <p className="text-[10px] font-bold text-[#c084fc] uppercase tracking-widest mt-1">
                    {event.group_name || "Joint Task Force"}
                  </p>
                  <span className="text-[11px] text-[#e2dff5]/70 leading-relaxed italic">
                    {" "}
                    Description:{" "}
                  </span>
                </div>
              </div>

              {/* The little note box thingy */}
              <div
                className={`rounded-xl p-4 mb-4 border ${isMember ? "bg-black/40 border-[#7c3aed]/20" : "bg-transparent border-dashed border-[#2a2245]"}`}
              >
                {event.goalsDetails?.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1.5">
                    {event.goalsDetails.map((g, idx) => (
                      <li
                        key={idx}
                        className="text-[11px] text-[#e2dff5]/70 leading-relaxed"
                      >
                        {g.notes}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-[#e2dff5]/40 leading-relaxed italic">
                    No notes to pull from.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#2a2245]/60">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#e2dff5]/30 uppercase">
                    <span>👥</span>
                    <span>{group?.user_ids?.length || 0} active</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#e2dff5]/30 uppercase">
                    <span>🎯</span>
                    <span>{event.goals_list?.length || 0} goals</span>
                  </div>
                </div>

                {!isMember && (
                  <button className="text-[9px] font-black text-[#c084fc] uppercase tracking-widest bg-[#c084fc]/10 px-4 py-1.5 rounded-lg border border-[#c084fc]/30 hover:bg-[#c084fc]/20 transition-all active:scale-95">
                    Not in Group
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
