import { useEffect, useState } from "react";
import GroupSidebar from "./components/GroupSidebar";
import GroupChat from "./components/GroupChat";
import GroupCalendar from "./components/GroupCalendar";
import DirectMessage from "./components/DirectMessage";

const EMPTY_GLOBAL = { title: "", description: "", start_date: "", end_date: "", start_time: "", end_time: "" };

function GlobalEventModal({ onClose }) {
  const [form, setForm] = useState(EMPTY_GLOBAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function set(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.start_date) {
      setError("Title and start date are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/global/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || null,
          start_date: form.start_date,
          end_date: form.end_date || form.start_date,
          start_time: form.start_time || null,
          end_time: form.end_time || null,
          user_id: user.id,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || "Failed to create event.");
        return;
      }
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch {
      setError("Network error — check connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#16112a] border border-[#2a2245] rounded-2xl p-6 w-96 flex flex-col gap-4 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#c084fc] uppercase tracking-wide">📢 Create Global Event</h2>
            <p className="text-xs text-[#e2dff5]/50 mt-0.5">Visible to all users</p>
          </div>
          <button onClick={onClose} className="text-[#e2dff5]/40 hover:text-[#c084fc] text-lg">✕</button>
        </div>

        {success ? (
          <p className="text-sm text-[#34d399] text-center py-4">Event created!</p>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">Title *</label>
                <input
                  autoFocus
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Annual PT Assessment"
                  className="w-full bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Optional details..."
                  rows={2}
                  className="w-full bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">Start Date *</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => set("start_date", e.target.value)}
                    className="w-full bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">End Date</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => set("end_date", e.target.value)}
                    className="w-full bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">Start Time</label>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => set("start_time", e.target.value)}
                    className="w-full bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">End Time</label>
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => set("end_time", e.target.value)}
                    className="w-full bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-[#f87171]">{error}</p>}

            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#e2dff5]/60 hover:text-[#c084fc] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 text-xs font-bold bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-[#2a2245] disabled:text-[#e2dff5]/40 text-white rounded-lg transition-colors"
              >
                {saving ? "Creating..." : "Broadcast Event"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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
          <button onClick={onClose} className="text-[#e2dff5]/40 hover:text-[#c084fc] text-lg">✕</button>
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
                    <div key={u.id} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-[#7c3aed]/20 transition-colors">
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
  const [showGlobalEvent, setShowGlobalEvent] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.is_admin === true;

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
      {showGlobalEvent && (
        <GlobalEventModal onClose={() => setShowGlobalEvent(false)} />
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
            {/* Global Event button — admins only */}
            {isAdmin && (
              <button
                onClick={() => setShowGlobalEvent(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1838] hover:bg-[#7c3aed]/20 border border-[#2a2245] hover:border-[#c084fc] text-[#c084fc] rounded-lg text-xs font-semibold transition-colors"
              >
                <span>📢</span> Global Event
              </button>
            )}

            {/* Invite Members button — groups only */}
            {isGroup && (
              <button
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1838] hover:bg-[#7c3aed]/20 border border-[#2a2245] hover:border-[#7c3aed] text-[#a78bfa] rounded-lg text-xs font-semibold transition-colors"
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
                    groupTab === "chat" ? "bg-[#7c3aed] text-white" : "text-[#e2dff5]/60 hover:text-[#c084fc]"
                  }`}
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => setGroupTab("calendar")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    groupTab === "calendar" ? "bg-[#7c3aed] text-white" : "text-[#e2dff5]/60 hover:text-[#c084fc]"
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