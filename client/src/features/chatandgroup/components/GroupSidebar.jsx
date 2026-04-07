// Mock data — matches groups + users schema
export const mockGroups = [
  {
    id: 1,
    name: "Iron Wolves",
    members: [
      { user_id: 1, full_name: "J. DeCarlo", rank: "Gold",   avatar: "https://i.pravatar.cc/40?u=1", online: true },
      { user_id: 2, full_name: "E. Ortiz",   rank: "Silver", avatar: "https://i.pravatar.cc/40?u=2", online: true },
      { user_id: 3, full_name: "B. Adams",   rank: "Bronze", avatar: "https://i.pravatar.cc/40?u=3", online: false },
    ],
  },
  {
    id: 2,
    name: "Alpha Squad",
    members: [
      { user_id: 1, full_name: "J. DeCarlo", rank: "Gold",   avatar: "https://i.pravatar.cc/40?u=1", online: true },
      { user_id: 4, full_name: "J. Torres",  rank: "Plat",   avatar: "https://i.pravatar.cc/40?u=4", online: false },
    ],
  },
  {
    id: 3,
    name: "Galactic Lifters",
    members: [
      { user_id: 3, full_name: "B. Adams",   rank: "Bronze", avatar: "https://i.pravatar.cc/40?u=3", online: false },
      { user_id: 4, full_name: "J. Torres",  rank: "Plat",   avatar: "https://i.pravatar.cc/40?u=4", online: true },
    ],
  },
];

export const mockDMUsers = [
  { user_id: 2, full_name: "E. Ortiz",   avatar: "https://i.pravatar.cc/40?u=2", online: true },
  { user_id: 3, full_name: "B. Adams",   avatar: "https://i.pravatar.cc/40?u=3", online: false },
  { user_id: 4, full_name: "J. Torres",  avatar: "https://i.pravatar.cc/40?u=4", online: true },
];

export default function GroupSidebar({ selectedItem, onSelect }) {
  return (
    <div className="w-56 flex-shrink-0 bg-[#0f0d17] border-r border-[#1e1838] flex flex-col overflow-y-auto">

      {/* Groups */}
      <div className="p-3">
        <p className="text-xs font-bold text-[#e2dff5]/50 uppercase tracking-wider mb-2">Groups</p>
        <div className="space-y-0.5">
          {mockGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelect({ type: "group", data: group })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                selectedItem?.type === "group" && selectedItem.data.id === group.id
                  ? "bg-[#7c3aed]/30 text-[#c084fc]"
                  : "text-[#e2dff5]/70 hover:bg-[#1e1838] hover:text-[#e2dff5]"
              }`}
            >
              <span className="text-base">#</span>
              <span className="truncate">{group.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-3 border-t border-[#1e1838]" />

      {/* Direct Messages */}
      <div className="p-3">
        <p className="text-xs font-bold text-[#e2dff5]/50 uppercase tracking-wider mb-2">Direct Messages</p>
        <div className="space-y-0.5">
          {mockDMUsers.map((user) => (
            <button
              key={user.user_id}
              onClick={() => onSelect({ type: "dm", data: user })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                selectedItem?.type === "dm" && selectedItem.data.user_id === user.user_id
                  ? "bg-[#7c3aed]/30 text-[#c084fc]"
                  : "text-[#e2dff5]/70 hover:bg-[#1e1838] hover:text-[#e2dff5]"
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={user.avatar} alt={user.full_name} className="w-5 h-5 rounded-full" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0f0d17] ${
                    user.online ? "bg-[#34d399]" : "bg-[#e2dff5]/20"
                  }`}
                />
              </div>
              <span className="truncate">{user.full_name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}