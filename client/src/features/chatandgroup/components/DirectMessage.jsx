import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../app/AuthProvider";
import MessageBubble from "./MessageBubble";
import ChallengeCard from "./ChallengeCard";

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit", hour12: true });
}

export default function DirectMessage({ dmUser }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challengeForm, setChallengeForm] = useState({
    exercise: "", goal: "", date: "", time: "",
  });
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user?.id || !dmUser?.user_id) return;
    fetch(`http://localhost:8080/messages/dm/${user.id}/${dmUser.user_id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setMessages)
      .catch(() => {});
  }, [user?.id, dmUser?.user_id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch("http://localhost:8080/messages/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input.trim(), user_id: user.id, to_user_id: dmUser.user_id }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      ]);
    }
    setInput("");
  }

  function handleChallengeSubmit(e) {
    e.preventDefault();
    setShowChallengeForm(false);
    setChallengeForm({ exercise: "", goal: "", date: "", time: "" });
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1e1838] flex items-center gap-3">
        <img
          src={`https://i.pravatar.cc/40?u=${dmUser.user_id}`}
          alt={dmUser.full_name}
          className="w-8 h-8 rounded-full border-2 border-[#2a2245]"
        />
        <div>
          <span className="font-semibold text-[#e2dff5] text-sm">{dmUser.full_name}</span>
          {dmUser.rank && <span className="ml-2 text-xs text-[#a78bfa]">{dmUser.rank}</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-[#e2dff5]/40 text-center mt-8">No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg) =>
          msg.type === "challenge" ? (
            <ChallengeCard key={msg.id} challenge={msg} isOwn={msg.user_id === user?.id} />
          ) : (
            <MessageBubble
              key={msg.id}
              message={{
                id: msg.id,
                user_id: msg.user_id,
                full_name: `${msg.first_name} ${msg.last_name}`,
                avatar: `https://i.pravatar.cc/40?u=${msg.user_id}`,
                text: msg.text,
                timestamp: formatTimestamp(msg.created_at),
              }}
              isOwn={msg.user_id === user?.id}
            />
          )
        )}
        <div ref={bottomRef} />
      </div>

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
