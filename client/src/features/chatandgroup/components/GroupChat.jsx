import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../app/AuthProvider";
import GroupMemberList from "./GroupMemberList";
import MessageBubble from "./MessageBubble";

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit", hour12: true });
}

export default function GroupChat({ group }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!group?.id) return;
    fetch(`http://localhost:8080/messages/group/${group.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setMessages)
      .catch(() => {});
  }, [group?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        {
          ...msg,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      ]);
    }
    setInput("");
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-sm text-[#e2dff5]/40 text-center mt-8">No messages yet. Say something!</p>
          )}
          {messages.map((msg) => (
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
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-[#1e1838] flex gap-2">
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
