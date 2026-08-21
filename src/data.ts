export interface TrailItem {
  type: "figma" | "doc" | "tab" | "code" | "pdf" | "file";
  label: string;
}

export interface Trail {
  id: string;
  name: string;
  date: string;
  confidence: number;
  active: string;
  lastActive: string;
  items: TrailItem[];
  excerpt: string;
}

export const TRAILS: Trail[] = [
  {
    id: "1",
    name: "Client A — Proposal",
    date: "Aug 14",
    confidence: 94,
    active: "3 days running",
    lastActive: "today",
    items: [
      { type: "figma", label: "Proposal_v4.fig" },
      { type: "doc", label: "Scope of Work.docx" },
      { type: "tab", label: "dribbble.com/search/brand" },
      { type: "tab", label: "Linear — ClientA board" },
      { type: "doc", label: "client-notes.md" },
    ],
    excerpt:
      "Active across 5 items over 6 days. Most activity clusters around the proposal doc and Figma deck — iterating on pricing framing. Client notes have the most recent writes.",
  },
  {
    id: "2",
    name: "Thread — Query Surface",
    date: "Aug 20",
    confidence: 88,
    active: "1 day running",
    lastActive: "2h ago",
    items: [
      { type: "code", label: "App.tsx" },
      { type: "code", label: "index.css" },
      { type: "tab", label: "fonts.google.com" },
      { type: "tab", label: "Tailwind v4 docs" },
    ],
    excerpt:
      "High capture density — VS Code and 3 browser tabs tightly clustered. App.tsx and index.css account for most writes.",
  },
  {
    id: "3",
    name: "Tax & Finance — 2025",
    date: "Jul 30",
    confidence: 61,
    active: "dormant",
    lastActive: "3 wks ago",
    items: [
      { type: "pdf", label: "Assessment_2025.pdf" },
      { type: "tab", label: "HMRC — Self Assessment" },
      { type: "doc", label: "Expenses_Q3.xlsx" },
    ],
    excerpt:
      "No captures in 21 days. Fading — will decay unless activity resumes. Assessment PDF was the last touched file.",
  },
  {
    id: "4",
    name: "Reading — AI Systems",
    date: "Aug 19",
    confidence: 77,
    active: "2 days running",
    lastActive: "yesterday",
    items: [
      { type: "tab", label: "Attention Is All You Need" },
      { type: "tab", label: "Andrej Karpathy — YouTube" },
      { type: "doc", label: "Notes — Transformers.md" },
    ],
    excerpt:
      "Browser-heavy trail. 6 tabs clustered with no local files. Notes doc had 3 write sessions — active synthesis.",
  },
];

export const FILE_ICON: Record<string, string> = {
  figma: "◈", doc: "□", tab: "⌗", code: "⟨⟩", pdf: "▤", file: "□",
};

export const dotColor = (score: number) =>
  score >= 85 ? "#4ade80" : score >= 65 ? "#facc15" : "#3a3a44";
