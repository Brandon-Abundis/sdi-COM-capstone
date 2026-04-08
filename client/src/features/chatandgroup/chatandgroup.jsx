import { useEffect, useState } from "react";
import GroupSidebar from "./components/GroupSidebar";
import GroupChat from "./components/GroupChat";
import GroupCalendar from "./components/GroupCalendar";
import DirectMessage from "./components/DirectMessage";

function InviteModal({ group, onClose }) {
  const [allUsers, setAllUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [invitedIds, setInvitedIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/users/")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setAllUsers(data);
        setMembers(data.filter((u) => (group.user_ids ?? []).includes(u.id)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [group.id]);

  const memberSet = new Set(group.user_ids ?? []);

  const nonMembers = allUsers.filter(
    (u) =>
      !memberSet.has(u.id) &&
      (query.trim()
        ? `${u.first_name} ${u.last_name}`.toLowerCase().includes(query.toLowerCase())
        : true)
  );

  async function handleInvite(userId) {
    await fetch(`http://localhost:8080/groups/${group.id}/invite`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    setInvitedIds((prev) => new Set([...prev, userId]));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#16112a] border border-[#2a2245] rounded-2xl p-6 w-96 flex flex-col gap-4 shadow-xl max-h-[80vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold text-[#c084fc] uppercase tracking-wide">Invite Members</h2>
            <p className="text-xs text-[#e2dff5]/50 mt-0.5"># {group.name}</p>
          </div>
          <button onClick={onClose} className="text-[#e2dff5]/40 hover:text-[#e2dff5] text-lg">✕</button>
        </div>

        {loading ? (
          <p className="text-xs text-[#e2dff5]/40">Loading...</p>
        ) : (
          <>
            {/* Current members */}
            <div className="flex-shrink-0">
              <p className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider mb-2">
                Current Members — {members.length}
              </p>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {members.length === 0 && (
                  <p className="text-xs text-[#e2dff5]/30">No members yet.</p>
                )}
                {members.map((u) => (
                  <div key={u.id} className="flex items-center gap-1.5 bg-[#1e1838] border border-[#2a2245] rounded-full px-2.5 py-1">
                    <div className="w-4 h-4 rounded-full bg-[#2a2245] flex items-center justify-center text-[9px] text-[#a78bfa] font-bold">
                      {u.first_name?.[0]}
                    </div>
                    <span className="text-[10px] text-[#e2dff5]/80">{u.first_name} {u.last_name}</span>
                    <span className="text-[9px] text-[#a78bfa]/60">{u.rank}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1e1838] flex-shrink-0" />

            {/* Add people */}
            <div className="flex flex-col gap-2 overflow-hidden">
              <p className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider flex-shrink-0">Add People</p>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors flex-shrink-0"
              />
              <div className="flex flex-col gap-1 overflow-y-auto">
                {nonMembers.length === 0 && (
                  <p className="text-xs text-[#e2dff5]/40 text-center py-3">
                    {query ? "No users match." : "Everyone is already a member."}
                  </p>
                )}
                {nonMembers.map((u) => {
                  const invited = invitedIds.has(u.id);
                  return (
                    <div key={u.id} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-[#1e1838] transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#2a2245] flex items-center justify-center text-sm text-[#a78bfa] font-bold flex-shrink-0">
                          {u.first_name?.[0]}
                        </div>
                        <div>
                          <p className="text-xs text-[#e2dff5] font-semibold">{u.first_name} {u.last_name}</p>
                          <p className="text-[10px] text-[#a78bfa]">{u.rank}</p>
                        </div>
                      </div>
                      {invited ? (
                        <span className="text-[10px] text-[#34d399] font-semibold">Invited ✓</span>
                      ) : (
                        <button
                          onClick={() => handleInvite(u.id)}
                          className="text-[10px] px-3 py-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-md font-semibold transition-colors"
                        >
                          Invite
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

export default function ChatAndGroup() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [groupTab, setGroupTab] = useState("chat");
  const [showInvite, setShowInvite] = useState(false);

  function handleSelect(item) {
    setSelectedItem(item);
    setGroupTab("chat");
    setShowInvite(false);
  }

  const isGroup = selectedItem?.type === "group";
  const isDM    = selectedItem?.type === "dm";

  return (
    <div className="flex h-screen bg-[#0f0d17] overflow-hidden">
      {showInvite && isGroup && (
        <InviteModal group={selectedItem.data} onClose={() => setShowInvite(false)} />
      )}

      <GroupSidebar selectedItem={selectedItem} onSelect={handleSelect} />

      {/* Main panel */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top bar */}
        <div className="px-4 py-3 border-b border-[#1e1838] flex items-center justify-between">
          <span className="font-bold text-[#e2dff5]">
            {isGroup && `# ${selectedItem.data.name}`}
            {isDM    && selectedItem.data.full_name}
            {!selectedItem && <span className="text-[#e2dff5]/40">Select a group or message</span>}
          </span>

          <div className="flex items-center gap-2">
            {/* Invite Members button — groups only */}
            {isGroup && (
              <button
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1838] hover:bg-[#2a2245] border border-[#2a2245] hover:border-[#7c3aed] text-[#a78bfa] rounded-lg text-xs font-semibold transition-colors"
              >
                <span>👤</span> Invite Members
              </button>
            )}

            {/* Chat / Calendar tabs — groups only */}
            {isGroup && (
              <div className="flex gap-1 bg-[#1e1838] rounded-lg p-1">
                <button
                  onClick={() => setGroupTab("chat")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    groupTab === "chat" ? "bg-[#7c3aed] text-white" : "text-[#e2dff5]/60 hover:text-[#e2dff5]"
                  }`}
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => setGroupTab("calendar")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    groupTab === "calendar" ? "bg-[#7c3aed] text-white" : "text-[#e2dff5]/60 hover:text-[#e2dff5]"
                  }`}
                >
                  📅 Calendar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {!selectedItem && (
            <div className="flex-1 flex items-center justify-center text-[#e2dff5]/30 text-sm">
              Select a group or DM from the sidebar.
            </div>
          )}
          {isGroup && groupTab === "chat"     && <GroupChat     group={selectedItem.data} />}
          {isGroup && groupTab === "calendar" && <GroupCalendar group={selectedItem.data} />}
          {isDM                               && <DirectMessage dmUser={selectedItem.data} />}
        </div>
      </div>
    </div>
  );
}