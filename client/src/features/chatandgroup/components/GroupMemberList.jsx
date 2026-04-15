import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../../profile/Components/Avatar";

export default function GroupMemberList({ group }) {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!group?.user_ids?.length) return;

    // Fetch each member by id
    Promise.all(
      group.user_ids.map((id) =>
        fetch(`http://localhost:8080/users/id/${id}`)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null)
      )
    ).then((results) => setMembers(results.filter(Boolean)));
  }, [group?.id]);

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
            key={member.id}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-[#7c3aed]/20 transition-colors"
            onClick={() => navigate(`/profile/${member.id}`)}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#2a2245] flex-shrink-0 border-2 border-[#1e1838]">
              <Avatar userData={member} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#e2dff5] truncate">
                {member.username || `${member.first_name} ${member.last_name}`}
              </p>
              <p className="text-[10px] text-[#a78bfa] truncate">{member.rank}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}