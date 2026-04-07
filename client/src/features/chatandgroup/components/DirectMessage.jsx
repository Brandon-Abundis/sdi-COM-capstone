import { useState } from "react";
import MessageBubble from "./MessageBubble";
import ChallengeCard from "./ChallengeCard";

const CURRENT_USER_ID = 1;

// Mock DM threads keyed by the other user's id
const mockDMs = {
  2: [
    { id: 1, type: "message",   user_id: 2, full_name: "E. Ortiz",   avatar: "https://i.pravatar.cc/40?u=2", text: "Yo you hitting the bench challenge?", timestamp: "Mon 09:00" },
    { id: 2, type: "message",   user_id: 1, full_name: "J. DeCarlo", avatar: "https://i.pravatar.cc/40?u=1", text: "For sure. Wanna make it official?",    timestamp: "Mon 09:01" },
    {
      id: 3,
      type: "challenge",
      from_user_id: 1,
      from_name: "J. DeCarlo",
      from_avatar: "https://i.pravatar.cc/40?u=1",
      exercise: "Bench Press 1RM",
      goal: "Whoever hits a higher 1RM wins",
      date: "2026-04-15",
      time: "1400",
      time_until: "8 days",
      status: "pending",
      timestamp: "Mon 09:02",
    },
  ],
  3: [
    { id: 1, type: "message", user_id: 3, full_name: "B. Adams",   avatar: "https://i.pravatar.cc/40?u=3", text: "You ready for leg day gauntlet?", timestamp: "Tue 07:45" },
    { id: 2, type: "message", user_id: 1, full_name: "J. DeCarlo", avatar: "https://i.pravatar.cc/40?u=1", text: "Born ready.",                     timestamp: "Tue 07:46" },
  ],
  4: [
    { id: 1, type: "message", user_id: 4, full_name: "J. Torres", avatar: "https://i.pravatar.cc/40?u=4", text: "5K challenge?", timestamp: "Wed 06:00" },
    {
      id: 2,
      type: "challenge",
      from_user_id: 4,
      from_name: "J. Torres",
      from_avatar: "https://i.pravatar.cc/40?u=4",
      exercise: "5K Run",
      goal: "Fastest time wins",
      date: "2026-04-25",
      time: "0500",
      time_until: "18 days",
      status: "pending",
      timestamp: "Wed 06:01",
    },
  ],
};

export default function DirectMessage({ dmUser }) {
  const [input, setInput] = useState("");
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challengeForm, setChallengeForm] = useState({
    exercise: "", goal: "", date: "", time: "", time_until: "",
  });

  const thread = mockDMs[dmUser.user_id] ?? [];

  function handleSend(e) {
    e.preventDefault();
    setInput("");
  }

  function handleChallengeSubmit(e) {
    e.preventDefault();
    // Wire to API when backend ready
    setShowChallengeForm(false);
    setChallengeForm({ exercise: "", goal: "", date: "", time: "", time_until: "" });
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* DM header */}
      <div className="px-4 py-3 border-b border-[#1e1838] flex items-center gap-3">
        <img src={dmUser.avatar} alt={dmUser.full_name} className="w-8 h-8 rounded-full border-2 border-[#2a2245]" />
        <span className="font-semibold text-[#e2dff5] text-sm">{dmUser.full_name}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread.map((item) =>
          item.type === "challenge" ? (
            <ChallengeCard
              key={item.id}
              challenge={item}
              isOwn={item.from_user_id === CURRENT_USER_ID}
            />
          ) : (
            <MessageBubble
              key={item.id}
              message={item}
              isOwn={item.user_id === CURRENT_USER_ID}
            />
          )
        )}
      </div>

      {/* Challenge form */}
      {showChallengeForm && (
        <form
          onSubmit={handleChallengeSubmit}
          className="mx-3 mb-2 p-4 bg-[#16112a] border border-[#7c3aed] rounded-xl space-y-2"
        >
          <p className="text-xs font-bold text-[#c084fc] uppercase tracking-wide">⚔️ New Challenge</p>
          <input
            placeholder="Exercise (e.g. Bench Press 1RM)"
            value={challengeForm.exercise}
            onChange={(e) => setChallengeForm({ ...challengeForm, exercise: e.target.value })}
            className="w-full bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-3 py-1.5 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed]"
          />
          <input
            placeholder="Goal (e.g. Whoever hits higher 1RM wins)"
            value={challengeForm.goal}
            onChange={(e) => setChallengeForm({ ...challengeForm, goal: e.target.value })}
            className="w-full bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-3 py-1.5 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed]"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={challengeForm.date}
              onChange={(e) => setChallengeForm({ ...challengeForm, date: e.target.value })}
              className="flex-1 bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-1.5 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed]"
            />
            <input
              type="time"
              value={challengeForm.time}
              onChange={(e) => setChallengeForm({ ...challengeForm, time: e.target.value })}
              className="flex-1 bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-1.5 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed]"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn btn-sm flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white border-0">
              Send Challenge
            </button>
            <button
              type="button"
              className="btn btn-sm flex-1 bg-[#1e1838] text-[#e2dff5]/60 border border-[#2a2245]"
              onClick={() => setShowChallengeForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#1e1838] flex gap-2">
        <button
          type="button"
          title="Issue a challenge"
          onClick={() => setShowChallengeForm((v) => !v)}
          className="px-3 py-2 bg-[#1e1838] hover:bg-[#2a2245] text-[#c084fc] rounded-lg text-sm border border-[#2a2245] transition-colors"
        >
          ⚔️
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${dmUser.full_name}`}
          className="flex-1 bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-4 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}