import { useState, useEffect } from "react";
import { useAuth } from "../../../app/AuthProvider.jsx";

const ACCENT_OPTIONS = [
  { label: "Purple",  value: "purple",  bg: "#7c3aed", text: "#c084fc" },
  { label: "Blue",    value: "blue",    bg: "#2563eb", text: "#93c5fd" },
  { label: "Emerald", value: "emerald", bg: "#059669", text: "#6ee7b7" },
  { label: "Rose",    value: "rose",    bg: "#e11d48", text: "#fda4af" },
  { label: "Amber",   value: "amber",   bg: "#d97706", text: "#fcd34d" },
];

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

  const [accent, setAccent] = useState(
    () => localStorage.getItem("setting_accent") ?? "purple"
  );
  const [reducedMotion, setReducedMotion] = useState(
    () => localStorage.getItem("setting_reduced_motion") === "true"
  );
  const [compactCards, setCompactCards] = useState(
    () => localStorage.getItem("setting_compact_cards") === "true"
  );
  const [showXP, setShowXP] = useState(
    () => localStorage.getItem("setting_show_xp") !== "false"
  );
  const [saved, setSaved] = useState(false);

  function handleSave() {
    localStorage.setItem("setting_accent", accent);
    localStorage.setItem("setting_reduced_motion", reducedMotion);
    localStorage.setItem("setting_compact_cards", compactCards);
    localStorage.setItem("setting_show_xp", showXP);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const currentAccent = ACCENT_OPTIONS.find((o) => o.value === accent) ?? ACCENT_OPTIONS[0];

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
          <span className="text-sm text-[#a78bfa] font-bold">{user?.xp?.toLocaleString() ?? 0} XP</span>
        </Row>
      </Section>

      {/* Graphic Settings */}
      <Section title="Graphic Settings">
        <Row label="Accent Color" sub="Changes highlight color across the app">
          <div className="flex gap-2">
            {ACCENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                title={opt.label}
                onClick={() => setAccent(opt.value)}
                className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: opt.bg,
                  borderColor: accent === opt.value ? "#fff" : "transparent",
                }}
              />
            ))}
          </div>
        </Row>

        <Row
          label="Reduced Motion"
          sub="Disables transition animations"
        >
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
          />
        </Row>

        <Row
          label="Compact Cards"
          sub="Reduces padding on event and workout cards"
        >
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={compactCards}
            onChange={(e) => setCompactCards(e.target.checked)}
          />
        </Row>

        <Row
          label="Show XP on Profile"
          sub="Displays your XP total publicly"
        >
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={showXP}
            onChange={(e) => setShowXP(e.target.checked)}
          />
        </Row>

        {/* Preview swatch */}
        <div
          className="mt-2 rounded-lg p-3 text-xs font-semibold border"
          style={{
            backgroundColor: `${currentAccent.bg}18`,
            borderColor: `${currentAccent.bg}55`,
            color: currentAccent.text,
          }}
        >
          Preview — {currentAccent.label} accent selected
        </div>
      </Section>

      {/* Save */}
      <button
        onClick={handleSave}
        className="btn w-full rounded-xl font-bold text-white border-0"
        style={{ backgroundColor: currentAccent.bg }}
      >
        {saved ? "✓ Saved!" : "Save Settings"}
      </button>
    </div>
  );
}
