import { useState } from "react";
import { useAuth } from "../../../app/AuthProvider.jsx";

function Section({ title, children }) {
  return (
    <div className="bg-[#16112a] border border-[#1e1838] rounded-xl p-6 flex flex-col gap-4">
      <h2 className="text-base font-bold text-[#c084fc] tracking-wide border-b border-[#1e1838] pb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#e2dff5]">{label}</p>
        {sub && <p className="text-xs text-[#e2dff5]/50 mt-0.5">{sub}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("setting_theme") ?? "nightshade"
  );
  const [compactCards, setCompactCards] = useState(
    () => localStorage.getItem("setting_compact_cards") === "true"
  );
  const [saved, setSaved] = useState(false);

  function applyTheme(value) {
    setTheme(value);
    document.documentElement.setAttribute("data-theme", value);
  }

  function applyCompact(value) {
    setCompactCards(value);
    if (value) {
      document.documentElement.setAttribute("data-compact", "true");
    } else {
      document.documentElement.removeAttribute("data-compact");
    }
  }

  function handleSave() {
    localStorage.setItem("setting_theme", theme);
    localStorage.setItem("setting_compact_cards", compactCards);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isDark = theme === "nightshade";

  return (
    <div className="min-h-screen bg-[#0f0d17] p-6 max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-[#7c3aed] tracking-wide">Settings</h1>

      {/* Account Information */}
      <Section title="Account Information">
        <Row label="Name">
          <span className="text-sm text-[#a78bfa] font-medium">
            {user?.first_name} {user?.last_name}
          </span>
        </Row>
        <Row label="Email">
          <span className="text-sm text-[#a78bfa]">{user?.email ?? "—"}</span>
        </Row>
        <Row label="Rank">
          <span className="text-sm text-[#a78bfa]">{user?.rank ?? "—"}</span>
        </Row>
        <Row label="Gender">
          <span className="text-sm text-[#a78bfa]">{user?.gender ?? "—"}</span>
        </Row>
        <Row label="Age">
          <span className="text-sm text-[#a78bfa]">{user?.age ?? "—"}</span>
        </Row>
        <Row label="Role">
          <span
            className={`text-xs font-bold px-2 py-1 rounded-md ${
              user?.is_admin
                ? "bg-[#7c3aed]/20 text-[#c084fc] border border-[#7c3aed]"
                : "bg-[#1e1838] text-[#e2dff5]/50"
            }`}
          >
            {user?.is_admin ? "Admin" : "Member"}
          </span>
        </Row>
        <Row label="XP">
          <span className="text-sm text-[#a78bfa] font-bold">
            {user?.xp?.toLocaleString() ?? 0} XP
          </span>
        </Row>
      </Section>

      {/* Display Settings */}
      <Section title="Display">
        <Row label="Theme" sub="Switch between dark and light mode">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#e2dff5]/50">{isDark ? "🌙 Dark" : "☀️ Light"}</span>
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-primary"
              checked={!isDark}
              onChange={(e) => applyTheme(e.target.checked ? "nightshade-light" : "nightshade")}
            />
          </div>
        </Row>

        <Row label="Compact Cards" sub="Reduces padding on cards throughout the app">
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-primary"
            checked={compactCards}
            onChange={(e) => applyCompact(e.target.checked)}
          />
        </Row>

        {/* Live preview */}
        <div className="mt-1 grid grid-cols-2 gap-3">
          <div className="card bg-[#1e1838] border border-[#2a2245] rounded-xl">
            <div className="card-body">
              <p className="text-xs font-semibold text-[#c084fc]">Card preview</p>
              <p className="text-xs text-[#e2dff5]/60">This is what a card looks like with current settings.</p>
            </div>
          </div>
          <div className="card bg-[#1e1838] border border-[#2a2245] rounded-xl">
            <div className="card-body">
              <p className="text-xs font-semibold text-[#c084fc]">Another card</p>
              <p className="text-xs text-[#e2dff5]/60">Padding shrinks when compact mode is on.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Save */}
      <button
        onClick={handleSave}
        className="btn w-full bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl font-bold text-white border-0"
      >
        {saved ? "✓ Saved!" : "Save Settings"}
      </button>
    </div>
  );
}
