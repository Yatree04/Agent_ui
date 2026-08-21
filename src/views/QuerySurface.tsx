import { useState, useRef, useEffect } from "react";
import { TRAILS, Trail, FILE_ICON, dotColor } from "../data";
import svgPaths from "../imports/QueryPanel/svg-a5yk7y00by";

const IS = { fontFamily: "'Instrument Sans', sans-serif", fontVariationSettings: '"wdth" 100' };

// ── Confidence pip ────────────────────────────────────────────────────────

function ConfidencePip({ score }: { score: number }) {
  const color = dotColor(score);
  const bg = score >= 85 ? "rgba(187,247,208,0.10)" : score >= 65 ? "rgba(252,211,77,0.08)" : "rgba(255,255,255,0.04)";
  return (
    <div className="flex gap-[5px] items-center px-[8px] py-[4px] rounded-full shrink-0" style={{ background: bg }}>
      <div className="rounded-full shrink-0 size-[5px]" style={{ background: color }} />
      <p className="font-medium text-[11px] whitespace-nowrap" style={{ ...IS, color, lineHeight: "16.5px" }}>
        {score}%
      </p>
    </div>
  );
}

// ── Item chip ─────────────────────────────────────────────────────────────

function ItemChip({ type, label, highlight }: { type: string; label: string; highlight?: string }) {
  const icon = FILE_ICON[type] ?? "•";
  const highlighted = highlight
    ? label.replace(new RegExp(`(${highlight})`, "gi"), "§$1§")
    : label;

  return (
    <div
      className="inline-flex gap-[6px] items-center px-[10px] py-[5px] rounded-full shrink-0 whitespace-nowrap"
      style={{ background: "rgba(255,255,255,0.06)", border: "0.8px solid rgba(255,255,255,0.08)" }}
    >
      <span className="text-[10px] leading-[10px]" style={{ ...IS, color: "#555" }}>{icon}</span>
      <span className="font-medium text-[11px]" style={{ ...IS, color: "#888", lineHeight: "16.5px" }}>
        {highlight
          ? highlighted.split("§").map((seg, i) =>
              i % 2 === 1
                ? <mark key={i} style={{ background: "transparent", color: "#f0f0f2" }}>{seg}</mark>
                : seg
            )
          : label}
      </span>
    </div>
  );
}

// ── Search icon (from imported SVG) ───────────────────────────────────────

function SearchIcon() {
  return (
    <svg className="shrink-0 size-[14px]" fill="none" viewBox="0 0 14 14">
      <g clipPath="url(#sq-clip)">
        <path d={svgPaths.p19792100} stroke="#444" strokeWidth="1.3" />
        <path d="M9.5 9.5L12.5 12.5" stroke="#444" strokeLinecap="round" strokeWidth="1.3" />
      </g>
      <defs><clipPath id="sq-clip"><rect fill="white" height="14" width="14" /></clipPath></defs>
    </svg>
  );
}

// ── Kbd ───────────────────────────────────────────────────────────────────

function Kbd({ label }: { label: string }) {
  return (
    <div className="border-[0.8px] border-[rgba(255,255,255,0.08)] flex flex-col items-start px-[5px] py-px rounded-[4px] shrink-0">
      <p className="text-[10px] whitespace-nowrap leading-[15px]" style={{ ...IS, color: "#444" }}>{label}</p>
    </div>
  );
}

// ── Resuface card ─────────────────────────────────────────────────────────

function ResurfaceCard({ trail, onClick }: { trail: Trail; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full text-left flex flex-col gap-[8px] items-start px-[20px] py-[16px] border-b border-[rgba(255,255,255,0.05)] transition-colors duration-100"
      style={{ background: hovered ? "rgba(255,255,255,0.02)" : "transparent" }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col items-start">
          <p className="font-semibold text-[13.5px] whitespace-nowrap leading-[20.25px]" style={{ ...IS, color: "#f0f0f2" }}>
            {trail.name}
          </p>
          <p className="text-[12px] whitespace-nowrap leading-[18px] pt-px" style={{ ...IS, color: "#555" }}>
            has been active {trail.active}
          </p>
        </div>
        <ConfidencePip score={trail.confidence} />
      </div>
      {/* Chips row */}
      <div className="flex gap-[6px] h-[28.1px] items-center overflow-clip w-full">
        {trail.items.slice(0, 3).map((item, i) => (
          <ItemChip key={i} type={item.type} label={item.label} />
        ))}
        {trail.items.length > 3 && (
          <p className="text-[11px] shrink-0" style={{ ...IS, color: "#444", lineHeight: "16.5px" }}>
            +{trail.items.length - 3}
          </p>
        )}
      </div>
    </button>
  );
}

// ── Trail row ─────────────────────────────────────────────────────────────

function TrailRow({ trail, selected, onClick, highlight }: { trail: Trail; selected: boolean; onClick: () => void; highlight?: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex flex-col gap-[8px] items-start px-[16px] py-[12px] border-b border-[rgba(255,255,255,0.05)] last:border-0 transition-colors duration-100"
      style={{ background: selected ? "rgba(187,247,208,0.04)" : "transparent" }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-[8px] min-w-0">
          <div className="rounded-full shrink-0 size-[4px]" style={{ background: dotColor(trail.confidence), opacity: selected ? 1 : 0.5 }} />
          <p className="truncate text-[13.5px] leading-[20.25px]" style={{ ...IS, fontWeight: selected ? 600 : 500, color: selected ? "#f0f0f2" : "#aaa" }}>
            {trail.name}
          </p>
        </div>
        <div className="flex gap-[10px] items-center shrink-0 ml-3">
          <ConfidencePip score={trail.confidence} />
          <p className="text-[11px] whitespace-nowrap leading-[16.5px]" style={{ ...IS, color: "#444" }}>
            {trail.lastActive}
          </p>
        </div>
      </div>
      <div className="flex gap-[6px] h-[28.1px] items-center overflow-clip w-full">
        {trail.items.slice(0, 3).map((item, i) => (
          <ItemChip key={i} type={item.type} label={item.label} highlight={highlight} />
        ))}
        {trail.items.length > 3 && (
          <p className="text-[11px] shrink-0" style={{ ...IS, color: "#444", lineHeight: "16.5px" }}>
            +{trail.items.length - 3}
          </p>
        )}
      </div>
    </button>
  );
}

// ── Detail view ───────────────────────────────────────────────────────────

function DetailView({ trail, onBack }: { trail: Trail; onBack: () => void }) {
  const [revived, setRevived] = useState(false);
  const [contextualised, setContextualised] = useState(false);
  const [note, setNote] = useState("");
  const [noteFiled, setNoteFiled] = useState(false);

  const handleRevive = () => { setRevived(true); setTimeout(() => setRevived(false), 2200); };
  const handleContextualise = () => { setContextualised(true); setTimeout(() => setContextualised(false), 2200); };
  const handleFileNote = () => {
    if (!note.trim()) return;
    setNoteFiled(true);
    setTimeout(() => { setNoteFiled(false); setNote(""); }, 1800);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Back + header */}
      <div className="flex items-start gap-[12px] px-[20px] py-[16px] border-b border-[rgba(255,255,255,0.06)]">
        <button
          onClick={onBack}
          className="mt-[2px] text-[11px] shrink-0 transition-opacity hover:opacity-70"
          style={{ ...IS, color: "#444" }}
        >
          ← back
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[8px] mb-[4px]">
            <div className="rounded-full size-[6px] shrink-0" style={{ background: dotColor(trail.confidence), boxShadow: `0 0 6px ${dotColor(trail.confidence)}88` }} />
            <p className="text-[11px] font-medium" style={{ ...IS, color: "#3a3a44", lineHeight: "16.5px" }}>
              Trail · {trail.active}
            </p>
          </div>
          <p className="font-semibold text-[18px] leading-[24px]" style={{ ...IS, color: "#f0f0f2" }}>
            {trail.name}
          </p>
          <p className="text-[11px] mt-[3px]" style={{ ...IS, color: "#3a3a44", lineHeight: "16.5px" }}>
            Trail since {trail.date} · auto-logged {trail.lastActive}
          </p>
        </div>
        <ConfidencePip score={trail.confidence} />
      </div>

      {/* Items */}
      <div className="px-[20px] py-[14px] border-b border-[rgba(255,255,255,0.06)]">
        <p className="text-[10px] font-medium uppercase tracking-[0.7px] mb-[10px]" style={{ ...IS, color: "#333", lineHeight: "15px" }}>
          Captured items
        </p>
        <div className="flex flex-wrap gap-[6px]">
          {trail.items.map((item, i) => (
            <ItemChip key={i} type={item.type} label={item.label} />
          ))}
        </div>
      </div>

      {/* Context */}
      <div className="px-[20px] py-[14px] border-b border-[rgba(255,255,255,0.06)]">
        <p className="text-[10px] font-medium uppercase tracking-[0.7px] mb-[10px]" style={{ ...IS, color: "#333", lineHeight: "15px" }}>
          Context
        </p>
        <p className="text-[13px] leading-[21px]" style={{ ...IS, color: "#666" }}>
          {trail.excerpt}
        </p>
      </div>

      {/* Quick capture into trail */}
      <div className="px-[20px] py-[14px] border-b border-[rgba(255,255,255,0.06)]">
        <p className="text-[10px] font-medium uppercase tracking-[0.7px] mb-[10px]" style={{ ...IS, color: "#333", lineHeight: "15px" }}>
          Add to trail
        </p>
        <div className="flex gap-[8px] items-end">
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleFileNote(); }}
            placeholder="Jot something into this trail…"
            className="flex-1 bg-[rgba(255,255,255,0.04)] rounded-[10px] px-[12px] py-[8px] text-[12px] outline-none resize-none border border-[rgba(255,255,255,0.07)] transition-colors"
            style={{ ...IS, color: "#f0f0f2", minHeight: 60 }}
            rows={2}
          />
          <button
            onClick={handleFileNote}
            className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 transition-all"
            style={{ background: note.trim() ? (noteFiled ? "#4ade80" : "#f0f0f2") : "rgba(255,255,255,0.06)", color: note.trim() ? "#111" : "#444" }}
          >
            {noteFiled ? "✓" : <span style={{ fontSize: 14, transform: "rotate(-90deg)", display: "block" }}>→</span>}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="px-[16px] py-[12px]">
        <div className="flex h-[47px] p-[3px] rounded-[15px]" style={{ background: "rgba(255,255,255,0.06)" }}>
          <button
            onClick={handleRevive}
            className="flex-1 rounded-[12px] text-[13px] font-medium transition-all hover:opacity-80"
            style={{ ...IS, color: revived ? "#4ade80" : "#555" }}
          >
            {revived ? "Reviving…" : "Revive workspace"}
          </button>
          <button
            onClick={handleContextualise}
            className="flex-1 rounded-[12px] text-[13px] font-semibold transition-all hover:opacity-90"
            style={{ ...IS, background: contextualised ? "rgba(74,222,128,0.15)" : "#f0f0f2", color: contextualised ? "#4ade80" : "#111", boxShadow: "0px 1px 3px rgba(0,0,0,0.15)" }}
          >
            {contextualised ? "Contextualised ✓" : "Contextualise"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main QuerySurface ─────────────────────────────────────────────────────

export default function QuerySurface({
  onClose,
  onRevive,
  onContextualise,
}: {
  onClose: () => void;
  onRevive?: (trail: Trail) => void;
  onContextualise?: (trail: Trail) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Trail | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = query.trim()
    ? TRAILS.filter(tr =>
        tr.name.toLowerCase().includes(query.toLowerCase()) ||
        tr.items.some(i => i.label.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleOpen = (trail: Trail) => {
    setDetail(trail);
    setRecentIds(prev => [trail.id, ...prev.filter(id => id !== trail.id)].slice(0, 3));
  };

  const handleKey = (e: React.KeyboardEvent) => {
    const list = query.trim() ? filtered : TRAILS;
    const ids = list.map(tr => tr.id);
    const idx = selectedId ? ids.indexOf(selectedId) : -1;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedId(ids[Math.min(idx + 1, ids.length - 1)]); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedId(ids[Math.max(idx - 1, 0)]); }
    else if (e.key === "Enter" && selectedId) {
      const tr = TRAILS.find(tr => tr.id === selectedId);
      if (tr) handleOpen(tr);
    } else if (e.key === "Escape") {
      if (detail) setDetail(null);
      else if (query) { setQuery(""); setSelectedId(null); }
      else onClose();
    }
  };

  void onRevive; void onContextualise;

  return (
    <div
      className="bg-[#16161b] flex flex-col items-start overflow-clip relative rounded-[24px] w-[600px]"
      style={{ boxShadow: "0px 32px 80px 0px rgba(0,0,0,0.72), 0px 0px 0px 0.8px rgba(255,255,255,0.07)" }}
    >
      {detail ? (
        <>
          {/* Search bar stays visible in detail */}
          <div className="border-b border-[rgba(255,255,255,0.06)] flex gap-[12px] items-center px-[20px] py-[16px] w-full shrink-0">
            <SearchIcon />
            <p className="flex-1 text-[14px] truncate" style={{ ...IS, color: "rgba(240,240,242,0.35)" }}>
              {detail.name}
            </p>
            <button onClick={() => setDetail(null)} style={{ ...IS, color: "#444", fontSize: 11 }}>← search</button>
          </div>
          <DetailView trail={detail} onBack={() => setDetail(null)} />
        </>
      ) : (
        <>
          {/* Search bar */}
          <div className="border-b border-[rgba(255,255,255,0.06)] flex gap-[12px] items-center px-[20px] py-[16px] shrink-0 w-full">
            <SearchIcon />
            <div className="flex flex-[1_0_0] flex-col h-[21px] items-start justify-center min-w-px overflow-clip">
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedId(null); }}
                onKeyDown={handleKey}
                placeholder="Search Trails, files, tabs…"
                className="bg-transparent outline-none w-full text-[14px]"
                style={{ ...IS, color: query ? "#f0f0f2" : "rgba(240,240,242,0.5)" }}
              />
            </div>
            {query ? (
              <button
                onClick={() => { setQuery(""); setSelectedId(null); }}
                style={{ color: "#444", fontSize: 16, lineHeight: 1 }}
              >×</button>
            ) : (
              <div className="border-[0.8px] border-[rgba(255,255,255,0.08)] flex flex-col items-start px-[6px] py-[2px] rounded-[6px] shrink-0">
                <p className="text-[10px] whitespace-nowrap leading-[15px]" style={{ ...IS, color: "#444" }}>⌘K</p>
              </div>
            )}
          </div>

          {/* Body */}
          {!query.trim() ? (
            <div className="flex flex-col items-start w-full">
              {/* Proactive resurfacing label */}
              <div className="flex flex-col items-start pb-[8px] pt-[16px] px-[20px] w-full shrink-0">
                <p className="font-medium text-[10px] tracking-[0.7px] uppercase whitespace-nowrap leading-[15px]" style={{ ...IS, color: "#333" }}>
                  Proactive resurfacing
                </p>
              </div>

              {/* Resuface cards */}
              {TRAILS.slice(0, 2).map(tr => (
                <ResurfaceCard key={tr.id} trail={tr} onClick={() => handleOpen(tr)} />
              ))}

              {/* All Trails label */}
              <div className="flex flex-col items-start pb-[8px] pt-[16px] px-[20px] w-full shrink-0">
                <p className="font-medium text-[10px] tracking-[0.7px] uppercase whitespace-nowrap leading-[15px]" style={{ ...IS, color: "#333" }}>
                  All Trails
                </p>
              </div>

              {/* Trail rows */}
              {TRAILS.slice(2).map(tr => (
                <TrailRow
                  key={tr.id}
                  trail={tr}
                  selected={selectedId === tr.id}
                  onClick={() => handleOpen(tr)}
                />
              ))}

              {/* Recently viewed */}
              {recentIds.length > 0 && (
                <>
                  <div className="flex flex-col items-start pb-[8px] pt-[12px] px-[20px] w-full shrink-0">
                    <p className="font-medium text-[10px] tracking-[0.7px] uppercase whitespace-nowrap leading-[15px]" style={{ ...IS, color: "#2a2a30" }}>
                      Recently viewed
                    </p>
                  </div>
                  {recentIds.map(id => {
                    const tr = TRAILS.find(t => t.id === id);
                    if (!tr) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => handleOpen(tr)}
                        className="w-full text-left flex items-center gap-[10px] px-[20px] py-[10px] border-b border-[rgba(255,255,255,0.04)] last:border-0 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                      >
                        <div className="rounded-full size-[4px] shrink-0" style={{ background: dotColor(tr.confidence) }} />
                        <p className="text-[13px] flex-1 truncate" style={{ ...IS, color: "#555" }}>{tr.name}</p>
                        <p className="text-[11px] shrink-0" style={{ ...IS, color: "#2a2a30" }}>{tr.lastActive}</p>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-[40px] text-center w-full">
              <p className="text-[13px]" style={{ ...IS, color: "#3a3a44" }}>No trails match "{query}"</p>
            </div>
          ) : (
            <div className="flex flex-col items-start w-full">
              <div className="flex flex-col items-start pb-[4px] pt-[16px] px-[20px] w-full shrink-0">
                <p className="font-medium text-[10px] tracking-[0.7px] uppercase whitespace-nowrap leading-[15px]" style={{ ...IS, color: "#333" }}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
              {filtered.map(tr => (
                <TrailRow
                  key={tr.id}
                  trail={tr}
                  selected={selectedId === tr.id}
                  onClick={() => handleOpen(tr)}
                  highlight={query.trim()}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="border-t border-[rgba(255,255,255,0.05)] flex gap-[16px] items-center px-[20px] py-[12px] w-full shrink-0 mt-auto">
        {[["↑↓", "navigate"], ["↵", "open"], ["esc", "clear"]].map(([key, label]) => (
          <div key={key} className="flex gap-[6px] items-center shrink-0">
            <Kbd label={key} />
            <p className="text-[11px] whitespace-nowrap leading-[16.5px]" style={{ ...IS, color: "#444" }}>{label}</p>
          </div>
        ))}
        <div className="flex flex-[1_0_0] items-start justify-end min-w-px">
          <div className="flex gap-[6px] items-center opacity-40">
            <div className="bg-[#bbf7d0] rounded-full size-[5px]" />
            <p className="font-medium text-[11px] whitespace-nowrap leading-[16.5px]" style={{ ...IS, color: "#bbf7d0" }}>
              tray active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
