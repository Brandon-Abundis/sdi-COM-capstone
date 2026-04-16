import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../app/AuthProvider";
import GroupMemberList from "./GroupMemberList";
import MessageBubble from "./MessageBubble";
import ChallengeCard from "./ChallengeCard";

/** Converts an ISO timestamp string into a human-readable "Mon, 3:45 PM" format */
function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit", hour12: true });
}

/**
 * Returns a countdown label relative to today:
 *   "Today", "In Nd", or "Nd ago"
 */
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

/**
 * ChallengeModal — Form for issuing a fitness challenge within a group chat.
 * On submit it:
 *   1. Optionally creates a group event on the backend (best-effort, non-blocking).
 *   2. Sends a regular chat message whose text is a JSON blob flagged with
 *      `__challenge__: true` so the renderer knows to show a ChallengeCard instead
 *      of a plain MessageBubble.
 */
function ChallengeModal({ group, user, onClose, onSent }) {
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
      // 1. Try to persist as a group event (best-effort — doesn't block the message)
      let eventId = null;
      try {
        const eventRes = await fetch("http://localhost:8080/groups/group_events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: exercise.trim(),
            start_date: date,
            end_date: date,
            start_time: time || null,
            group_id: group.id,
          }),
        });
        if (eventRes.ok) {
          const event = await eventRes.json();
          eventId = event.id;
        }
      } catch (_) {}

      // 2. Send the challenge message — data encoded in text so no migration needed
      const challengePayload = JSON.stringify({
        __challenge__: true,
        event_id: eventId,
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
          group_id: group.id,
        }),
      });
      if (!msgRes.ok) throw new Error("Failed to send message");
      const msg = await msgRes.json();

      onSent({
        ...msg,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
      });
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
          <button onClick={onClose} className="text-[#e2dff5]/40 hover:text-[#c084fc] text-lg">✕</button>
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

/**
 * GroupChat — Real-time-style chat panel for a single group.
 * Fetches the message history and a member map on mount, then provides:
 *   - A scrollable message list that auto-scrolls to the bottom on new messages
 *   - Plain text messages rendered as MessageBubble
 *   - Challenge messages (JSON with __challenge__ flag) rendered as ChallengeCard
 *   - A ChallengeModal triggered by the ⚔️ button in the input bar
 */
export default function GroupChat({ group }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showChallenge, setShowChallenge] = useState(false);
  // Map of userId → full user object so avatars/names resolve correctly after the fact
  const [userMap, setUserMap] = useState({});
  const bottomRef = useRef(null);

  // Build the userMap by fetching every group member's profile in parallel
  useEffect(() => {
    if (!group?.user_ids?.length) return;
    Promise.all(
      group.user_ids.map((id) =>
        fetch(`http://localhost:8080/users/id/${id}`)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      const map = {};
      results.filter(Boolean).forEach((u) => { map[u.id] = u; });
      setUserMap(map);
    });
  }, [group?.id]);

  // Load message history whenever the active group changes
  useEffect(() => {
    if (!group?.id) return;
    fetch(`http://localhost:8080/messages/group/${group.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setMessages)
      .catch(() => {});
  }, [group?.id]);

  // Scroll to the newest message whenever the list updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Posts a new plain-text message and appends it to the local list optimistically */
  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch("http://localhost:8080/messages/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input.trim(), user_id: user.id, group_id: group.id }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [
        ...prev,
        { ...msg, first_name: user.first_name, last_name: user.last_name, username: user.username },
      ]);
    }
    setInput("");
  }

  /** Appends a freshly-sent challenge message to the local message list */
  function handleChallengeSent(msg) {
    setMessages((prev) => [...prev, msg]);
  }

  /**
   * Tries to parse a message's text as JSON.
   * Returns the parsed object if it has `__challenge__: true`, otherwise null.
   * This flag is how challenge messages are distinguished from plain text.
   */
  function parseChallenge(text) {
    try {
      const data = JSON.parse(text);
      return data?.__challenge__ === true ? data : null;
    } catch {
      return null;
    }
  }

  /**
   * Decides which component to render for a single message:
   *   - ChallengeCard if the text is a challenge JSON blob
   *   - MessageBubble for all other messages
   * Resolves the sender's avatar/name from userMap with fallback to inline fields.
   */
  function renderMessage(msg) {
    const isOwn = msg.user_id === user?.id;
    const timestamp = formatTimestamp(msg.created_at);
    const challenge = parseChallenge(msg.text);

    const msgUser = userMap[msg.user_id] ?? { first_name: msg.first_name, last_name: msg.last_name, username: msg.username, profile: null };

    if (challenge) {
      return (
        <ChallengeCard
          key={msg.id}
          isOwn={isOwn}
          challenge={{
            from_user_id: msg.user_id,
            from_name: msgUser.username || msg.username || `${msg.first_name} ${msg.last_name}`,
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
          first_name: msgUser.first_name || msg.first_name || "?",
          last_name: msgUser.last_name || msg.last_name || "?",
          username: msgUser.username || msg.username || `${msg.first_name} ${msg.last_name}`,
          profile: msgUser.profile ?? null,
          text: msg.text,
          timestamp,
        }}
        isOwn={isOwn}
      />
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {showChallenge && (
        <ChallengeModal
          group={group}
          user={user}
          onClose={() => setShowChallenge(false)}
          onSent={handleChallengeSent}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-sm text-[#e2dff5]/40 text-center mt-8">No messages yet. Say something!</p>
          )}
          {messages.map((msg) => renderMessage(msg))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-[#1e1838] flex gap-2">
          <button
            type="button"
            onClick={() => setShowChallenge(true)}
            title="Issue a challenge"
            className="px-3 py-2 bg-[#1e1838] hover:bg-[#7c3aed]/20 border border-[#2a2245] hover:border-[#7c3aed] text-[#a78bfa] rounded-lg text-sm transition-colors flex-shrink-0"
          >
            ⚔️
          </button>
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

      <GroupMemberList group={group} />
    </div>
  );
}
