# Mantle Forge — Brand System

> Branding document for hackathon use: logo, landing page, README, docs, pitch deck, demo video, and DoraHacks submission.  
> Selected direction: **Option A — Forge Glyph**.  
> **Positioning (2026-06):** multi-agent execution layer; Hermes = flagship demo with on-chain proof.

---

## 1. Brand Core

| Element | Definition |
|---|---|
| **Project name** | Mantle Forge |
| **Full name** | Mantle Forge (optional subtitle: *for coding agents*) |
| **Category** | AI DevTool / Web3 Developer Tool |
| **Primary audience** | Smart contract developers, hackathon judges, Mantle ecosystem builders |
| **Core idea** | Mantle-native execution layer for coding agents — skills + CLI tools + workflows |
| **Main promise** | One prompt triggers a full Mantle workflow: build, harden, deploy, report — on any supported agent |
| **Flagship demo** | Hermes Desktop (verified Mantle Sepolia deploys) |
| **Brand personality** | Precise, technical, modular, autonomous, developer-native |
| **Visual direction** | Dark developer-tool interface + pixel forge glyph + terminal aesthetics |

---

## 2. Strategic Positioning

Mantle Forge should not be positioned as a generic AI chatbot.

That would be weak.

It should be positioned as a **Mantle-native execution layer for coding agents**: skills, deterministic CLI tools, templates, and workflows that let Hermes, Cursor, Codex, Claude Code, OpenClaw, or OpenCode ship smart contract projects on Mantle.

### Positioning Statement

**Mantle Forge gives coding agents a Mantle-native execution layer — scaffold, test, harden, deploy, and report smart contract projects from a single natural-language request. Hermes is the flagship demo with verified on-chain proof.**

### Short Positioning

**Mantle execution layer for coding agents.**

### Developer-Facing Positioning

**A Mantle-native toolkit (skills + CLI tools + plugins) that gives any supported coding agent the workflows and context to build, harden, deploy, and document smart contract projects.**

---

## 3. Tagline System

### Primary Tagline

**Build. Harden. Deploy. On Mantle.**

This is the strongest tagline. It is direct, technical, and easy to remember.

### Secondary Tagline

**Mantle execution layer for coding agents.**

### Short One-Liners

- **One prompt. Full Mantle dev loop.**
- **From prompt to verified deployment.**
- **Code in. Deployment out.**
- **One toolkit. Six runtimes.**
- **Scaffold, secure, deploy, report.**

### Submission-Friendly One-Liner

**Mantle Forge is a Mantle-native execution layer for coding agents — scaffold, test, harden, deploy to Mantle Sepolia, and generate engineering reports from a single prompt.**

### Hermes-Specific (demo video / flagship only)

**Turn Hermes into an autonomous Mantle development agent.** Use when showing the verified Hermes Desktop demo, not as the primary product name.

---

## 4. Brand Narrative

Developers do not need another AI assistant that only explains code.

They need an agent that can execute.

Mantle Forge packages Mantle-specific knowledge, Hardhat templates, security workflows, deployment tools, and reporting structure so coding agents can operate like real Mantle developers — not just suggest code.

The result is a practical AI DevTool that moves from idea to deployment:

```text
Prompt → Scaffold → Test → Harden → Deploy → Report
```

This narrative should be repeated everywhere: README, landing page, pitch deck, demo, and final submission.

---

## 5. Logo Direction

### Selected Logo Concept

**Forge Glyph** ✓ (confirmed)

The chosen direction uses a pixel-style forge symbol:

- **Green anvil / forge base** = Mantle, engineering, stability
- **Amber flame** = execution, energy, creation
- **Cyan sparks** = AI, signal, agent automation
- **Pixel geometry** = modular tooling, developer DNA, programmable workflows

### Logo Assets Produced

| Variant | Status |
|---|---|
| Primary horizontal lockup (glyph + "MANTLE FORGE"; legacy "for Hermes" subtitle) | ✓ Done — prefer glyph-only or "for coding agents" in new assets |
| App icon / GitHub avatar (glyph on rounded square, green glow) | ✓ Done |
| Monochrome version (white outline only) | ✓ Done |
| Color palette swatch reference | ✓ Done |
| Favicon simplified version | Pending |
| OG / social preview image | Pending |

### Logo Usage Rules

- Use the full-color icon on dark backgrounds.
- Use the monochrome version when the background is noisy.
- Do not overuse glow effects.
- Do not add extra colors beyond the defined palette.
- Do not stretch, rotate, or distort the glyph.
- Do not put the logo over heavy gradients or busy images.
- Keep enough breathing room around the symbol.

### Favicon Note

At 16–32 px the full glyph loses detail. Use a simplified version: flame only, or single green block with amber top. To be created separately.

### Minimum Sizes

| Version | Minimum recommended size |
|---|---|
| Full lockup with "for Hermes" | 180 px wide |
| Lockup without descriptor | 120 px wide |
| Icon only | 32 px |
| Favicon | 16–32 px simplified version |

---

## 6. Color Palette

The color system should stay restrained. The goal is not "rainbow tech." The goal is **dark, sharp, developer-native**, with green as the main brand signal.

### Primary Colors

| Token | Hex | Name | Usage |
|---|---:|---|---|
| `--color-bg` | `#0A0A0A` | Void Black | Main background |
| `--color-surface` | `#111111` | Carbon | Cards, nav, elevated UI |
| `--color-primary` | `#00D395` | Mantle Green | Primary brand color, logo base, links, active states |
| `--color-accent` | `#F59E0B` | Forge Amber | Flame, execution highlights, CTAs |
| `--color-text` | `#F5F5F5` | Cloud White | Primary text |
| `--color-signal` | `#22D3EE` | Signal Cyan | AI agents, signal, sparks, secondary accents |

### Secondary Colors

| Token | Hex | Name | Usage |
|---|---:|---|---|
| `--color-primary-dark` | `#00A873` | Mantle Deep | Hover states, borders |
| `--color-danger` | `#EF4444` | Heat Red | Warnings, security alerts |
| `--color-border` | `#2A2A2A` | Slate Border | Borders, dividers |
| `--color-text-muted` | `#A3A3A3` | Muted Text | Body text, captions |
| `--color-text-dim` | `#525252` | Dim Text | Metadata, inactive text |
| `--color-elevated` | `#1A1A1A` | Graphite | Elevated cards, code blocks |

### Recommended Color Proportion

```text
55% Void Black / Carbon
20% Cloud White
15% Mantle Green
7% Forge Amber
3% Signal Cyan
```

This avoids the brand becoming too colorful or childish.

---

## 7. Typography

### Font Stack

| Role | Font | Why |
|---|---|---|
| **Display / headings** | JetBrains Mono | Developer-native, terminal feel, technical |
| **Body / UI** | Inter | Clean, readable, professional |
| **Code / terminal** | JetBrains Mono | Consistent with devtool identity |

### Typography Rules

- Use **JetBrains Mono ExtraBold** for hero headings.
- Use **Inter** for paragraphs and longer explanations.
- Use uppercase sparingly. It works for labels, not for every sentence.
- Keep line lengths short in landing and README sections.
- Use monospace for commands, reports, terminal snippets, and workflow labels.

### Suggested Scale

| Type | Size | Weight | Usage |
|---|---:|---:|---|
| Display XL | 64–72 px | 800 | Hero title |
| Display L | 48 px | 800 | Section hero |
| H1 | 36–40 px | 700 | Page title |
| H2 | 28–32 px | 700 | Major sections |
| H3 | 20–24 px | 600 | Cards |
| Body | 16 px | 400 | Paragraphs |
| Small | 14 px | 400 | Metadata |
| Code | 13–14 px | 400 | Terminal/code |

---

## 8. Visual Language

### Core Visual Elements

| Element | Meaning | Usage |
|---|---|---|
| **Pixel forge glyph** | Building, hardening, execution | Logo, favicon, badges |
| **Dot grid** | Technical environment, data, code space | Background texture |
| **Terminal lines** | CLI-native workflow | Hero, docs, demo section |
| **Thin dividers** | Precision, structure | Section separation |
| **Dark cards** | Tool modules | Features, docs, architecture |
| **Small colored sparks** | AI execution / agent signal | Around logo, CTA, terminal snippets |

### Design Keywords

- Dark
- Modular
- Terminal-native
- High-contrast
- Pixel-inspired
- Sharp
- Practical
- Developer-first
- Not playful
- Not corporate-generic

### Avoid

- Overdone gradients
- Cartoon flames
- Mascots
- Blobs
- Generic SaaS illustrations
- Too many colors
- Web3 casino vibes
- Hype-heavy AI visuals

---

## 9. UI System

### Backgrounds

```css
--color-bg: #0A0A0A;
--color-surface: #111111;
--color-elevated: #1A1A1A;
```

### Cards

```css
.card {
  background: #111111;
  border: 1px solid #2A2A2A;
  border-radius: 6px;
}

.card:hover {
  border-color: #00D395;
}
```

### Primary Button

Use for the main action: install, run demo, view repo.

```css
.button-primary {
  background: #00D395;
  color: #0A0A0A;
  border-radius: 4px;
  font-weight: 700;
}
```

### Secondary Button

Use for docs, architecture, demo video.

```css
.button-secondary {
  background: transparent;
  color: #00D395;
  border: 1px solid #00D395;
  border-radius: 4px;
}
```

### Amber Button / Highlight

Use sparingly for "Run Forge" or "Deploy".

```css
.button-accent {
  background: #F59E0B;
  color: #0A0A0A;
  border-radius: 4px;
  font-weight: 700;
}
```

### Terminal Snippet

```text
$ npm install && npm run plugin:cursor

✓ Mantle Forge plugin installed (13 tools · 24 skills)
✓ Scaffolded Mantle project
✓ Ran security review
✓ Deployed to Mantle Sepolia
✓ Generated FINAL_REPORT.md
```

### Install CTAs (one line per runtime)

```bash
npm install && npm run plugin:hermes     # Hermes (WSL on Windows)
npm install && npm run plugin:cursor     # Cursor
npm install && npm run plugin:codex      # Codex
npm install && npm run plugin:claude     # Claude Code
npm install && npm run plugin:openclaw   # OpenClaw
npm install && npm run plugin:opencode   # OpenCode
```

Verify: `npm run plugin:verify`. Docs: `docs/plugins/`.

---

## 10. Icon System

### Recommended Icon Meanings

| Concept | Icon |
|---|---|
| Build | Blocks / scaffold / code brackets |
| Harden | Shield |
| Deploy | Cube / arrow / node |
| Report | File / document / check |
| Coding agent | Signal / wing / relay |
| Hermes (flagship) | Wing / relay — demo only |
| Mantle | Green block / chain node |
| Security | Shield / lock |
| Gas | Gauge / flame |
| Verification | Check / explorer link |

### Icon Style

- Use line icons or simple geometric icons.
- Stroke width should be consistent.
- Use green for primary icons.
- Use amber only for execution or warning.
- Use cyan for AI / agent / relay concepts.

---

## 11. Copywriting Rules

### Write Like This

- Direct
- Specific
- Action-oriented
- Technical but readable
- No fluff
- No exaggerated claims

### Preferred Vocabulary

Use:

- autonomous development agent
- Mantle-native
- tool layer
- workflow
- scaffold
- harden
- deploy
- report
- verifiable
- production-ready
- security review
- agent-assisted engineering
- executable workflow

Avoid:

- chatbot
- magical
- revolutionary
- effortless
- game-changing
- next-gen
- AI-powered everything

---

## 12. Core Messaging Blocks

### Hero Copy

```text
Build. Harden. Deploy. On Mantle.

Mantle-native skills and CLI tools for any coding agent.
Scaffold projects, run security checks, deploy contracts, and generate engineering reports from one prompt.
```

### Short Hero Version

```text
One prompt. Full Mantle dev loop.

Build → Harden → Deploy → Report
```

### README Intro

```markdown
# Mantle Forge

**Build. Harden. Deploy. On Mantle.**

Mantle-native engineering toolkit for coding agents. Skills, CLI tools, and workflows for scaffold, test, harden, deploy, and report on Mantle Sepolia.
```

### DoraHacks Submission One-Liner

```text
Mantle Forge is a Mantle-native execution layer for coding agents — scaffold, test, harden, deploy to Mantle Sepolia, and report from a single prompt. Hermes flagship demo with verified on-chain proof.
```

### Demo Video Opening

```text
Most AI coding tools stop at suggestions.

Mantle Forge goes further: skills and deterministic CLI tools that let your agent execute the full Mantle workflow — scaffold, harden, deploy, and report.
```

---

## 13. Landing Page Direction

### Hero Section

**Headline**

```text
Build. Harden. Deploy. On Mantle.
```

**Subheadline**

```text
Mantle-native skills and CLI tools for any coding agent — one toolkit, six runtimes.
```

**CTA Buttons**

- View Demo
- Read Docs
- GitHub Repo

**Hero Visual**

Use:
- Forge Glyph logo
- terminal snippet
- pixel sparks
- dark dot-grid background

---

### Section 1 — Problem

```text
AI coding assistants can explain code, but they do not ship complete Mantle workflows by default.
Developers still need to configure networks, scaffold contracts, run tests, review risks, deploy, verify, and document the result manually.
```

---

### Section 2 — Solution

```text
Mantle Forge packages Mantle-specific tools, templates, workflows, and context so coding agents can operate as Mantle developers — not just explain code.
```

---

### Section 3 — Workflow

```text
Prompt → Scaffold → Test → Harden → Deploy → Report
```

---

### Section 4 — Features

| Feature | Description |
|---|---|
| **Mantle Project Scaffolding** | Generate Mantle-ready Hardhat projects and templates |
| **Security Review** | Run agent-assisted hardening and contract checks |
| **Deployment Workflow** | Deploy to Mantle Sepolia or mainnet with configured scripts |
| **Engineering Reports** | Generate final reports with artifacts, checks, and deployment details |
| **Skill Pack** | 7 specialized skills for Mantle development workflows |
| **Multi-vendor plugins** | One-line install: Hermes, Cursor, Codex, Claude, OpenClaw, OpenCode (`npm run plugin:<vendor>`) |
| **Supported Agents strip** | Homepage grid: one toolkit, six runtimes |

---

### Section 5 — Demo Prompt

```text
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

---

### Section 6 — Why Mantle

```text
Mantle Forge contributes to the Mantle ecosystem by making it easier for developers and agents to build, test, deploy, and document production-ready smart contract workflows on Mantle.
```

---

## 14. README Structure

Recommended README order:

```markdown
# Mantle Forge

Badges

## Quickstart (per-runtime links)

## How it works

## Installation (Hermes · Cursor · Codex · Claude · OpenClaw · OpenCode)

## The Mantle workflow

## What's inside

## Philosophy

## Repository layout

## Hackathon submission

## License
```

Follow [Superpowers README](https://github.com/obra/superpowers) order: quickstart links → how it works → per-harness install → workflow → what's inside.

### Badge Set

```markdown
![Mantle](https://img.shields.io/badge/Mantle-Native-00D395?style=for-the-badge)
![Agents](https://img.shields.io/badge/Agents-6_Runtimes-22D3EE?style=for-the-badge)
![Hardhat](https://img.shields.io/badge/Hardhat-Toolkit-F59E0B?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-MIT-F5F5F5?style=for-the-badge)
![AI DevTool](https://img.shields.io/badge/AI-DevTool-00D395?style=for-the-badge)
```

---

## 15. Pitch Deck Direction

### Slide 1 — Cover

```text
Mantle Forge
Build. Harden. Deploy. On Mantle.
Mantle execution layer for coding agents.
```

Visual: full logo, dark background, pixel sparks, no clutter.

### Slide 2 — Problem

```text
AI coding tools suggest.
Developers still execute.
```

Key point: developers still manually handle project setup, chain config, tests, security checks, deployment, verification, and reporting.

### Slide 3 — Solution

```text
Mantle Forge gives coding agents a Mantle-native execution layer.
One toolkit. Six runtimes. Hermes flagship demo with on-chain proof.
```

### Slide 4 — Workflow

```text
Prompt → Scaffold → Test → Harden → Deploy → Report
```

### Slide 5 — Architecture

```text
Coding Agent (Hermes · Cursor · Codex · Claude · OpenClaw · OpenCode)
  ↓
Mantle Forge Plugins (skills + commands + hooks; Hermes native tools)
  ↓
CLI Tools (mantle-scaffold … mantle-report) + Templates
  ↓
Hardhat + Mantle Sepolia
  ↓
Deployment + FINAL_REPORT.md
```

### Slide 6 — Demo

Show real run: prompt → generated project → test/security output → deployment tx → final report.

### Slide 7 — Why It Matters

```text
Mantle Forge makes Mantle easier to build on — not only for humans, but for autonomous AI development agents.
```

### Slide 8 — Closing

```text
One prompt.
One Mantle workflow.
One verified report.
```

---

## 16. Hackathon Alignment

### Technical Depth

Emphasize AI × on-chain integration, real architecture, code quality, toolchain completeness.

### Innovation

Emphasize: not another generic AI assistant — an agent execution layer for Mantle; reusable AI DevTool pattern.

### Mantle Ecosystem Contribution

Emphasize: Mantle-native templates, Mantle deployment support, Mantle dev onboarding, long-term ecosystem tooling.

### Product Completeness

Emphasize: runnable demo, open-source repo, working docs, deployment artifacts, generated reports.

### UI/UX

Emphasize: clear flow, readable demo, visual consistency, beginner-friendly explanation without dumbing it down.

---

## 17. Social / Community Messaging

### X Post

```text
Introducing Mantle Forge.

Build. Harden. Deploy. On Mantle.

A Mantle-native execution layer for coding agents — Hermes, Cursor, Codex, Claude, OpenClaw, OpenCode.

Prompt → Scaffold → Test → Harden → Deploy → Report
```

### Shorter X Post

```text
Mantle Forge — Mantle execution layer for coding agents.

One prompt:
Build → Harden → Deploy → Report

Flagship demo on Hermes Desktop with verified Sepolia deploy.
```

### Hermes demo post (flagship proof)

```text
Mantle Forge on Hermes Desktop: one prompt → TokenVault deployed on Mantle Sepolia.

Same skills + CLI tools work in Cursor, Codex, Claude, OpenClaw, and OpenCode.
```

### Community Voting Angle

```text
Most AI coding tools only suggest what to do.

Mantle Forge helps an agent actually execute the Mantle development workflow: create the project, run checks, deploy it, and generate a report.
```

---

## 18. Asset Checklist

### Logo Assets

- [x] Primary horizontal logo (glyph + "MANTLE FORGE"; legacy "for Hermes" subtitle)
- [ ] Updated lockup without Hermes-only subtitle
- [x] App icon / GitHub avatar (rounded square, green glow)
- [x] Monochrome icon (white outline)
- [x] Color palette swatch reference
- [ ] Favicon 16×16 simplified
- [ ] Favicon 32×32
- [ ] OG / social preview image (1200×630)

### Product Assets

- [ ] Landing hero image
- [ ] Terminal demo mock
- [ ] Workflow diagram
- [ ] Architecture diagram
- [ ] Final report screenshot
- [ ] Deployment proof screenshot
- [ ] Demo video thumbnail

### Documentation Assets

- [x] README header (ASCII banner + badges)
- [ ] Docs navbar logo (SVG)
- [x] Docusaurus theme CSS
- [x] Badge set
- [ ] Submission cover image

---

## 19. CSS Design Tokens

```css
:root {
  /* Brand */
  --color-bg: #0A0A0A;
  --color-surface: #111111;
  --color-elevated: #1A1A1A;

  --color-primary: #00D395;
  --color-primary-dark: #00A873;
  --color-accent: #F59E0B;
  --color-signal: #22D3EE;
  --color-danger: #EF4444;

  --color-text: #F5F5F5;
  --color-text-muted: #A3A3A3;
  --color-text-dim: #525252;
  --color-border: #2A2A2A;

  /* Typography */
  --font-display: "JetBrains Mono", "Courier New", monospace;
  --font-body: "Inter", system-ui, sans-serif;
}
```

---

## 20. Final Brand Summary

| Element | Value |
|---|---|
| **Brand Name** | Mantle Forge |
| **Full Name** | Mantle Forge (for coding agents) |
| **Primary Tagline** | Build. Harden. Deploy. On Mantle. |
| **Secondary Tagline** | Mantle execution layer for coding agents. |
| **One-Liner** | One prompt. Full Mantle dev loop. |
| **Flagship demo** | Hermes Desktop + verified Mantle Sepolia deploy |
| **Runtimes** | Hermes · Cursor · Codex · Claude · OpenClaw · OpenCode |
| **Visual Identity** | Dark developer-tool system · pixel forge glyph · terminal aesthetics · Mantle green / forge amber / signal cyan |
| **Brand Personality** | Precise · Modular · Developer-native · Autonomous |
| **Core Flow** | Prompt → Scaffold → Test → Harden → Deploy → Report |
| **Logo** | Pixel anvil + amber flame + cyan sparks · confirmed ✓ |

### What to Remember

Mantle Forge should look and sound like a tool that actually ships.

Not a chatbot. Not a generic AI wrapper. Not a hackathon toy.

**A Mantle-native execution layer for coding agents — not another runtime.**
