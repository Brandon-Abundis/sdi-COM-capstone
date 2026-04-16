import { useEffect, useState } from "react";
import { useAuth } from "../../../app/AuthProvider";
import Avatar from "../../profile/Components/Avatar";

/**
 * CreateGroupModal — Simple form for creating a new group.
 * POSTs the group name + creator's userId, then calls `onCreated` with the
 * returned group object so the sidebar can add it immediately without a refresh.
 */
function CreateGroupModal({ userId, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /** Submits the new group form; calls onCreated on success */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/groups/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), user_id: userId }),
      });
      if (res.ok) {
        const group = await res.json();
        onCreated(group);
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#16112a] border border-[#2a2245] rounded-2xl p-6 w-80 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#c084fc] uppercase tracking-wide">Create a Group</h2>
          <button onClick={onClose} className="text-[#e2dff5]/40 hover:text-[#c084fc] text-lg">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] uppercase text-[#e2dff5]/50 font-bold tracking-wider">Group Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Iron Wolves"
              className="mt-1 w-full bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
            />
          </div>
          <div className="flex gap-2 mt-1">
            <button type="submit" disabled={submitting} className="flex-1 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
              {submitting ? "Creating..." : "Create"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-[#1e1838] text-[#e2dff5]/60 rounded-lg text-sm border border-[#2a2245] hover:text-[#c084fc] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * NewDMModal — User picker for starting a new direct message conversation.
 * Receives the full user list from the parent (already loaded), filters it
 * by the search query, and calls `onSelect` with the chosen user's DM descriptor.
 */
function NewDMModal({ dmUsers, onClose, onSelect }) {
  const [query, setQuery] = useState("");

  // Filter the user list to only those whose display name includes the search term
  const filtered = query.trim()
    ? dmUsers.filter((u) =>
        (u.username || `${u.first_name} ${u.last_name}`).toLowerCase().includes(query.toLowerCase())
      )
    : dmUsers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#16112a] border border-[#2a2245] rounded-2xl p-6 w-80 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#c084fc] uppercase tracking-wide">New Message</h2>
          <button onClick={onClose} className="text-[#e2dff5]/40 hover:text-[#c084fc] text-lg">✕</button>
        </div>
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
        />
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-xs text-[#e2dff5]/40 text-center py-4">No users found.</p>
          )}
          {filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                onSelect({ type: "dm", data: { user_id: u.id, username: u.username || `${u.first_name} ${u.last_name}`, rank: u.rank } });
                onClose();
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#7c3aed]/20 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-[#2a2245] cursor-pointer flex-shrink-0 hover:ring-2 hover:ring-primary transition-all flex justify-center items-center pt-2">
                <Avatar userData={u} />
              </div>
              <div>
                <p className="text-sm text-[#e2dff5] font-semibold">{u.username || `${u.first_name} ${u.last_name}`}</p>
                <p className="text-[10px] text-[#a78bfa]">{u.rank}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * InviteModal (sidebar version) — Reuses the already-fetched `allUsers` list from
 * GroupSidebar to avoid a second network request. Shows current members at the top
 * and lets the user search + invite non-members via a PATCH request.
 */
function InviteModal({ group, allUsers, onClose }) {
  const [query, setQuery] = useState("");
  // Tracks locally-invited IDs this session to show "Invited ✓" optimistically
  const [invitedIds, setInvitedIds] = useState(new Set());
  // Set for O(1) membership checks when splitting members vs non-members
  const memberSet = new Set(group.user_ids ?? []);

  const filtered = (query.trim()
    ? allUsers.filter((u) =>
        (u.username || `${u.first_name} ${u.last_name}`).toLowerCase().includes(query.toLowerCase())
      )
    : allUsers
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
      <div className="bg-[#16112a] border border-[#2a2245] rounded-2xl p-6 w-96 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#c084fc] uppercase tracking-wide">Invite to Group</h2>
            <p className="text-xs text-[#e2dff5]/50 mt-0.5"># {group.name}</p>
          </div>
          <button onClick={onClose} className="text-[#e2dff5]/40 hover:text-[#c084fc] text-lg">✕</button>
        </div>

        {/* Current members */}
        <div>
          <p className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider mb-2">
            Current Members — {group.user_ids?.length ?? 0}
          </p>
          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
            {(group.user_ids ?? []).length === 0 && (
              <p className="text-xs text-[#e2dff5]/30">No members yet.</p>
            )}
            {filtered
              .filter((u) => memberSet.has(u.id))
              .map((u) => (
                <div key={u.id} className="flex items-center gap-1.5 bg-[#1e1838] rounded-full px-2 py-1">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-[#2a2245] flex-shrink-0 flex justify-center items-center pt-2">
                    <Avatar userData={u} />
                  </div>
                  <span className="text-[10px] text-[#e2dff5]/70">{u.username || `${u.first_name} ${u.last_name}`}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="border-t border-[#1e1838]" />

        {/* Search & invite */}
        <div>
          <p className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider mb-2">Add People</p>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="w-full bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors mb-2"
          />
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
            {filtered.filter((u) => !memberSet.has(u.id)).length === 0 && (
              <p className="text-xs text-[#e2dff5]/40 text-center py-3">Everyone is already a member.</p>
            )}
            {filtered
              .filter((u) => !memberSet.has(u.id))
              .map((u) => {
                const invited = invitedIds.has(u.id);
                return (
                  <div key={u.id} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[#7c3aed]/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#2a2245] flex-shrink-0 flex justify-center items-center pt-2">
                        <Avatar userData={u} />
                      </div>
                      <div>
                        <p className="text-xs text-[#e2dff5] font-semibold">{u.username || `${u.first_name} ${u.last_name}`}</p>
                        <p className="text-[10px] text-[#a78bfa]">{u.rank}</p>
                      </div>
                    </div>
                    {invited ? (
                      <span className="text-[10px] text-[#34d399] font-semibold">Invited ✓</span>
                    ) : (
                      <button
                        onClick={() => handleInvite(u.id)}
                        className="text-[10px] px-2 py-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-md font-semibold transition-colors"
                      >
                        Invite
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * LeaveConfirmModal — Two-step confirmation before leaving a group.
 * First click shows a warning; second click fires `onConfirm` which calls the
 * leave API and removes the group from the sidebar list.
 */
function LeaveConfirmModal({ group, onConfirm, onClose }) {
  // `confirmed` tracks whether the user has already clicked "Yes, leave" once
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#16112a] border border-[#f87171]/40 rounded-2xl p-6 w-80 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#f87171] uppercase tracking-wide">Leave Group?</h2>
          <button onClick={onClose} className="text-[#e2dff5]/40 hover:text-[#c084fc] text-lg">✕</button>
        </div>

        {!confirmed ? (
          <>
            <p className="text-sm text-[#e2dff5]/80">
              Are you sure you want to leave <span className="text-[#c084fc] font-semibold"># {group.name}</span>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmed(true)}
                className="flex-1 py-2 bg-[#f87171]/20 hover:bg-[#f87171]/40 text-[#f87171] border border-[#f87171]/40 rounded-lg text-sm font-semibold transition-colors"
              >
                Yes, leave
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-[#1e1838] text-[#e2dff5]/60 rounded-lg text-sm border border-[#2a2245] hover:text-[#c084fc] transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#f87171]/10 border border-[#f87171]/30 rounded-lg p-3">
              <p className="text-sm text-[#f87171] font-semibold">Final confirmation</p>
              <p className="text-xs text-[#e2dff5]/60 mt-1">
                You will lose access to <span className="text-[#c084fc]"># {group.name}</span> and its events. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                className="flex-1 py-2 bg-[#f87171] hover:bg-[#ef4444] text-white rounded-lg text-sm font-bold transition-colors"
              >
                Leave for good
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-[#1e1838] text-[#e2dff5]/60 rounded-lg text-sm border border-[#2a2245] hover:text-[#c084fc] transition-colors"
              >
                Never mind
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * GroupSidebar — Left navigation panel for the Chat & Group page.
 * On mount it fetches in parallel:
 *   - The current user's groups
 *   - All users (for the DM list and invite modals)
 *   - All groups (for the group-search feature)
 *
 * Renders two sections:
 *   - "My Groups" with inline invite (👤) and leave (✕) actions
 *   - "Direct Messages" showing up to the first 10 users
 *
 * Also hosts the CreateGroupModal, NewDMModal, InviteModal, and LeaveConfirmModal.
 */
export default function GroupSidebar({ selectedItem, onSelect }) {
  const { user } = useAuth();
  // Groups the current user belongs to
  const [groups, setGroups] = useState([]);
  // All users except self — shown in the DM section
  const [dmUsers, setDmUsers] = useState([]);
  // All users — shared with InviteModal so it doesn't need to refetch
  const [allUsers, setAllUsers] = useState([]);
  // Every group in the system — used for the group-search dropdown
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  // Set of group IDs the user has joined — drives "Joined ✓" badges in search results
  const [joinedIds, setJoinedIds] = useState(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  // True while the user is actively typing in the group search input
  const [searching, setSearching] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showNewDM, setShowNewDM] = useState(false);
  // When set, the InviteModal opens for this specific group
  const [inviteGroup, setInviteGroup] = useState(null);
  // When set, the LeaveConfirmModal opens for this specific group
  const [leaveGroup, setLeaveGroup] = useState(null);

  // Kick off all three data fetches in parallel on mount (or when user changes)
  useEffect(() => {
    if (!user?.id) return;

    const groupsFetch = fetch(`http://localhost:8080/users/groups/id/${user.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);

    const usersFetch = fetch("http://localhost:8080/users/")
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);

    const allGroupsFetch = fetch("http://localhost:8080/groups/")
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);

    Promise.all([groupsFetch, usersFetch, allGroupsFetch]).then(
      ([groupData, userData, allGroupData]) => {
        setGroups(groupData);
        setJoinedIds(new Set(groupData.map((g) => g.id)));
        setAllUsers(userData);
        // Exclude self from the DM list
        setDmUsers(userData.filter((u) => u.id !== user.id));
        setAllGroups(allGroupData);
        setLoading(false);
      }
    );
  }, [user?.id]);

  // Live-filter allGroups by the search query for the group-discovery dropdown
  const searchResults = searchQuery.trim()
    ? allGroups.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  /** Sends a join PATCH, then adds the group to the local list if not already present */
  async function handleJoin(group) {
    await fetch(`http://localhost:8080/groups/${group.id}/join`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });
    setJoinedIds((prev) => new Set([...prev, group.id]));
    setGroups((prev) =>
      prev.find((g) => g.id === group.id) ? prev : [...prev, group]
    );
  }

  /** Sends the leave PATCH, removes the group from local state, and dismisses the modal */
  async function handleLeaveConfirmed(groupId) {
    await fetch(`http://localhost:8080/groups/${groupId}/leave`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });
    setJoinedIds((prev) => { const n = new Set(prev); n.delete(groupId); return n; });
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setLeaveGroup(null);
  }

  /** Adds a newly-created group to the sidebar list and marks it as joined */
  function handleGroupCreated(newGroup) {
    setGroups((prev) => [...prev, newGroup]);
    setJoinedIds((prev) => new Set([...prev, newGroup.id]));
  }

  if (loading) {
    return (
      <div className="w-64 flex-shrink-0 bg-[#0f0d17] border-r border-[#1e1838] p-4">
        <p className="text-xs text-[#e2dff5]/40">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {showCreateGroup && (
        <CreateGroupModal userId={user.id} onClose={() => setShowCreateGroup(false)} onCreated={handleGroupCreated} />
      )}
      {showNewDM && (
        <NewDMModal dmUsers={dmUsers} onClose={() => setShowNewDM(false)} onSelect={onSelect} />
      )}
      {inviteGroup && (
        <InviteModal group={inviteGroup} allUsers={allUsers} onClose={() => setInviteGroup(null)} />
      )}
      {leaveGroup && (
        <LeaveConfirmModal
          group={leaveGroup}
          onConfirm={() => handleLeaveConfirmed(leaveGroup.id)}
          onClose={() => setLeaveGroup(null)}
        />
      )}

      <div className="w-64 flex-shrink-0 bg-[#0f0d17] border-r border-[#1e1838] flex flex-col overflow-hidden">

        {/* Search */}
        <div className="p-3 border-b border-[#1e1838]">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e2dff5]/40 text-xs">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearching(e.target.value.trim().length > 0); }}
              placeholder="Find a group..."
              className="w-full bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
            />
          </div>
          {searching && (
            <div className="mt-2 bg-[#16112a] border border-[#1e1838] rounded-lg overflow-hidden">
              {searchResults.length === 0 ? (
                <p className="text-xs text-[#e2dff5]/40 p-3">No groups found.</p>
              ) : (
                searchResults.map((group) => {
                  const joined = joinedIds.has(group.id);
                  return (
                    <div key={group.id} className="flex items-center justify-between px-3 py-2 hover:bg-[#7c3aed]/20 transition-colors">
                      <div>
                        <p className="text-xs font-semibold text-[#e2dff5]"># {group.name}</p>
                        <p className="text-[10px] text-[#e2dff5]/40">{group.user_ids?.length ?? 0} members</p>
                      </div>
                      {joined ? (
                        <span className="text-[10px] text-[#34d399] font-semibold">Joined ✓</span>
                      ) : (
                        <button onClick={() => handleJoin(group)} className="text-[10px] px-2 py-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-md font-semibold transition-colors">
                          Join
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-y-auto flex-1">

          {/* Groups */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#e2dff5]/50 uppercase tracking-wider">My Groups</p>
              <button onClick={() => setShowCreateGroup(true)} title="Create group" className="w-5 h-5 rounded flex items-center justify-center text-[#e2dff5]/40 hover:text-[#c084fc] hover:bg-[#7c3aed]/20 transition-colors text-base leading-none">
                +
              </button>
            </div>

            {groups.length === 0 && (
              <p className="text-xs text-[#e2dff5]/30 px-1">No groups yet — search above.</p>
            )}

            <div className="space-y-0.5">
              {groups.map((group) => {
                const isSelected = selectedItem?.type === "group" && selectedItem.data.id === group.id;
                return (
                  <div key={group.id} className="group/item flex items-center gap-1">
                    <button
                      onClick={() => onSelect({ type: "group", data: group })}
                      className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        isSelected ? "bg-[#7c3aed]/30 text-[#c084fc]" : "text-[#e2dff5]/70 hover:bg-[#7c3aed]/20 hover:text-[#c084fc]"
                      }`}
                    >
                      <span>#</span>
                      <span className="truncate">{group.name}</span>
                    </button>
                    {/* Invite button */}
                    <button
                      onClick={() => setInviteGroup(group)}
                      title="Invite people"
                      className="opacity-0 group-hover/item:opacity-100 w-5 h-5 rounded flex items-center justify-center text-[#e2dff5]/30 hover:text-[#a78bfa] hover:bg-[#7c3aed]/20 transition-all text-xs"
                    >
                      👤
                    </button>
                    {/* Leave button */}
                    <button
                      onClick={() => setLeaveGroup(group)}
                      title="Leave group"
                      className="opacity-0 group-hover/item:opacity-100 w-5 h-5 rounded flex items-center justify-center text-[#e2dff5]/30 hover:text-[#f87171] hover:bg-[#7c3aed]/20 transition-all text-xs"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mx-3 border-t border-[#1e1838]" />

          {/* DMs */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#e2dff5]/50 uppercase tracking-wider">Direct Messages</p>
              <button onClick={() => setShowNewDM(true)} title="New message" className="w-5 h-5 rounded flex items-center justify-center text-[#e2dff5]/40 hover:text-[#c084fc] hover:bg-[#7c3aed]/20 transition-colors text-base leading-none">
                +
              </button>
            </div>
            <div className="space-y-0.5">
              {dmUsers.slice(0, 10).map((u) => (
                <button
                  key={u.id}
                  onClick={() => onSelect({ type: "dm", data: { user_id: u.id, username: u.username || `${u.first_name} ${u.last_name}`, rank: u.rank } })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    selectedItem?.type === "dm" && selectedItem.data.user_id === u.id
                      ? "bg-[#7c3aed]/30 text-[#c084fc]"
                      : "text-[#e2dff5]/70 hover:bg-[#7c3aed]/20 hover:text-[#c084fc]"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-[#2a2245] flex-shrink-0 flex justify-center items-center pt-2">
                    <Avatar userData={u} />
                  </div>
                  <span className="truncate">{u.username || `${u.first_name} ${u.last_name}`}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}