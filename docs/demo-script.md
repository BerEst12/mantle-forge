# Demo script — Mantle Forge (Turing Test Hackathon 2026 · AI DevTools)

> **Record Part 1 in English.** Part 2 is the full Spanish reference so you know exactly what you're saying.
> Target: **5–7 min** after editing. Paste the final URL in [`SUBMISSION.md`](./SUBMISSION.md).

| Part | Use |
|------|-----|
| **Part 1 — English** | The script you record |
| **Part 2 — Español** | Referencia completa para entender y ensayar |

---

# Why this script wins (read before recording)

The track description is one sentence: **"Smart gas optimization and Mantle-specific audit assistants."** The judging signals from the hackathon brief, in order of weight: **real utility, technical execution, autonomous behavior, on-chain activity, Mantle integration, measurable results**. Weak submissions are chat-only wrappers; strong ones are *operational infrastructure*.

This script is engineered against those signals:

| Judging signal | Where the script delivers |
|----------------|---------------------------|
| Real execution (not chat) | Act 2 verify · Act 3 live tool streaming · Act 7 artifacts |
| **Autonomous behavior** | The narrative device: prompt fired in Act 3, agent finishes **unattended** by Act 7 |
| Mantle-specific audit | Act 7 `reports/security.md` + Act 5 Tencent Hunyuan deep audit |
| Smart gas tooling | Act 7 `reports/gas.md` with real numbers |
| On-chain activity | 4 verified Sepolia deployments; Mantlescan verified source |
| Measurable results | Act 8 metrics card — counts, gas figures, zero high/critical |
| Mantle ecosystem | DeFi skills (TVL, Merchant Moe, Mantlescan) in Act 6 Discord |
| Partner integration | **Tencent Cloud** (official hackathon partner): Hunyuan audit + COS publishing — Act 5 |
| Business potential (Grand Champion) | One line in the close: open core + premium templates/skill packs |
| UX / onboarding ($3k UI/UX award) | One-line install per runtime, `plugin:verify` green checks |

**The framing that wins:** not "an AI assistant for developers" — **"operational infrastructure for autonomous blockchain development."** The hackathon is literally named the Turing Test: the test for a coding agent is not writing Solidity. It's **shipping it**. Say that sentence on camera; it's the thesis of the whole event.

---

## Narrative order

```text
Cold open (verified contract — result first) → Thesis (the gap)
→ Install + verify (reproducible) → FIRE THE PROMPT, leave it running (autonomy)
→ Portability (6 runtimes) → Inside the layer (26 skills · 15 CLIs)
→ Tencent Cloud (partner depth) → Discord + Telegram (team surfaces)
→ Return to the run: it finished alone (climax) → Metrics card → Close
```

The cold open shows the **outcome** before any explanation — judges decide in the first 30 seconds whether this is real. Firing the flagship prompt early and returning to it finished is the single most persuasive autonomy proof available: the agent worked while nobody watched.

---

## Hackathon must-haves checklist

Every item must appear **on screen** in the final cut:

| Requirement (AI DevTools) | Where |
|---------------------------|-------|
| Mantle-specific security / audit | Act 7 — `reports/security.md` · Act 5 — `tencent-audit.md` |
| Gas optimization / analysis | Act 7 — `reports/gas.md` |
| Real execution (not chat-only) | Act 2 `plugin:verify` · Act 3 tool streaming |
| Tests passing | Act 7 — Hardhat output |
| Mantle Sepolia deploy | Act 7 — Mantlescan + `deployments/mantleSepolia.json` |
| Mantle ecosystem | Act 6 — Discord DeFi skills; docs Skills page |
| Multi-runtime | Act 4 |
| Partner integration | Act 5 — Tencent Cloud Hunyuan + COS |
| Engineering deliverable | Act 7 — `FINAL_REPORT.md` |
| Measurable outcomes | Act 8 — metrics card |

---

# Part 1 — English (record this)

**Audience:** DoraHacks judges (technical + business mix)
**Tone:** Confident, concrete, zero filler. Every sentence earns its seconds.
**Environment:** Hermes Desktop (Windows) + WSL terminal + browser + phone
**Edit note:** Record raw, cut in post. P1/P2/P3 tags mark what survives a 5-minute cut.

---

## Act 0 — Cold open: show the result first (~0:25)

**On screen:** Mantlescan, verified TokenVault — contract tab open on the green "Contract Source Code Verified" check:
[`0x64D825eDcE57d56365bEb026CEAe4D2D439f7874`](https://sepolia.mantlescan.xyz/address/0x64D825eDcE57d56365bEb026CEAe4D2D439f7874)

Slow scroll: verified source → transactions tab.

**Say:**

> "This is a verified smart contract, live on Mantle Sepolia. It was scaffolded, tested, security-reviewed, gas-optimized, deployed, and verified — by a coding agent. From **one sentence**. No human touched the pipeline.
> This hackathon is called the Turing Test. Here's ours: the real test for a coding agent isn't writing Solidity — it's **shipping it**. Let me rewind and show you how this contract happened."

---

## Act 1 — Thesis: the gap (~0:30)

**On screen:** Quick split or cuts: an AI chat suggesting Solidity ↔ a terminal graveyard of manual steps (hardhat init, test, slither, deploy scripts).

**Say:**

> "I'm **[YOUR NAME]**. Here's the gap: AI coding tools are great at *suggesting* Solidity. But suggestions don't ship. Mantle teams still scaffold projects, wire Hardhat configs, run tests, do security review, profile gas, deploy, and verify — by hand, across disconnected tools. And an agent alone can't do that reliably: it improvises, it hallucinates configs, it has no Mantle context.
> **Mantle Forge** closes the gap. It's not another agent runtime — it's the **execution layer** that turns the coding agent you already use into a Mantle engineer: 26 Mantle-native skills that tell the agent *how*, and 15 deterministic CLI tools that do the verifiable work. Hermes, Cursor, Codex, Claude Code, OpenClaw, OpenCode — one-line install each, plus Discord and Telegram for your team."

---

## Act 2 — Install + verify: reproducible in 30 seconds (~0:30) · **P1**

**On screen — WSL terminal, font 14+:**

```bash
git clone https://github.com/BerEst12/mantle-forge.git
cd mantle-forge
npm install
npm run plugin:hermes
npm run plugin:verify
# → ALL CHECKS PASSED
```

Hold 2 s on the green `ALL CHECKS PASSED`. Then one flash:

```bash
npx mantle-scaffold --help
```

**Say:**

> "Reproducibility first. Clone, one-line plugin install, verify. `plugin:verify` checks the bundle structure, smoke-tests every CLI, and confirms the Hermes wiring. Judges can run this exact sequence in under two minutes. These CLIs are real binaries — nothing here is mocked."

**Edit:** speed `npm install` 8–16×; never cut the verify output.

---

## Act 3 — Fire the prompt. Walk away. (~0:35) · **P1 — the autonomy device**

**On screen:** Hermes Desktop, fresh session. Paste the flagship prompt. Show the first tool calls streaming: `mantle_scaffold`, `mantle_check`…

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

**Say:**

> "Now the actual test. One sentence: build a token vault, test it, audit it, optimize gas, deploy to Mantle Sepolia, write the engineering report.
> I'm sending it — and I'm going to **walk away**. No babysitting, no follow-up prompts. While the agent works, let me show you what's underneath. We'll come back when it's done."

**Why this works:** every other demo shows an agent being supervised. Yours runs unattended for four minutes of video — that *is* autonomous behavior, demonstrated rather than claimed.

**Recording note:** capture the full run; in post, you'll cut back to its finished state in Act 7. Picture-in-picture corner of the running session during Acts 4–6 is a strong optional touch.

---

## Act 4 — Portability: six runtimes, one layer (~0:25) · **P2**

**On screen — fast cuts, ~6 s each:**

1. Cursor → Agent panel, Mantle Forge skills visible
2. Claude Code TUI → `mantle-*` skills listed
3. Docs runtime table: <https://mantle-forge.vercel.app/docs/plugins>

```bash
npm run plugin:cursor
npm run plugin:claude
npm run plugin:codex     # + openclaw, opencode
```

**Say:**

> "This isn't a Hermes feature — it's a layer. Same skills, same CLIs, installed into Cursor, Claude Code, Codex, OpenClaw, or OpenCode with one command each. You don't switch agents to build on Mantle. Your agent learns Mantle."

---

## Act 5 — Inside the layer + Tencent Cloud (~0:55) · **P1**

### 5a — Anatomy (~25 s)

**On screen:** editor sidebar expanding `plugins/mantle-forge/`, then docs Skills page scroll: <https://mantle-forge.vercel.app/docs/skills>

```text
plugins/mantle-forge/
├── skills/          # 26 mantle-* skills
├── commands/        # flagship workflow
├── rules/           # Mantle conventions
└── hooks/           # env checks on session start
```

**Say:**

> "Under the hood: **26 Mantle-native skills** and **15 deterministic CLIs**, synced from one source of truth.
> Seven engineering skills run the flagship pipeline — scaffold, Hardhat config, tests, security review, gas analysis, Sepolia deploy, report.
> Seventeen DeFi data skills cover the ecosystem — prices, TVL, Merchant Moe pools and swap quotes, Mantlescan lookups, wallet overviews. All verified against live endpoints."

### 5b — Tencent Cloud: partner integration with teeth (~30 s)

**On screen:** terminal running the audit, then the report and COS URLs:

```bash
npx mantle-tencent-audit ./my-vault --out reports/tencent-audit.md
npx mantle-cos-upload ./my-vault --out reports/cos-upload.md
```

Show `reports/tencent-audit.md` findings scroll, then the COS public URLs from `cos-upload.md` opening in a browser.

**Say:**

> "And two skills integrate **Tencent Cloud** — an infrastructure partner of this hackathon — as working tooling, not a logo.
> `mantle-tencent-audit` sends the contracts to the **Hunyuan** model for a deep second-opinion security audit with Mantle L2-specific checks — a different model class than the coding agent, so it catches different things.
> `mantle-cos-upload` publishes every pipeline artifact — reports, deployment JSON, the final report — to Tencent Cloud Object Storage with public URLs. Anyone, including you, can verify our claims without cloning anything."

---

## Act 6 — Where teams live: Discord + Telegram (~0:50) · **P2**

### 6a — Discord: ecosystem + creative (~30 s)

**On screen:** Discord channel. Paste Prompt A; show bot replies and the landing preview URL with live Mantle data.

```txt
Build and deploy a Mantle ecosystem landing page. Include live or fetched data:
MNT price, Mantle TVL, top Merchant Moe pools, mETH info, official links
(docs, explorer, bridge), and a clear CTA to install Mantle Forge from GitHub.
Use whatever stack fits — ship a preview URL.
```

Quick second beat — Prompt B and the bot's data answer:

```txt
What's the current Mantle TVL breakdown and the best MNT/USDC pool on Merchant Moe?
```

**Say:**

> "Teams live in Discord — so Mantle Forge does too. Ask for a full ecosystem landing page: the agent pulls the DeFi skills and ships a working frontend with real Mantle data and a preview URL. Or just ask — TVL breakdowns, Merchant Moe pools, straight in chat."

### 6b — Telegram: the pipeline in your pocket (~20 s)

**On screen — phone:** Telegram. Send `/forge MyToken`; capture the status message updating per step: 🏗 scaffold → 🔒 audit → ⛽ gas → 🚀 deploy → 📄 report.

**Say:**

> "Telegram does a different job: mobile ops. One command — the **entire** pipeline runs from your phone. Same CLIs, same artifacts."

---

## Act 7 — Climax: the run finished. Alone. (~1:20) · **P1 — this wins the track**

**On screen:** cut back to the Hermes session from Act 3 — completed, full tool-call history visible.

**Say (transition):**

> "Remember the prompt from four minutes ago? While we toured the stack, the agent **finished**. Nobody touched it. Here's what one sentence produced."

### Montage beats (~10 s each — quick cuts)

| Beat | Say (one line) | On screen |
|------|----------------|-----------|
| Scaffold | "A real Hardhat project — `mantle-scaffold`, token-vault template, Mantle Sepolia pre-configured." | `contracts/TokenVault.sol`, `hardhat.config.ts` |
| Tests | "Tests green before anything ships — deposit, withdraw, overdraft guards, fee-on-transfer rejection." | Hardhat output — all passing |
| Security | "Agent-assisted security review: zero high or critical findings open. Plus the Hunyuan deep audit as a second opinion." | `reports/security.md` scroll |
| Gas | "Gas profiled per method — deposit around 79k, withdraw 65k — with Mantle-specific optimization notes." | `reports/gas.md` |
| Deploy | "Deployed to Mantle Sepolia, chainId 5003 — address, tx hash, explorer links captured in JSON." | deploy output + `deployments/mantleSepolia.json` |
| Verify | "Source verified on Mantlescan — anyone can read exactly what's on chain." | [Mantlescan](https://sepolia.mantlescan.xyz/address/0x64D825eDcE57d56365bEb026CEAe4D2D439f7874) — verified code tab |
| Report | "And the deliverable a real team needs: `FINAL_REPORT.md` — tests, findings, gas, deployment, next steps." | `FINAL_REPORT.md` scroll |

**Say (over the last beat):**

> "That's the track, on screen: Mantle-specific audit assistance, smart gas tooling, real autonomous execution, on-chain proof. One sentence in — a verified contract and an engineering report out."

**Live-run note:** if the live run mints a new address, show it and keep [`0x64D8…f874`](https://sepolia.mantlescan.xyz/address/0x64D825eDcE57d56365bEb026CEAe4D2D439f7874) (verified E2E, 2026-06-07) as the fallback from [`examples/demo-runs/`](../examples/demo-runs/).
**Secrets:** never show `.env`, private keys, or API keys on screen.

---

## Act 8 — The numbers + close (~0:35) · **P1**

**On screen:** static metrics card (build in your editor — big type on dark background):

```text
ONE PROMPT →  VERIFIED CONTRACT ON MANTLE SEPOLIA

26 Mantle-native skills        15 deterministic CLIs
6 agent runtimes               2 team gateways (Discord · Telegram)
4 verified Sepolia deploys     0 high/critical findings open
Tencent Cloud: Hunyuan audit + COS artifact publishing
```

Then: GitHub repo → docs homepage → end card.

**Say:**

> "Twenty-six skills. Fifteen CLIs. Six runtimes. Four verified deployments on Mantle Sepolia — every claim in this video is on-chain or in the repo, and the artifacts are public on Tencent Cloud COS.
> It's MIT-licensed open infrastructure, with the business layer mapped: premium templates, skill packs, and custom plugin work on top of a free core.
> Mantle Forge — **build, harden, deploy, on Mantle**. Whatever agent you already use. Clone it, one-line install, and ship on Sepolia today."

**End card (hold 8 s):**

| Label | URL |
|-------|-----|
| GitHub | https://github.com/BerEst12/mantle-forge |
| Docs | https://mantle-forge.vercel.app |
| Sepolia proof | https://sepolia.mantlescan.xyz/address/0x64D825eDcE57d56365bEb026CEAe4D2D439f7874 |

---

## Edit priorities (cutting to ~5 min)

| Priority | Keep |
|----------|------|
| **P1** | Cold open · install+verify · prompt fired (Act 3) · Tencent Cloud · climax montage · Mantlescan · metrics card · close |
| **P2** | Runtime flashes · skills docs scroll · Discord landing · Telegram `/forge` |
| **P3** | Codex/OpenClaw/OpenCode flashes · Telegram `--live` · bot startup terminal · picture-in-picture of the running session |

The Tencent Cloud act is **P1**, not P2 — partner integration is a differentiator almost no other submission will have working.

---

## Generated image assets (3 cards)

Generate without text (models garble lettering); overlay text in the editor. Palette: background `#111827`, Mantle green `#00D395`, cyan `#22D3EE`.

**1 — Title card** (optional, 3–5 s before Act 0 or skip — the cold open is stronger raw):

```txt
Minimalist dark tech title card, 16:9, deep charcoal background (#111827),
glowing emerald green accents (#00D395) and cyan highlights (#22D3EE),
abstract geometric anvil merged with circuit-board traces, subtle hexagonal
grid fading into background, soft neon glow, clean negative space top and
bottom, flat vector, premium devtool branding, no text, no watermark.
```

**2 — Metrics card background** (Act 8):

```txt
Dark presentation slide background, 16:9, charcoal (#111827), very subtle
hexagonal mesh, single thin emerald (#00D395) accent line across the upper
third, faint cyan (#22D3EE) glow bottom-right corner, large clean empty
center for overlay text, flat minimal, no text, no objects.
```

**3 — End card** (Act 8 close):

```txt
Minimalist dark outro card, 16:9, deep charcoal (#111827), one centered
glowing emerald anvil-circuit emblem (#00D395), faint hexagonal grid, large
empty lower half for overlay links, subtle cyan (#22D3EE) corner accents,
flat vector, soft glow, no text, no letters.
```

---

## Pre-recording checklist

### Core
- [ ] `npm run plugin:hermes` + `npm run plugin:verify` → `ALL CHECKS PASSED`
- [ ] Hermes Desktop — mantle-forge enabled; flagship prompt dry-run completed once
- [ ] `.env` with Sepolia RPC + funded wallet (never on camera)
- [ ] Mantlescan tab on `0x64D825eDcE57d56365bEb026CEAe4D2D439f7874` — verified-source tab
- [ ] `FINAL_REPORT.md`, `reports/security.md`, `reports/gas.md`, `reports/tencent-audit.md`, `cos-upload.md` ready (live or from `examples/demo-runs/`)
- [ ] `TENCENT_HUNYUAN_API_KEY` + `TENCENT_COS_*` set; both CLIs tested
- [ ] COS public URLs open in an incognito tab (proves public access)
- [ ] Docs tabs: Plugins, Skills

### Discord / Telegram
- [ ] Bot online; Prompt A (landing) tested — preview URL loads
- [ ] Prompt B (TVL/MoE) tested
- [ ] Telegram `/forge MyToken` tested on the phone; `ALLOWED_USER_ID` set

### Recording
- [ ] 1920×1080 · terminal font 14+ · dark theme everywhere (consistency)
- [ ] Mic close, no background music under voice; light music under montage OK
- [ ] Name only in intro — `[YOUR NAME]`
- [ ] Record the Act 3 run **once, end to end** — it feeds Acts 3 and 7

---

## DoraHacks description (copy/paste)

> Mantle Forge is operational infrastructure for autonomous blockchain development on Mantle — not another agent runtime. One-line plugin install for Hermes, Cursor, Codex, Claude Code, OpenClaw, and OpenCode; Discord and Telegram gateways for teams. **26 Mantle-native skills** and **15 deterministic CLIs** cover the full engineering pipeline (scaffold, tests, agent-assisted security review, gas analysis, Mantle Sepolia deploy, engineering report), Tencent Cloud integration (Hunyuan deep audit + COS artifact publishing), and live ecosystem data (TVL, Merchant Moe, Mantlescan). One sentence in → verified contract + `FINAL_REPORT.md` out. Verified on Mantle Sepolia: TokenVault `0x64D825eDcE57d56365bEb026CEAe4D2D439f7874` (+3 more deploys in `examples/demo-runs/`).

When the video is up, paste the URL in [`SUBMISSION.md`](./SUBMISSION.md).

---

# Part 2 — Español (referencia completa)

> No grabes en español salvo que quieras una segunda versión. Esta parte es para **entender y ensayar** la Parte 1.

**Público:** jurado DoraHacks (mezcla técnica + negocio)
**Tono:** seguro, concreto, cero relleno — cada frase se gana sus segundos
**Entorno:** Hermes Desktop (Windows) + terminal WSL + navegador + teléfono

## La estrategia en una frase

El framing ganador no es «asistente de IA para developers», es **«infraestructura operacional para desarrollo blockchain autónomo»**. La hackathon se llama Turing Test: el test de un coding agent no es escribir Solidity — es **shippearlo**. Esa frase va en cámara.

El dispositivo narrativo clave: disparás el prompt flagship en el Acto 3 y **te alejás**. Volvés en el Acto 7 y el agente terminó solo. Todas las demás demos muestran agentes supervisados; la tuya muestra autonomía real, demostrada y no declarada.

---

## Acto 0 — Cold open: el resultado primero (~0:25)

**Pantalla:** Mantlescan, TokenVault verificado — pestaña de código verificado:
[`0x64D825eDcE57d56365bEb026CEAe4D2D439f7874`](https://sepolia.mantlescan.xyz/address/0x64D825eDcE57d56365bEb026CEAe4D2D439f7874)

**Di:**

> «Este es un smart contract verificado, vivo en Mantle Sepolia. Fue scaffoldeado, testeado, revisado por seguridad, optimizado en gas, deployado y verificado — por un coding agent. A partir de **una sola frase**. Ningún humano tocó el pipeline.
> Esta hackathon se llama Turing Test. El nuestro es este: el test real de un coding agent no es escribir Solidity — es **shippearlo**. Rebobinemos y les muestro cómo pasó este contrato.»

## Acto 1 — Tesis: la brecha (~0:30)

**Pantalla:** cortes rápidos — chat IA sugiriendo Solidity ↔ terminal con pasos manuales.

**Di:**

> «Soy **[TU NOMBRE]**. La brecha es esta: las herramientas de IA son buenas *sugiriendo* Solidity. Pero las sugerencias no shippean. Los equipos Mantle siguen haciendo scaffold, config de Hardhat, tests, revisión de seguridad, gas, deploy y verificación — a mano, con herramientas desconectadas. Y un agente solo no puede hacerlo de forma confiable: improvisa, alucina configs, no tiene contexto Mantle.
> **Mantle Forge** cierra la brecha. No es otro runtime de agentes — es la **capa de ejecución** que convierte al agente que ya usás en un ingeniero Mantle: 26 skills nativas de Mantle que le dicen al agente *cómo*, y 15 CLIs deterministas que hacen el trabajo verificable. Hermes, Cursor, Codex, Claude Code, OpenClaw, OpenCode — install de una línea cada uno, más Discord y Telegram para el equipo.»

## Acto 2 — Install + verify (~0:30)

**Pantalla — WSL:** mismos comandos que Parte 1; mantener 2 s el `ALL CHECKS PASSED` verde.

**Di:**

> «Primero, reproducibilidad. Clonar, install de una línea, verificar. `plugin:verify` chequea la estructura del bundle, hace smoke test de cada CLI y confirma el wiring de Hermes. El jurado puede correr esta secuencia exacta en menos de dos minutos. Estos CLIs son binarios reales — acá no hay nada simulado.»

## Acto 3 — Disparar el prompt y alejarse (~0:35)

**Pantalla:** Hermes Desktop, sesión nueva, pegar el prompt flagship; primeras tool calls en streaming.

**Di:**

> «Ahora el test de verdad. Una frase: construí un token vault, testealo, auditalo, optimizá gas, deployalo en Mantle Sepolia, escribí el reporte de ingeniería.
> Lo envío — y me voy a **alejar**. Sin supervisión, sin prompts de seguimiento. Mientras el agente trabaja, les muestro qué hay debajo. Volvemos cuando termine.»

## Acto 4 — Portabilidad: seis runtimes (~0:25)

**Pantalla:** Cursor → Claude Code → tabla de runtimes en docs.

**Di:**

> «Esto no es una feature de Hermes — es una capa. Las mismas skills y CLIs, instaladas en Cursor, Claude Code, Codex, OpenClaw u OpenCode con un comando cada uno. No cambiás de agente para buildear en Mantle. Tu agente aprende Mantle.»

## Acto 5 — Adentro de la capa + Tencent Cloud (~0:55)

### 5a — Anatomía

**Pantalla:** árbol `plugins/mantle-forge/` + scroll de la página Skills en docs.

**Di:**

> «Debajo: **26 skills nativas de Mantle** y **15 CLIs deterministas**, sincronizados desde una sola fuente.
> Siete skills de ingeniería corren el pipeline flagship — scaffold, config Hardhat, tests, revisión de seguridad, análisis de gas, deploy Sepolia, reporte.
> Diecisiete skills de datos DeFi cubren el ecosystem — precios, TVL, pools y quotes de Merchant Moe, lookups en Mantlescan, overview de wallets. Todas verificadas contra endpoints en vivo.»

### 5b — Tencent Cloud

**Pantalla:** `mantle-tencent-audit` + `mantle-cos-upload` corriendo; scroll del reporte; URLs públicas de COS abriendo en el navegador.

**Di:**

> «Y dos skills integran **Tencent Cloud** — partner de infraestructura de esta hackathon — como tooling funcional, no como logo.
> `mantle-tencent-audit` manda los contratos al modelo **Hunyuan** para una segunda opinión de auditoría profunda con checks específicos de Mantle L2 — una clase de modelo distinta a la del agente, así que encuentra cosas distintas.
> `mantle-cos-upload` publica cada artefacto del pipeline en Tencent Cloud Object Storage con URLs públicas. Cualquiera — incluido el jurado — puede verificar lo que decimos sin clonar nada.»

## Acto 6 — Discord + Telegram (~0:50)

**Pantalla Discord:** Prompt A (landing del ecosystem) → respuestas + preview URL; Prompt B (TVL/MoE) → respuesta con datos.

**Di:**

> «Los equipos viven en Discord — Mantle Forge también. Pedí una landing del ecosystem completa: el agente usa las skills DeFi y entrega un frontend funcionando con datos Mantle reales y preview URL. O simplemente preguntá — TVL, pools de Merchant Moe, directo en el chat.»

**Pantalla Telegram (teléfono):** `/forge MyToken` → mensaje de estado por paso (🏗 → 🔒 → ⛽ → 🚀 → 📄).

**Di:**

> «Telegram hace otro trabajo: operaciones desde el móvil. Un comando — el pipeline **completo** corre desde el teléfono. Mismos CLIs, mismos artefactos.»

## Acto 7 — Clímax: el run terminó solo (~1:20)

**Pantalla:** volver a la sesión Hermes del Acto 3 — completada, historial de tool calls visible.

**Di (transición):**

> «¿Se acuerdan del prompt de hace cuatro minutos? Mientras recorríamos el stack, el agente **terminó**. Nadie lo tocó. Esto produjo una sola frase.»

**Beats del montaje (~10 s c/u):**

| Beat | Di (una línea) | Pantalla |
|------|----------------|----------|
| Scaffold | «Un proyecto Hardhat real — template token-vault, Mantle Sepolia preconfigurado.» | `TokenVault.sol`, `hardhat.config.ts` |
| Tests | «Tests en verde antes de shippear — deposit, withdraw, guards de sobregiro, rechazo de fee-on-transfer.» | salida Hardhat |
| Security | «Revisión de seguridad asistida: cero hallazgos high o critical abiertos. Más el audit profundo de Hunyuan como segunda opinión.» | `reports/security.md` |
| Gas | «Gas perfilado por método — deposit ~79k, withdraw ~65k — con notas de optimización específicas de Mantle.» | `reports/gas.md` |
| Deploy | «Deployado en Mantle Sepolia, chainId 5003 — address, tx y explorer en JSON.» | `deployments/mantleSepolia.json` |
| Verify | «Código fuente verificado en Mantlescan — cualquiera puede leer qué hay on-chain.» | Mantlescan, pestaña de código |
| Report | «Y el entregable que un equipo real necesita: `FINAL_REPORT.md`.» | scroll del reporte |

**Di (cierre del montaje):**

> «Eso es el track, en pantalla: asistencia de audit específica de Mantle, tooling de gas inteligente, ejecución autónoma real, prueba on-chain. Una frase entra — sale un contrato verificado y un reporte de ingeniería.»

## Acto 8 — Números + cierre (~0:35)

**Pantalla:** tarjeta de métricas (texto grande sobre fondo oscuro) → repo → docs → end card.

**Di:**

> «Veintiséis skills. Quince CLIs. Seis runtimes. Cuatro deployments verificados en Mantle Sepolia — cada afirmación de este video está on-chain o en el repo, y los artefactos son públicos en Tencent Cloud COS.
> Es infraestructura open-source con licencia MIT, con la capa de negocio mapeada: templates premium, skill packs y plugins a medida sobre un core gratuito.
> Mantle Forge — **build, harden, deploy, on Mantle**. Con el agente que ya usás. Clonalo, install de una línea, y shippeá en Sepolia hoy.»

---

## Resumen de comandos (orden de rodaje)

```bash
# Acto 2 — install + verify (WSL)
git clone https://github.com/BerEst12/mantle-forge.git
cd mantle-forge
npm install
npm run plugin:hermes
npm run plugin:verify
npx mantle-scaffold --help

# Acto 4 — flashes de runtimes
npm run plugin:cursor
npm run plugin:claude
npm run plugin:codex

# Acto 5b — Tencent Cloud
npx mantle-tencent-audit ./my-vault --out reports/tencent-audit.md
npx mantle-cos-upload ./my-vault --out reports/cos-upload.md

# Acto 6 — Telegram (en el chat): /forge MyToken
# (opcional, terminal) cd hermes/gateway/telegram-bot && npm start

# Acto 7 — CLIs que el agente invoca (mostrar solo si hace falta)
npx mantle-scaffold token-vault ./my-vault
npx mantle-check ./my-vault
npx mantle-audit ./my-vault --out reports/security.md
npx mantle-gas-report ./my-vault --out reports/gas.md
npx mantle-deploy ./my-vault --network mantleSepolia
npx mantle-report ./my-vault --out FINAL_REPORT.md
```

**Prompts para pegar (no hablar):** flagship (Actos 3/7), Discord A y B (Acto 6) — texto completo en cada acto.
