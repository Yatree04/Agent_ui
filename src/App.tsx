import { useState } from "react";
import Widget from "./views/Widget";
import CapturePanel from "./views/CapturePanel";
import QuerySurface from "./views/QuerySurface";
import { TRAILS } from "./data";

type View = "widget" | "capture" | "query";

const VIEWS: { id: View; label: string }[] = [
  { id: "widget", label: "Widget" },
  { id: "capture", label: "Capture Popup" },
  { id: "query", label: "Query Surface" },
];

export default function App() {
  const [view, setView] = useState<View>("widget");

  return (
    <div
      className="size-full flex flex-col"
      style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Tab switcher */}
      <div
        className="flex items-center gap-1 px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid #EBEBEB", background: "#FAFAFA" }}
      >
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className="px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors duration-150"
            style={{
              background: view === v.id ? "#111" : "transparent",
              color: view === v.id ? "#fff" : "#999",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* View canvas */}
      <div className="flex-1 overflow-hidden">
        {view === "widget" && (
          <WidgetCanvas />
        )}
        {view === "capture" && (
          <CapturePanel />
        )}
        {view === "query" && (
          <QueryCanvas />
        )}
      </div>
    </div>
  );
}

// Widget shown centered on a light desktop canvas
function WidgetCanvas() {
  const [mode, setMode] = useState<"revive" | "contextualise">("revive");
  const [activeTrail] = useState(TRAILS[0] ?? null);
  if (!activeTrail) return null;

  return (
    <div
      className="size-full flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #EFEFEF 0%, #E5E5E5 100%)" }}
    >
      <Widget
        activeTrail={activeTrail}
        mode={mode}
        onModeChange={setMode}
        onOpenQuery={() => {}}
        onOpenCapture={() => {}}
      />
    </div>
  );
}

// Query surface shown centered on a dark canvas — 600px per Figma spec
function QueryCanvas() {
  return (
    <div
      className="size-full flex items-center justify-center p-8 overflow-auto"
      style={{ background: "#0e0e11" }}
    >
      <QuerySurface onClose={() => {}} />
    </div>
  );
}
