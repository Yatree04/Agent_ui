Thread — Complete Product Compilation
Everything decided, designed, and still open, in one place. Working document — meant to be updated as the project moves, not a final artifact.

0. One-line description
Thread is a local agent that watches what you're actively working on — files, browser tabs, screenshots, and anything you deliberately jot down — groups it into AI-inferred "modes," and lets you restore a whole workspace in one click, without ever becoming another version of the self-chat/tab-hoarding problem it's meant to replace.

1. The problem
People have already invented workarounds for the same missing capability — context doesn't survive a break, so they build ad-hoc memory systems by hand:
Self-messaging (WhatsApp "Message Yourself")
Master docs / running notes
Desktop file clutter as informal filing
Keeping tabs open indefinitely because closing = forgetting
Screenshot/link/search hoarding "to refer back to later"
Thread's premise: these aren't separate bad habits, they're the same missing feature, worked around five different ways.

2. Design principles
Silence is the default; speaking is earned. The system should stay quiet unless there's a structural reason to interrupt — never "it might be helpful."
Stay quiet by default, but never at the cost of leaving something unresolved — and never leave a filing decision invisible, even when it was silent. (This supersedes an earlier draft of principle 1 that treated "one tap max" as a hard ceiling — it isn't. Depth is allowed when genuinely needed; the default is what stays shallow.)
Capture should never require a defined context to exist first. Any moment someone wants to put a thought down should work, not just moments inside an already-recognized activity.
Restore the state, not just the files. One-click restore's job is resuming a headspace, not just reopening documents.
Capture should be visible, not covert. Directly answers the trust criticism leveled at always-on-recording tools (Recall's launch backlash, Rewind's privacy concerns).

3. What already exists (landscape, condensed)
No single product combines what Thread combines. Adjacent categories, each solving a piece:
Category
Closest example
What it's missing vs. Thread
Browser-tab workspace switchers
Workona, Toby, Session Buddy, OneTab
Browser-only — no local files, screenshots, or desktop reach
Dev-workflow cross-tool memory
Pieces
Closest structural analog (cross-surface, on-device), but scoped to developer workflow specifically
Passive always-on screen recall
Rewind AI (pivoted to cloud/Limitless), Screenpipe (open-source local alternative), Microsoft Recall
Solves "what did I see" via continuous recording + search, not activity-based grouping + one-click restore; drew real privacy/battery criticism

The actual white space: cross-surface capture (files + tabs + screenshots) + AI-grouped activity-based "modes" + one-click full restore + calendar-as-lens + event-triggered (not always-recording) capture. Confirmed across two separate research passes.

4. Core mechanism decisions
Axis
Decision
Boundary detection
AI-inferred, with manual override (hybrid)
Capture style
Event-triggered, not continuous passive recording
Restore UI
Widget (size/confidence-tiered), not spatial desktops / graph / pure conversational
Architecture
Federated tagging — file watcher + browser extension + quick-capture pop-up, each independently capturing into a shared data model
Calendar
Read-only — both as an overlay lens and a manual day-by-day browsing mechanism; never writes events
Quick-capture interaction
Partially conversational — silent by default, escalates only for genuine continuity ambiguity, never a default chat loop
Who it's for
Individual recall, v1. Collaborative/shared threads are a live open decision (see Section 8), not yet resolved as core or deferred
Build target
Staged demo — real file-watching, real AI grouping, real restore on a live example; volume (weeks of history, multi-device) staged


5. Feature set (full, tiered)
Core (v1)
Local file-watching (already proven — extends the existing file-assistant backend)
Browser tab capture (extension)
Screenshot/link capture, tied to whatever mode is active
Quick-capture side pop-up — direct write/paste, always available, works from either the widget or the extension
Slash-command vocabulary for structured capture at the moment of typing (e.g. /reg for a structured register entry, /mode [name] to attach directly to a mode, /later to flag for resurfacing)
AI-inferred mode grouping with a confidence score
"Why grouped" explanation, shown on demand
One-click restore of a mode's full file/tab set
Manual mode override (start/end/rename/merge/split)
Sensitivity-aware auto-exclusion (banking, password managers, private messages never captured)
Filing history — every capture visibly shows where it was filed, and joins a complete, browsable trail
Widget with confidence/size-tier visual grammar (design still open — see Section 8)
Strong v1 candidates
"Where I left off" handoff summary before a full restore
Decay/fading of dormant modes over time
Visible, persistent capture indicator (trust signal)
Tree-structured search + proactive resurfacing ("here's what you referenced last time")
Calendar as manual day-by-day browsing, in addition to the overlay lens
Nudge-based relevance feedback loop (user corrections train what gets deprioritized)
v2 / deferred (named on purpose, not dropped silently)
Semantic (not just keyword) search across modes
Auto-proposed mode boundaries ("wrap up this mode?")
Cross-device continuity (phone + desktop feeding the same mode)
Spatial-desktop or associative-graph alternate restore views
Open — not yet resolved as core or deferred
Shareable context thread — send a whole mode to someone else, who can download/save it into their own instance. Originally scoped as v2, but raised twice unprompted since — worth a deliberate decision rather than letting it drift back in by default.
Cut (named so it doesn't creep back)
Calendar write access — writing to the calendar turns Thread into a scheduler, a different product
Continuous passive screen/audio recording — the exact mechanism Thread differentiates itself from

6. Interaction models
6.1 Quick-capture pop-up — the settled model
Governing rule: stay quiet by default; escalate only when genuinely needed; never leave something unresolved just to stay quiet; always show where something was filed.
You capture something. A lightweight, visual, immediate acknowledgment appears — status visibility honored, but never a question at this stage.
If confident, files silently and shows the destination inline (small, glanceable label — not a popup demanding attention).
If genuinely unsure which thread this continues, asks — shortest form first (one tap: pick from a short list), but allowed to keep going if that doesn't resolve it. Never gives up and files something unresolved just to avoid a follow-up.
Everything filed — silent or resolved-through-exchange — joins the visible history, always traceable and correctable later.
What this rules out: "how did that go?" follow-ups, unprompted check-ins unrelated to a specific capture, and any interaction that treats conversation as the default rather than the exception.
Worked example:
Type: "pricing came up again with the client, need to check the Q3 numbers before replying"
Immediate: small visual acknowledgment (capture registered), no text yet.
Confident case: files silently under "Client A proposal," shows Filed → Client A proposal inline, stays in history.
Ambiguous case (two live client threads plausible): asks "Client A or Client B?" — one tap. If that's still unresolved, allowed one more short exchange rather than filing a guess.
Either way: destination shown, filing history has the full record of how it was resolved.
6.2 Slash-command vocabulary
Explicit user control over structure at the moment of capture, rather than relying purely on inferred structure after the fact:
/reg — structured register entry
/mode [name] — attach directly to a named mode
/later — flag for resurfacing, ties into calendar day-browsing
Small vocabulary on purpose — 3–5 commands, not a full command language.
6.3 Filing transparency
Every filing decision (silent or escalated) shows its destination immediately and is permanently part of a browsable history. This is what makes the "mostly silent" default trustworthy rather than opaque — silence is only safe because there's always a record to check.
6.4 Calendar — dual role, both read-only
Overlay lens: modes shown color-coded against the calendar timeline
Manual browsing: pick any past day, see everything captured that day regardless of mode
6.5 Search — two distinct mechanisms, not one
Widget restore: brings back a whole mode
Tree search: finds one specific thing, inside or across modes, with proactive resurfacing of previously referenced material

7. System design (condensed — full detail in the backend doc)
Scoped-down build target: widget and browser extension each work independently, both reading/writing the same local SQLite file — no live IPC bridge required for the demo. This is a deliberate, honest simplification, not a hidden gap (see the demo narration note below).
Core data model:
captures — raw entries, source-tagged (file/browser_tab/quickcapture_text/screenshot), linked to a thread once resolved
threads — the "modes," with status and confidence
filing_history — the audit trail (resolution type: silent / one-tap / escalated) that makes filing transparency real, not just a UI claim
tags — structured entries from the slash-command vocabulary
What's genuinely new engineering (deferred past the demo): the IPC layer that would let the extension and widget talk live (local WebSocket server is the realistic option, over Chrome's native messaging), and real semantic search (embeddings + a local vector index) — both scoped as post-demo work, not required to prove the concept.
What's already proven: file-watching, tray-icon/widget presence, SQLite storage, Anthropic API calls — all extend directly from the existing file-assistant project rather than starting fresh.

8. Open decisions still on the table
Worth resolving these deliberately rather than letting the project drift past them:
Shareable context thread — core v1 or genuinely deferred? (Section 5)
Widget/pop-up UI framework — extend the existing tray-app framework, or rebuild the frontend for Thread?
Visual/confidence grammar — color, shape, and motion at each confidence level and widget size tier. Referenced constantly, not yet designed as an actual system.
"Why grouped" copy — what it actually says, and where it lives (inline under the mode name vs. tap-to-expand).
Manual override flows — what starting/merging/splitting a mode actually looks like as a UI flow, not just a listed capability.
Sensitivity auto-exclusion UX — how a user knows something was excluded, versus it just silently never appearing.
The four earlier interaction surfaces — floating card, command overlay, side panel, right-click menu — the actual reasoning for why each was dropped, needed for the case study's iteration section and only reconstructable by you.
Staged demo script — the specific real work session to use live, not yet chosen or rehearsed.

9. Case study structure (for presentation)
I. Context & Problem → II. Research → Design Principles → III. Ideation & Iteration (the four dropped surfaces + the mechanism-level ideation — explicit sessions vs. AI-inferred, continuous vs. event-triggered, widget vs. spatial/graph/conversational) → IV. Feature Scoping (tiered, with cuts named and justified) → V. Prototype & Staged Demo → VI. Reflection (deferred v2 ideas + the honest unsolved part: cross-surface identity/inference accuracy at production quality)
Demo framing: "Here's the desktop side, fully working, built on real file-watching. Here's the browser extension, independently proving it captures the same way. They're built on the same data model — wiring them together live is the next step, not a gap in the concept."

Where I'd suggest picking this back up
Items 3–5 in Section 8 (visual grammar, "why grouped" copy, override flows) are the most design-heavy remaining gaps and the ones I can help build out directly with you. Item 7 is the one only you can do. Which do you want to work on first?

