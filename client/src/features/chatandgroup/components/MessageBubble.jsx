import { useNavigate } from "react-router-dom";
import Avatar from "../../profile/Components/Avatar";

export default function MessageBubble({ message, isOwn }) {
  const navigate = useNavigate();

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className="w-8 h-8 rounded-full overflow-hidden bg-[#2a2245] cursor-pointer flex-shrink-0 border-2 border-[#1e1838]"
        onClick={() => navigate(`/profile/${message.user_id}`)}
      >
        <Avatar userData={{ first_name: message.first_name, last_name: message.last_name, profile: message.profile }} />
      </div>
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`flex items-baseline gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <span
            className="text-xs font-semibold text-[#a78bfa] cursor-pointer hover:underline"
            onClick={() => navigate(`/profile/${message.user_id}`)}
          >
            {message.username}
          </span>
          <span className="text-[10px] text-[#e2dff5]/40">{message.timestamp}</span>
        </div>
        <div
          className={`px-4 py-2 rounded-2xl text-sm text-[#e2dff5] ${
            isOwn
              ? "bg-[#7c3aed] rounded-tr-sm"
              : "bg-[#1e1838] rounded-tl-sm"
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}