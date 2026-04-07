import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChallengeCard({ challenge, isOwn }) {
  const [status, setStatus] = useState(challenge.status); // 'pending' | 'accepted' | 'declined'
  const navigate = useNavigate();

  const statusStyles = {
    pending:  "border-[#7c3aed]",
    accepted: "border-[#34d399]",
    declined: "border-[#f87171]",
  };

  const statusBadge = {
    pending:  <span className="badge badge-sm bg-[#7c3aed]/20 text-[#a78bfa] border-0">Pending</span>,
    accepted: <span className="badge badge-sm bg-[#34d399]/20 text-[#34d399] border-0">Accepted</span>,
    declined: <span className="badge badge-sm bg-[#f87171]/20 text-[#f87171] border-0">Declined</span>,
  };

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      <img
        src={challenge.from_avatar}
        alt={challenge.from_name}
        className="w-8 h-8 rounded-full object-cover cursor-pointer flex-shrink-0 border-2 border-[#2a2245]"
        onClick={() => navigate(`/profile/${challenge.from_user_id}`)}
      />
      <div className={`max-w-[80%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`flex items-baseline gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <span
            className="text-xs font-semibold text-[#a78bfa] cursor-pointer hover:underline"
            onClick={() => navigate(`/profile/${challenge.from_user_id}`)}
          >
            {challenge.from_name}
          </span>
          <span className="text-[10px] text-[#e2dff5]/40">{challenge.timestamp}</span>
        </div>

        <div
          className={`rounded-2xl border-2 bg-[#16112a] p-4 flex flex-col gap-3 w-full ${
            statusStyles[status]
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#c084fc] uppercase tracking-wide">⚔️ Challenge Issued</span>
            {statusBadge[status]}
          </div>

          <div className="space-y-1 text-sm text-[#e2dff5]">
            <p className="font-semibold">{challenge.exercise}</p>
            <p className="text-[#e2dff5]/70 text-xs">🎯 Goal: {challenge.goal}</p>
            <p className="text-[#e2dff5]/70 text-xs">📅 Date: {challenge.date}</p>
            <p className="text-[#e2dff5]/70 text-xs">🕐 Time: {challenge.time}</p>
            <p className="text-[#e2dff5]/70 text-xs">⏱ Starts in: {challenge.time_until}</p>
          </div>

          {!isOwn && status === "pending" && (
            <div className="flex gap-2 mt-1">
              <button
                className="btn btn-sm flex-1 bg-[#34d399]/20 text-[#34d399] border border-[#34d399] hover:bg-[#34d399]/40"
                onClick={() => setStatus("accepted")}
              >
                Accept
              </button>
              <button
                className="btn btn-sm flex-1 bg-[#f87171]/20 text-[#f87171] border border-[#f87171] hover:bg-[#f87171]/40"
                onClick={() => setStatus("declined")}
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}