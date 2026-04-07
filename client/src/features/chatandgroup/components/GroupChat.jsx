import { useState } from "react";
import MessageBubble from "./MessageBubble";
import GroupMemberList from "./GroupMemberList";

const CURRENT_USER_ID = 1;

// Mock messages keyed by group_id
const mockGroupMessages = {
  1: [
    { id: 1, user_id: 2, full_name: "E. Ortiz",   avatar: "https://i.pravatar.cc/40?u=2", text: "Who's hitting the bench challenge this week?",      timestamp: "Mon 08:12" },
    { id: 2, user_id: 1, full_name: "J. DeCarlo", avatar: "https://i.pravatar.cc/40?u=1", text: "I'm in. Aiming for 315.",                            timestamp: "Mon 08:14" },
    { id: 3, user_id: 3, full_name: "B. Adams",   avatar: "https://i.pravatar.cc/40?u=3", text: "Same. Leg day gauntlet after?",                      timestamp: "Mon 08:15" },
    { id: 4, user_id: 2, full_name: "E. Ortiz",   avatar: "https://i.pravatar.cc/40?u=2", text: "Let's go. Don't skip leg day.",                      timestamp: "Mon 08:17" },
  ],
  2: [
    { id: 1, user_id: 4, full_name: "J. Torres",  avatar: "https://i.pravatar.cc/40?u=4", text: "5K time trial is coming up fast.",                   timestamp: "Tue 07:00" },
    { id: 2, user_id: 1, full_name: "J. DeCarlo", avatar: "https://i.pravatar.cc/40?u=1", text: "I've been running every morning. Feeling good.",      timestamp: "Tue 07:03" },
  ],
  3: [
    { id: 1, user_id: 3, full_name: "B. Adams",   avatar: "https://i.pravatar.cc/40?u=3", text: "Iron Company Games signup is open!",                 timestamp: "Wed 06:30" },
  ],
};

export default function GroupChat({ group }) {
  const [input, setInput] = useState("");
  const messages = mockGroupMessages[group.id] ?? [];

  function handleSend(e) {
    e.preventDefault();
    // Wire up to API when backend is ready
    setInput("");
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Message area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.user_id === CURRENT_USER_ID}
            />
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-[#1e1838] flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message #${group.name.toLowerCase().replace(/\s/g, "-")}`}
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

      <GroupMemberList members={group.members} />
    </div>
  );
}