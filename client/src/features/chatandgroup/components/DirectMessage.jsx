import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../app/AuthProvider";
import MessageBubble from "./MessageBubble";
import ChallengeCard from "./ChallengeCard";

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit", hour12: true });
}

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff < 0) return `${Math.abs(diff)}d ago`;
  return `In ${diff}d`;
}

function parseChallenge(text) {
  try {
    const data = JSON.parse(text);
    return data?.__challenge__ === true ? data : null;
  } catch {
    return null;
  }
}

function ChallengeModal({ dmUser, user, onClose, onSent }) {
  const [exercise, setExercise] = useState("");
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!exercise.trim() || !goal.trim() || !date) return;
    setSubmitting(true);
    setError(null);

    try {
      const challengePayload = JSON.stringify({
        __challenge__: true,
        event_id: null,
        exercise: exercise.trim(),
        goal: goal.trim(),
        date,
        time: time || null,
      });

      const msgRes = await fetch("http://localhost:8080/messages/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: challengePayload,
          user_id: user.id,
          to_user_id: dmUser.user_id,
        }),
      });
      if (!msgRes.ok) throw new Error("Failed to send challenge");
      const msg = await msgRes.json();

      onSent({ ...msg, first_name: user.first_name, last_name: user.last_name });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#16112a] border border-[#2a2245] rounded-2xl p-6 w-96 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#c084fc] uppercase tracking-wide">⚔️ Issue a Challenge</h2>
          <button onClick={onClose} className="text-[#e2dff5]/40 hover:text-[#e2dff5] text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">Exercise</label>
            <input
              required
              type="text"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              placeholder="e.g. Push-ups, 2-Mile Run"
              className="bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">Goal</label>
            <input
              required
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. 100 reps, Sub 15:00"
              className="bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">Date</label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">Time (optional)</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
              />
            </div>
          </div>

          {error && <p className="text-xs text-[#f87171]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {submitting ? "Sending..." : "Send Challenge"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DirectMessage({ dmUser }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showChallenge, setShowChallenge] = useState(false);
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
      setMessages((prev) => [...prev, { ...msg, first_name: user.first_name, last_name: user.last_name }]);
    }
    setInput("");
  }

  function handleChallengeSent(msg) {
    setMessages((prev) => [...prev, msg]);
  }

  function renderMessage(msg) {
    const isOwn = msg.user_id === user?.id;
    const timestamp = formatTimestamp(msg.created_at);
    const challenge = parseChallenge(msg.text);

    if (challenge) {
      return (
        <ChallengeCard
          key={msg.id}
          isOwn={isOwn}
          challenge={{
            from_user_id: msg.user_id,
            from_name: `${msg.first_name} ${msg.last_name}`,
            from_avatar: `https://i.pravatar.cc/40?u=${msg.user_id}`,
            timestamp,
            exercise: challenge.exercise ?? "",
            goal: challenge.goal ?? "",
            date: challenge.date ?? "",
            time: challenge.time ?? "",
            time_until: challenge.date ? getDaysUntil(challenge.date) : "",
            status: "pending",
          }}
        />
      );
    }

    return (
      <MessageBubble
        key={msg.id}
        message={{
          id: msg.id,
          user_id: msg.user_id,
          full_name: `${msg.first_name} ${msg.last_name}`,
          avatar: `https://i.pravatar.cc/40?u=${msg.user_id}`,
          text: msg.text,
          timestamp,
        }}
        isOwn={isOwn}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {showChallenge && (
        <ChallengeModal
          dmUser={dmUser}
          user={user}
          onClose={() => setShowChallenge(false)}
          onSent={handleChallengeSent}
        />
      )}

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
        {messages.map((msg) => renderMessage(msg))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-[#1e1838] flex gap-2">
        <button
          type="button"
          onClick={() => setShowChallenge(true)}
          title="Issue a challenge"
          className="px-3 py-2 bg-[#1e1838] hover:bg-[#2a2245] border border-[#2a2245] hover:border-[#7c3aed] text-[#a78bfa] rounded-lg text-sm transition-colors flex-shrink-0"
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
