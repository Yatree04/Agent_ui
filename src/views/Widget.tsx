import { useState } from "react";
import { TRAILS, Trail, FILE_ICON, dotColor } from "../data";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const STREAK_DAYS = [true, true, true, false, false, false, false];

const CONTEXT_SUMMARIES: Record<string, string> = {
  all: "Active across 5 items over 6 days. Most activity clusters around the proposal doc and Figma deck — iterating on pricing framing. Client notes have the most recent writes.",
  "0": "Proposal_v4.fig was last edited 2 days ago. The main open thread is pricing — your last note flagged Q3 numbers as unresolved.",
  "1": "Scope of Work was open for ~40 min in the last session. Linked to the proposal as the written companion.",
  "2": "Opened but not edited. Referenced in your capture note about pricing. No changes since Aug 12.",
  "3": "Linear board was open briefly. 2 issues tagged to this trail. Nothing marked done since Aug 15.",
  "4": "client-notes.md has the most recent writes — last edit this morning. Contains the pricing conversation note.",
};

interface WidgetProps {
  activeTrail: Trail;
  mode: "revive" | "contextualise";
  onModeChange: (m: "revive" | "contextualise") => void;
  onOpenQuery: () => void;
  onOpenCapture: () => void;
}

export default function Widget({ activeTrail, mode, onModeChange }: WidgetProps) {
  if (!activeTrail) return null;

  const [showPopup, setShowPopup] = useState(true);
  const [revived, setRevived] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);
  const [selectedTrailId, setSelectedTrailId] = useState(activeTrail.id);
  const [showTrailPicker, setShowTrailPicker] = useState(false);

  const currentTrail = TRAILS.find(t => t.id === selectedTrailId) ?? activeTrail;

  const handleRevive = () => {
    setRevived(true);
    onModeChange("revive");
    setTimeout(() => setRevived(false), 2200);
  };

  const confidenceDot = dotColor(currentTrail.confidence);

  return (
    <div className="flex flex-col items-center gap-3 w-[340px]">

      {/* Streak / continuity popup */}
      {showPopup && (
        <div
          className="relative w-full rounded-3xl px-7 pt-9 pb-4"
          style={{ background: "#fff", boxShadow: "0 4px 28px rgba(0,0,0,0.09)" }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-5 w-10 h-10 rounded-full"
            style={{ background: "#F0F0F0", border: "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          />
          <p className="text-center text-[13px] leading-snug mb-4" style={{ color: "#888" }}>
            <span style={{ color: "#111", fontWeight: 600 }}>"{currentTrail.name}"</span>
            <br />
            <span>has been active {currentTrail.active}</span>
          </p>
          <div className="flex items-center justify-between mb-4">
            {DAYS.map((day, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium"
                style={{
                  background: STREAK_DAYS[i] ? "#BBF7D0" : "transparent",
                  color: STREAK_DAYS[i] ? "#166534" : "#CACACA",
                  border: STREAK_DAYS[i] ? "none" : "1.5px solid #E5E5E5",
                }}
              >
                {day}
              </div>
            ))}
          </div>
          <button
            className="w-full py-2.5 rounded-2xl text-[12px] font-semibold transition-all"
            style={{ background: "#BBF7D0", color: "#166534" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#A7F3C5")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#BBF7D0")}
          >
            View context
          </button>
          <button
            className="absolute bottom-3 right-4 text-[12px]"
            style={{ color: "#CACACA" }}
            onClick={() => setShowPopup(false)}
          >
            ˅
          </button>
        </div>
      )}

      {/* Main widget */}
      <div
        className="w-full rounded-3xl overflow-hidden"
        style={{ background: "#fff", boxShadow: "0 4px 28px rgba(0,0,0,0.09)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-semibold leading-tight" style={{ color: "#111" }}>
              Where you left off…
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px]" style={{ color: "#ABABAB" }}>
                Trail since {currentTrail.date} · auto-logged today
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full shrink-0" style={{ background: "#F0F0F0" }} />
        </div>

        {/* Trail switcher — click to pick a different trail */}
        <div className="px-5 mb-3">
          <button
            onClick={() => setShowTrailPicker(!showTrailPicker)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl transition-colors text-left"
            style={{ background: "#F8F8F8", border: "1.5px solid #EFEFEF" }}
          >
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: confidenceDot }} />
            <span className="text-[12px] font-medium flex-1 truncate" style={{ color: "#333" }}>
              {currentTrail.name}
            </span>
            <span className="text-[10px]" style={{ color: "#CACACA" }}>
              {showTrailPicker ? "▴" : "▾"}
            </span>
          </button>

          {showTrailPicker && (
            <div
              className="mt-1.5 rounded-2xl overflow-hidden"
              style={{ border: "1.5px solid #EFEFEF", background: "#fff" }}
            >
              {TRAILS.map(tr => (
                <button
                  key={tr.id}
                  onClick={() => { setSelectedTrailId(tr.id); setShowTrailPicker(false); setFocusedIdx(null); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors border-b last:border-0"
                  style={{ borderColor: "#F5F5F5", background: tr.id === selectedTrailId ? "#F8F8F8" : "transparent" }}
                  onMouseEnter={e => { if (tr.id !== selectedTrailId) (e.currentTarget as HTMLElement).style.background = "#FAFAFA"; }}
                  onMouseLeave={e => { if (tr.id !== selectedTrailId) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColor(tr.confidence) }} />
                  <span className="text-[12px] flex-1 truncate" style={{ color: tr.id === selectedTrailId ? "#111" : "#666", fontWeight: tr.id === selectedTrailId ? 600 : 400 }}>
                    {tr.name}
                  </span>
                  <span className="text-[10px] font-mono shrink-0" style={{ color: "#CACACA" }}>
                    {tr.confidence}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body: revive view */}
        {mode === "revive" ? (
          <div className="relative px-5 mb-3">
            <div className="flex gap-2 overflow-x-auto pr-10" style={{ scrollbarWidth: "none" }}>
              {currentTrail.items.map((item, i) => (
                <div
                  key={i}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl"
                  style={{ background: "#F5F5F5", border: "1.5px solid #EBEBEB" }}
                >
                  <span style={{ fontSize: 10, color: "#CACACA" }}>{FILE_ICON[item.type] ?? "•"}</span>
                  <span className="text-[11px] font-medium whitespace-nowrap" style={{ color: "#555" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="absolute right-0 top-0 h-full w-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, transparent, #fff)" }}
            />
          </div>
        ) : (
          /* Contextualise view */
          <div className="px-5 mb-3">
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() => setFocusedIdx(null)}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-150"
                style={{ background: focusedIdx === null ? "#111" : "#F0F0F0", color: focusedIdx === null ? "#fff" : "#999" }}
              >
                All
              </button>
              {currentTrail.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setFocusedIdx(i === focusedIdx ? null : i)}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-150"
                  style={{ background: focusedIdx === i ? "#111" : "#F0F0F0", color: focusedIdx === i ? "#fff" : "#999" }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: "#777" }}>
              {CONTEXT_SUMMARIES[focusedIdx !== null ? String(focusedIdx) : "all"]}
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 px-5 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono" style={{ color: "#CACACA" }}>{currentTrail.items.length}</span>
            <span className="text-[10px]" style={{ color: "#DCDCDC" }}>items</span>
          </div>
          <span style={{ color: "#EBEBEB", fontSize: 10 }}>·</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px]" style={{ color: "#DCDCDC" }}>since</span>
            <span className="text-[10px] font-mono" style={{ color: "#CACACA" }}>{currentTrail.date}</span>
          </div>
          <span style={{ color: "#EBEBEB", fontSize: 10 }}>·</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: confidenceDot }} />
            <span className="text-[10px] font-mono" style={{ color: "#CACACA" }}>{currentTrail.confidence}% confidence</span>
          </div>
        </div>

        {/* Action tray */}
        <div className="px-4 pb-4">
          <div className="flex rounded-2xl p-1" style={{ background: "#F5F5F5" }}>
            <button
              onClick={handleRevive}
              className="flex-1 py-2 rounded-xl text-[12px] font-medium transition-all duration-150"
              style={{
                background: mode === "revive" ? "#111" : "transparent",
                color: mode === "revive" ? "#fff" : "#ABABAB",
                boxShadow: mode === "revive" ? "0 1px 6px rgba(0,0,0,0.12)" : "none",
              }}
            >
              {revived ? "Reviving…" : "Revive workspace"}
            </button>
            <button
              onClick={() => onModeChange("contextualise")}
              className="flex-1 py-2 rounded-xl text-[12px] font-medium transition-all duration-150"
              style={{
                background: mode === "contextualise" ? "#111" : "transparent",
                color: mode === "contextualise" ? "#fff" : "#ABABAB",
                boxShadow: mode === "contextualise" ? "0 1px 6px rgba(0,0,0,0.12)" : "none",
              }}
            >
              Contextualise
            </button>
          </div>
        </div>
      </div>

      {!showPopup && (
        <button
          onClick={() => setShowPopup(true)}
          className="text-[11px] font-mono"
          style={{ color: "#C4C4C4" }}
        >
          ↑ continuity signal
        </button>
      )}
    </div>
  );
}
