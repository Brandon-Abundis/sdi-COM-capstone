import { useState } from "react";
import GroupSidebar, { mockGroups } from "./components/GroupSidebar";
import GroupChat from "./components/GroupChat";
import GroupCalendar from "./components/GroupCalendar";
import DirectMessage from "./components/DirectMessage";

export default function ChatAndGroup() {
  const [selectedItem, setSelectedItem] = useState({ type: "group", data: mockGroups[0] });
  const [groupTab, setGroupTab] = useState("chat"); // 'chat' | 'calendar'

  function handleSelect(item) {
    setSelectedItem(item);
    setGroupTab("chat");
  }

  const isGroup = selectedItem?.type === "group";
  const isDM    = selectedItem?.type === "dm";

  return (
    <div className="flex h-screen bg-[#0f0d17] overflow-hidden">
      <GroupSidebar selectedItem={selectedItem} onSelect={handleSelect} />

      {/* Main panel */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top bar */}
        <div className="px-4 py-3 border-b border-[#1e1838] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#e2dff5]">
              {isGroup ? `# ${selectedItem.data.name}` : selectedItem?.data.full_name}
            </span>
          </div>

          {/* Tab toggle — groups only */}
          {isGroup && (
            <div className="flex gap-1 bg-[#1e1838] rounded-lg p-1">
              <button
                onClick={() => setGroupTab("chat")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  groupTab === "chat"
                    ? "bg-[#7c3aed] text-white"
                    : "text-[#e2dff5]/60 hover:text-[#e2dff5]"
                }`}
              >
                💬 Chat
              </button>
              <button
                onClick={() => setGroupTab("calendar")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  groupTab === "calendar"
                    ? "bg-[#7c3aed] text-white"
                    : "text-[#e2dff5]/60 hover:text-[#e2dff5]"
                }`}
              >
                📅 Calendar
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {isGroup && groupTab === "chat"     && <GroupChat     group={selectedItem.data} />}
          {isGroup && groupTab === "calendar" && <GroupCalendar group={selectedItem.data} />}
          {isDM                               && <DirectMessage dmUser={selectedItem.data} />}
        </div>
      </div>
    </div>
  );
}