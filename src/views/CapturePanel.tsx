import { useState, useRef, useEffect } from "react";
import { TRAILS, dotColor } from "../data";

interface Attachment {
  id: string;
  type: "image" | "link" | "screenshot" | "file";
  label: string;
}

interface Draft {
  id: string;
  text: string;
  trailId: string;
  attachments: Attachment[];
  savedAt: string;
}

type FilingState = "idle" | "confident" | "ambiguous" | "filed";

const SLASH_COMMANDS = [
  { cmd: "/reg", desc: "Structured register entry" },
  { cmd: "/mode", desc: "Attach directly to a trail" },
  { cmd: "/later", desc: "Flag for resurfacing" },
];

const AMBIGUOUS_TRAILS = [TRAILS[0], TRAILS[1]];

export default function CapturePanel() {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [targetTrailId, setTargetTrailId] = useState(TRAILS[0].id);
  const [expanded, setExpanded] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [filingState, setFilingState] = useState<FilingState>("idle");
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [showTrailPicker, setShowTrailPicker] = useState(false);
  const [filedTrail, setFiledTrail] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  const targetTrail = TRAILS.find(t => t.id === targetTrailId) ?? TRAILS[0];
  const hasContent = text.trim().length > 0 || attachments.length > 0;

  const filteredSlash = SLASH_COMMANDS.filter(c => c.cmd.startsWith(slashFilter));

  const handleTextChange = (val: string) => {
    setText(val);
    const lastWord = val.split(" ").pop() ?? "";
    if (lastWord.startsWith("/")) {
      setSlashFilter(lastWord);
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
      setSlashFilter("");
    }
  };

  const applySlash = (cmd: string) => {
    const words = text.split(" ");
    words[words.length - 1] = cmd + " ";
    setText(words.join(" "));
    setShowSlashMenu(false);
    textareaRef.current?.focus();
  };

  const addAttachment = (type: Attachment["type"], label: string) => {
    setAttachments(prev => [...prev, { id: Date.now().toString(), type, label }]);
    setShowLinkInput(false);
    setLinkInput("");
  };

  const saveDraft = () => {
    if (!hasContent) return;
    const draft: Draft = {
      id: Date.now().toString(),
      text,
      trailId: targetTrailId,
      attachments: [...attachments],
      savedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setDrafts(prev => [draft, ...prev]);
    setText("");
    setAttachments([]);
  };

  const loadDraft = (draft: Draft) => {
    setText(draft.text);
    setAttachments(draft.attachments);
    setTargetTrailId(draft.trailId);
    setDrafts(prev => prev.filter(d => d.id !== draft.id));
    setShowDrafts(false);
  };

  const handleSend = () => {
    if (!hasContent || filingState !== "idle") return;
    const isAmbiguous = text.toLowerCase().includes("client") && targetTrailId === TRAILS[0].id;
    setFilingState(isAmbiguous ? "ambiguous" : "confident");
  };

  const confirmFiling = (trailId: string) => {
    const trail = TRAILS.find(t => t.id === trailId);
    setFiledTrail(trail?.name ?? targetTrail.name);
    setFilingState("filed");
    setTimeout(() => {
      setFilingState("idle");
      setFiledTrail(null);
      setText("");
      setAttachments([]);
    }, 2000);
  };

  return (
    <div
      className="size-full flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #EFEFEF 0%, #E5E5E5 100%)" }}
    >
      <div className="flex flex-col items-center gap-3 w-[380px]">

        {/* Ambiguous filing prompt */}
        {filingState === "ambiguous" && (
          <div
            className="w-full px-4 py-3 rounded-2xl"
            style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.09)", animation: "popIn 0.2s ease" }}
          >
            <p className="text-[12px] mb-2.5" style={{ color: "#555" }}>Which trail is this for?</p>
            <div className="flex gap-2">
              {AMBIGUOUS_TRAILS.map(tr => (
                <button
                  key={tr.id}
                  onClick={() => confirmFiling(tr.id)}
                  className="flex-1 py-2 rounded-xl text-[12px] font-medium transition-all"
                  style={{ background: "#F5F5F5", color: "#333" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#EBEBEB")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#F5F5F5")}
                >
                  {tr.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confident filing prompt */}
        {filingState === "confident" && (
          <div
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl cursor-pointer"
            style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", animation: "popIn 0.2s ease" }}
            onClick={() => confirmFiling(targetTrailId)}
          >
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor(targetTrail.confidence) }} />
            <span className="text-[12px] flex-1" style={{ color: "#555" }}>
              Filing to <span className="font-semibold" style={{ color: "#111" }}>{targetTrail.name}</span>
            </span>
            <span className="text-[11px] font-medium px-3 py-1 rounded-full" style={{ background: "#111", color: "#fff" }}>
              Confirm
            </span>
          </div>
        )}

        {/* Filed confirmation */}
        {filingState === "filed" && (
          <div
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl"
            style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", animation: "popIn 0.2s ease" }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: "#10B981" }} />
            <span className="text-[12px]" style={{ color: "#555" }}>
              Filed to <span className="font-semibold" style={{ color: "#111" }}>{filedTrail}</span>
            </span>
          </div>
        )}

        {/* Drafts panel */}
        {showDrafts && drafts.length > 0 && (
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <div className="px-4 py-2.5 border-b" style={{ borderColor: "#F5F5F5" }}>
              <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "#C4C4C4" }}>
                Drafts — {drafts.length}
              </span>
            </div>
            {drafts.map(d => {
              const trail = TRAILS.find(t => t.id === d.trailId);
              return (
                <button
                  key={d.id}
                  onClick={() => loadDraft(d)}
                  className="w-full text-left flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors"
                  style={{ borderColor: "#F8F8F8" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#FAFAFA")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] truncate" style={{ color: "#333" }}>{d.text || "(no text)"}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#CACACA" }}>→ {trail?.name} · {d.savedAt}</p>
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color: "#CACACA" }}>load</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main capture card */}
        <div
          className="w-full rounded-3xl overflow-hidden"
          style={{ background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.11)" }}
        >
          {/* Top bar */}
          <div className="flex items-center px-4 pt-4 pb-2 gap-2">
            {/* Trail picker */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowTrailPicker(!showTrailPicker)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors"
                style={{ background: "#F5F5F5" }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor(targetTrail.confidence) }} />
                <span className="text-[11px] font-medium max-w-[140px] truncate" style={{ color: "#555" }}>
                  {targetTrail.name}
                </span>
                <span className="text-[9px]" style={{ color: "#CACACA" }}>{showTrailPicker ? "▴" : "▾"}</span>
              </button>
              {showTrailPicker && (
                <div
                  className="absolute top-full left-0 mt-1 w-[240px] rounded-2xl overflow-hidden z-10"
                  style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: "1px solid #F0F0F0" }}
                >
                  {TRAILS.map(tr => (
                    <button
                      key={tr.id}
                      onClick={() => { setTargetTrailId(tr.id); setShowTrailPicker(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-left border-b last:border-0 transition-colors"
                      style={{ borderColor: "#F8F8F8", background: tr.id === targetTrailId ? "#FAFAFA" : "transparent" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#F8F8F8")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = tr.id === targetTrailId ? "#FAFAFA" : "transparent")}
                    >
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColor(tr.confidence) }} />
                      <span className="text-[12px] flex-1 truncate" style={{ color: "#333" }}>{tr.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Drafts toggle */}
            <button
              onClick={() => setShowDrafts(!showDrafts)}
              className="text-[11px] px-2.5 py-1.5 rounded-full transition-colors"
              style={{ background: showDrafts ? "#EBEBEB" : "#F5F5F5", color: "#999" }}
            >
              Drafts {drafts.length > 0 && `(${drafts.length})`}
            </button>

            {/* Expand trail */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full transition-colors"
              style={{ background: "#F5F5F5", color: "#999" }}
            >
              <span>{expanded ? "▴" : "▾"}</span>
              <span>Trail</span>
            </button>
          </div>

          {/* Trail items (expanded) */}
          {expanded && (
            <div
              className="mx-4 mb-3 rounded-2xl overflow-hidden"
              style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}
            >
              <div className="px-3 py-2" style={{ borderBottom: "1px solid #F0F0F0" }}>
                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#C4C4C4" }}>
                  {targetTrail.name} · {targetTrail.items.length} items
                </span>
              </div>
              <div className="max-h-[140px] overflow-y-auto">
                {targetTrail.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 border-b last:border-0"
                    style={{ borderColor: "#F5F5F5" }}
                  >
                    <span style={{ fontSize: 10, color: "#DCDCDC" }}>•</span>
                    <span className="text-[11px] truncate" style={{ color: "#888" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="flex gap-2 px-4 pb-2 flex-wrap">
              {attachments.map(att => (
                <div
                  key={att.id}
                  className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-xl"
                  style={{ background: "#F5F5F5" }}
                >
                  <span style={{ fontSize: 10, color: "#C4C4C4" }}>
                    {att.type === "link" ? "◈" : att.type === "screenshot" ? "⊡" : att.type === "image" ? "▣" : "□"}
                  </span>
                  <span className="text-[11px] max-w-[110px] truncate" style={{ color: "#777" }}>{att.label}</span>
                  <button
                    onClick={() => setAttachments(p => p.filter(a => a.id !== att.id))}
                    style={{ fontSize: 10, color: "#BEBEBE" }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Link input */}
          {showLinkInput && (
            <div className="px-4 pb-2">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-2xl"
                style={{ background: "#F8F8F8", border: "1px solid #EEEEEE" }}
              >
                <span style={{ fontSize: 12, color: "#C4C4C4" }}>◈</span>
                <input
                  autoFocus
                  value={linkInput}
                  onChange={e => setLinkInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && linkInput.trim()) addAttachment("link", linkInput.trim());
                    if (e.key === "Escape") setShowLinkInput(false);
                  }}
                  placeholder="Paste a link and press Enter"
                  className="flex-1 bg-transparent text-[12px] outline-none"
                  style={{ color: "#333" }}
                />
              </div>
            </div>
          )}

          {/* Slash command menu */}
          {showSlashMenu && filteredSlash.length > 0 && (
            <div className="mx-4 mb-2 rounded-2xl overflow-hidden" style={{ border: "1px solid #F0F0F0", background: "#fff" }}>
              {filteredSlash.map(c => (
                <button
                  key={c.cmd}
                  onClick={() => applySlash(c.cmd)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left border-b last:border-0 transition-colors hover:bg-[#FAFAFA]"
                  style={{ borderColor: "#F8F8F8" }}
                >
                  <span className="font-mono text-[12px] font-medium" style={{ color: "#111" }}>{c.cmd}</span>
                  <span className="text-[11px]" style={{ color: "#999" }}>{c.desc}</span>
                </button>
              ))}
            </div>
          )}

          {/* Textarea */}
          <div className="px-4 pb-2">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => handleTextChange(e.target.value)}
              placeholder="What's on your mind… (try /reg, /mode, /later)"
              className="w-full resize-none bg-transparent outline-none text-[13px] leading-relaxed"
              style={{ color: "#222", minHeight: "58px", maxHeight: "130px" }}
              rows={2}
              onKeyDown={e => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && hasContent) handleSend();
                if (e.key === "Escape" && showTrailPicker) setShowTrailPicker(false);
              }}
            />
          </div>

          {/* Toolbar */}
          <div
            className="flex items-center gap-1.5 px-3 pb-3 pt-2"
            style={{ borderTop: "1px solid #F5F5F5" }}
          >
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "#F5F5F5", color: "#999", fontSize: 18, fontWeight: 300 }}
            >+</button>

            <button
              onClick={() => addAttachment("screenshot", `Screen ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-medium transition-all"
              style={{ background: "#F5F5F5", color: "#777" }}
            >⊡ Screen</button>

            <button
              onClick={() => setShowLinkInput(!showLinkInput)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-medium transition-all"
              style={{ background: showLinkInput ? "#111" : "#F5F5F5", color: showLinkInput ? "#fff" : "#777" }}
            >◈ Link</button>

            <button
              onClick={() => addAttachment("image", `image_${Date.now()}.png`)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-medium transition-all"
              style={{ background: "#F5F5F5", color: "#777" }}
            >▣ Image</button>

            {/* Save draft */}
            {hasContent && filingState === "idle" && (
              <button
                onClick={saveDraft}
                className="h-8 px-3 rounded-full text-[11px] font-medium transition-all"
                style={{ background: "#F5F5F5", color: "#ABABAB" }}
                title="Save as draft"
              >Save</button>
            )}

            <span className="flex-1" />

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={!hasContent || filingState !== "idle"}
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all duration-200"
              style={{
                background: filingState === "filed" ? "#10B981" : hasContent && filingState === "idle" ? "#111" : "#E8E8E8",
                color: "#fff",
              }}
              title="File this (⌘↵)"
            >
              {filingState === "filed"
                ? <span style={{ fontSize: 14 }}>✓</span>
                : <span style={{ fontSize: 16, display: "block", transform: "rotate(-90deg)" }}>→</span>
              }
            </button>
          </div>
        </div>

        <p className="text-[10px] font-mono text-center" style={{ color: "#C4C4C4" }}>
          Type "client" to see ambiguous filing · /reg /mode /later · ⌘↵ to send
        </p>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.94) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
