import { useNavigate } from "react-router-dom";

export default function GroupMemberList({ members }) {
  const navigate = useNavigate();

  return (
    <div className="w-52 flex-shrink-0 bg-[#0f0d17] border-l border-[#1e1838] flex flex-col">
      <div className="p-3 border-b border-[#1e1838]">
        <p className="text-xs font-bold text-[#e2dff5]/50 uppercase tracking-wider">
          Members — {members.length}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {members.map((member) => (
          <div
            key={member.user_id}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-[#1e1838] transition-colors"
            onClick={() => navigate(`/profile/${member.user_id}`)}
          >
            <div className="relative flex-shrink-0">
              <img
                src={member.avatar}
                alt={member.full_name}
                className="w-8 h-8 rounded-full object-cover border-2 border-[#2a2245]"
              />
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0f0d17] ${
                  member.online ? "bg-[#34d399]" : "bg-[#e2dff5]/20"
                }`}
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#e2dff5] truncate">{member.full_name}</p>
              <p className="text-[10px] text-[#a78bfa] truncate">{member.rank}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}