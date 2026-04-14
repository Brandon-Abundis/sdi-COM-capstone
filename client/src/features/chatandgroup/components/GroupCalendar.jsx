import { useEffect, useState } from "react";

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

const typeColors = {
  cardio:   "border-[#818cf8] text-[#818cf8]",
  strength: "border-[#c084fc] text-[#c084fc]",
  sports:   "border-[#34d399] text-[#34d399]",
};

const EMPTY_FORM = { name: "", start_date: "", end_date: "", start_time: "", end_time: "" };

function CreateGroupEventModal({ group, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  function set(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.start_date) {
      setError("Event name and start date are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/groups/group_events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          start_date: form.start_date,
          end_date: form.end_date || form.start_date,
          start_time: form.start_time || null,
          end_time: form.end_time || null,
          group_id: group.id,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || "Failed to create event.");
        return;
      }
      const created = await res.json();
      onCreated(created);
      onClose();
    } catch {
      setError("Network error — check connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#16112a] border border-[#2a2245] rounded-2xl p-6 w-96 flex flex-col gap-4 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#c084fc] uppercase tracking-wide">Create Group Event</h2>
            <p className="text-xs text-[#e2dff5]/50 mt-0.5"># {group.name}</p>
          </div>
          <button onClick={onClose} className="text-[#e2dff5]/40 hover:text-[#c084fc] text-lg">✕</button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">Event Name *</label>
            <input
              autoFocus
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Morning PT Run"
              className="w-full bg-[#1e1838] text-[#e2dff5] placeholder-[#e2dff5]/30 rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">Start Date *</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => set("start_date", e.target.value)}
                className="w-full bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">End Date</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => set("end_date", e.target.value)}
                className="w-full bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">Start Time</label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => set("start_time", e.target.value)}
                className="w-full bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-[#e2dff5]/40 tracking-wider">End Time</label>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => set("end_time", e.target.value)}
                className="w-full bg-[#1e1838] text-[#e2dff5] rounded-lg px-3 py-2 text-sm outline-none border border-[#2a2245] focus:border-[#7c3aed] transition-colors"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-[#f87171]">{error}</p>}

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#e2dff5]/60 hover:text-[#c084fc] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-xs font-bold bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-[#2a2245] disabled:text-[#e2dff5]/40 text-white rounded-lg transition-colors"
          >
            {saving ? "Creating..." : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GroupCalendar({ group }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isGroupAdmin = (group?.admin_ids ?? []).includes(user.id);
  const canCreate = isGroupAdmin || user.is_admin === true;

  useEffect(() => {
    if (!group?.id) return;
    fetch(`http://localhost:8080/groups/group_events/id/${group.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setEvents(Array.isArray(data) ? data : [data].filter(Boolean)))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [group?.id]);

  function handleCreated(newEvent) {
    setEvents((prev) => [...prev, newEvent]);
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {showCreate && (
        <CreateGroupEventModal
          group={group}
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#c084fc]">📅 {group.name} — Events</h2>
        {canCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg text-xs font-semibold transition-colors"
          >
            + Create Event
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-[#e2dff5]/50">Loading...</p>}

      {!loading && events.length === 0 && (
        <p className="text-sm text-[#e2dff5]/50">No events scheduled for this group.</p>
      )}

      {(() => {
        const sorted = [...events].sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );
        const upcoming = sorted.filter((e) => {
          const d = getDaysUntil(e.start_date);
          return d >= 0 && d <= 7;
        });
        const beyond = sorted.filter((e) => getDaysUntil(e.start_date) > 7);
        const past = sorted.filter((e) => getDaysUntil(e.start_date) < 0);

        function renderCard(event) {
          const days = getDaysUntil(event.start_date);
          return (
            <div
              key={event.id}
              className={`bg-[#16112a] border-l-4 rounded-lg p-4 flex items-center justify-between ${
                typeColors[event.type] ?? "border-[#2a2245] text-[#e2dff5]"
              }`}
            >
              <div className="space-y-1">
                <p className="font-semibold text-sm text-[#e2dff5]">{event.name}</p>
                <p className="text-xs text-[#e2dff5]/60">
                  📅 {event.start_date} &nbsp;·&nbsp; 🕐 {event.start_time}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                {days < 0 ? (
                  <span className="badge badge-sm bg-[#2a2245] text-[#e2dff5]/50 border-0">In Progress</span>
                ) : days === 0 ? (
                  <span className="badge badge-sm bg-[#7c3aed] text-white border-0">Today</span>
                ) : (
                  <span className="badge badge-sm bg-[#1e1838] text-[#a78bfa] border border-[#7c3aed]">
                    In {days}d
                  </span>
                )}
              </div>
            </div>
          );
        }

        return (
          <>
            {upcoming.length > 0 && (
              <div className="space-y-3">
                {upcoming.map(renderCard)}
              </div>
            )}

            {beyond.length > 0 && (
              <div className="mt-6">
                <p className="text-[10px] uppercase font-bold text-[#e2dff5]/30 tracking-wider mb-3">Further Out</p>
                <div className="space-y-3">
                  {beyond.map(renderCard)}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div className="mt-6">
                <p className="text-[10px] uppercase font-bold text-[#e2dff5]/30 tracking-wider mb-3">Past</p>
                <div className="space-y-3 opacity-50">
                  {past.map(renderCard)}
                </div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}
