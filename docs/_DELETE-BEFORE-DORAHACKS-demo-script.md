# ⚠️ DELETE BEFORE DORAHACKS SUBMISSION

> **Temporary / personal use only.** Do not include in the public submission.
> Delete this file before your final push or repo publish for the hackathon.

**How to use this doc**

| Section | Purpose |
|---------|---------|
| **Part 1 — Español** | Draft: read aloud, edit timing and wording until it feels right |
| **Part 2 — English** | **Record the video in English** using this section |

---

# Part 1 — Español (borrador para editar)

## Guion demo — Mantle Forge for Hermes (3–5 min)

**Formato:** grabación de pantalla + voz (Hermes Desktop en Windows)  
**Público:** jueces DoraHacks — track AI DevTools  
**Tono:** claro, técnico pero directo; sin hype vacío

> **Tip:** empieza con tu cara 5–10 s (opcional) o con el README a pantalla completa mientras te presentas. No saltes directo al producto.

---

### 0:00–0:20 — Presentación *(rellena `[TU NOMBRE]`)*

> «Hola, soy **[TU NOMBRE]**.  
> En este video muestro **Mantle Forge for Hermes**, mi proyecto para el **Turing Test Hackathon 2026**, track **AI DevTools**.  
> En los próximos minutos verás **un solo prompt** que lleva un token vault desde cero hasta **Mantle Sepolia**, con tests, revisión de seguridad, gas y un informe final.»

**En pantalla:** tú (cámara) o README con tu nombre / repo visible → logo o `docs/architecture-visual.html`.

---

### 0:20–0:40 — Qué es (hook)

> «**Mantle Forge for Hermes** no es otro runtime de IA.  
> Es una capa de ejecución Mantle sobre [Hermes Agent](https://github.com/NousResearch/hermes): skills, CLIs y templates para que el agente **cierre el loop de ingeniería** — no solo hable de Solidity.»

**En pantalla:** `docs/architecture-visual.html` o diagrama del README (5 s) → prepara corte a Hermes Desktop.

---

### 0:40–1:10 — Problema + tesis

> «Construir en Mantle sigue siendo lento: scaffold Hardhat, tests, revisión, gas, deploy, documentación.  
> Los asistentes genéricos hablan bien pero no cierran el loop.  
> Mantle Forge empaqueta **skills**, **CLIs deterministas**, **templates** y **conocimiento Mantle** para que Hermes ejecute el ciclo completo.»

**En pantalla:** diagrama README (capas: prompt → plugins → CLIs → Sepolia).

---

### 1:10–1:30 — Stack en 20 segundos

> «**Hermes Desktop** es la UI del agente.  
> **Mantle Forge** añade 7 skills `mantle-*` al mismo Hermes — scaffold, tests, security, gas, deploy Sepolia, report.  
> Misma sesión en Desktop, TUI o CLI.»

**En pantalla:** Skills & Tools → buscar `mantle-project-scaffold`, `mantle-deploy-sepolia` (toggles ON).

---

### 1:30–1:45 — Setup

> «Instalación: clonar el repo, `npm install && npm run plugin:hermes`, abrir Desktop con una carpeta de trabajo vacía.»

**En pantalla (opcional, 5 s):** `npm run plugin:hermes` y `hermes desktop --cwd ...`  
**O salta** si ya está instalado: «Asumimos Mantle Forge ya cargado.»

---

### 1:45–2:15 — El prompt

**Ctrl+N** → sesión nueva. Pega el flagship:

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

> «Un solo mensaje. El agente interpreta el flujo de ingeniería Mantle y empieza a usar tools.»

**En pantalla:** prompt visible + streaming de tools en el panel.

---

### 2:15–3:15 — Montaje del flujo

| Beat | Qué decir | Qué mostrar |
|------|-----------|-------------|
| Scaffold | «Scaffold con template token-vault y Hardhat para Sepolia.» | `contracts/`, `hardhat.config.ts` |
| Tests | «Suite de tests en verde.» | salida `npm run test` o mensaje del agente |
| Security | «Revisión agent-assisted — no auditoría profesional.» | `reports/security.md` |
| Gas | «Análisis de gas con recomendaciones seguras.» | `reports/gas.md` |
| Deploy prep | «Wallet de demo y `.env` en el proyecto — nunca en el chat.» | *(no mostrar la key)* |

> Si el live es largo: «En producción este pipeline tarda ~20–40 minutos; aquí mostramos el run verificado del 5 de junio.»

---

### 3:15–4:00 — Deploy + prueba on-chain

> «Deploy en **Mantle Sepolia**, chainId 5003.»

**En pantalla:**

- Terminal / mensaje Hermes con address
- **TokenVault:** `0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee`
- Mantlescan: https://sepolia.mantlescan.xyz/address/0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee

> «Contrato vivo en testnet. Tx y address quedan en `deployments/mantleSepolia.json`.»

---

### 4:00–4:30 — Informe final

**En pantalla:** `FINAL_REPORT.md`

> «El entregable no es solo el contrato: es **`FINAL_REPORT.md`** — tests, security, gas, deploy, explorer links y siguientes pasos.  
> Eso es lo que un equipo de ingeniería necesita para revisar y continuar.»

---

### 4:30–4:50 — Arquitectura + repo

> «Arquitectura: prompt → skill pack → CLIs `mantle-*` → templates Hardhat → Mantle Sepolia.  
> Repo open source MIT, artefactos en `examples/demo-runs/2026-06-05-hermes-desktop/`, guía Desktop en `knowledge/hermes-desktop-smoke-test.md`.»

**En pantalla:** `docs/architecture-visual.html` o README + carpeta `examples/demo-runs/`.

---

### 4:50–5:10 — Cierre

> «Gracias por ver la demo. Soy **[TU NOMBRE]** — **Mantle Forge for Hermes**, Build. Harden. Deploy. On Mantle.  
> Repo en GitHub, track AI DevTools, Turing Test Hackathon 2026.»

**En pantalla:** README + address Sepolia + (opcional) QR al repo.

---

# Part 2 — English (record this)

## Demo script — Mantle Forge for Hermes (3–5 min)

**Format:** screen recording + voiceover (Hermes Desktop on Windows)  
**Audience:** DoraHacks judges — AI DevTools track  
**Tone:** clear, technical, direct — no empty hype

> **Tip:** open with your face for 5–10 s (optional) or full-screen README while you introduce yourself. Don't jump straight into the product.

---

### 0:00–0:20 — Intro *(fill in `[YOUR NAME]`)*

> "Hi, I'm **[YOUR NAME]**.  
> In this video I'm showing **Mantle Forge for Hermes** — my project for the **Turing Test Hackathon 2026**, **AI DevTools** track.  
> In the next few minutes you'll see **one prompt** take a token vault from zero to **Mantle Sepolia**, with tests, security review, gas analysis, and a final engineering report."

**On screen:** you (camera) or README with your name / repo visible → logo or `docs/architecture-visual.html`.

---

### 0:20–0:40 — What it is (hook)

> "**Mantle Forge for Hermes** is not another AI runtime.  
> It's a Mantle execution layer on top of [Hermes Agent](https://github.com/NousResearch/hermes) — skills, CLIs, and templates so the agent **closes the engineering loop**, not just talks about Solidity."

**On screen:** `docs/architecture-visual.html` or README diagram (5 s) → prepare cut to Hermes Desktop.

---

### 0:40–1:10 — Problem + thesis

> "Building on Mantle is still slow: Hardhat scaffold, tests, review, gas analysis, deploy, documentation.  
> Generic assistants talk well — but they don't close the loop.  
> Mantle Forge packages **skills**, **deterministic CLIs**, **templates**, and **Mantle-specific knowledge** so Hermes runs the full cycle."

**On screen:** README diagram (layers: prompt → skills → CLIs → Sepolia).

---

### 1:10–1:30 — Stack in 20 seconds

> "**Hermes Desktop** is the agent UI.  
> **Mantle Forge** adds seven `mantle-*` skills to the same Hermes — scaffold, tests, security, gas, Sepolia deploy, report.  
> Same session on Desktop, TUI, or CLI."

**On screen:** Skills & Tools → search `mantle-project-scaffold`, `mantle-deploy-sepolia` (toggles ON).

---

### 1:30–1:45 — Setup

> "Setup: clone the repo, `npm install && npm run plugin:hermes`, open Desktop with an empty workspace folder."

**On screen (optional, 5 s):** `npm run plugin:hermes` and `hermes desktop --cwd ...`  
**Or skip** if already installed: "We'll assume Mantle Forge is already loaded."

---

### 1:45–2:15 — The prompt

**Ctrl+N** → new session. Paste the flagship prompt:

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

> "One message. The agent interprets the Mantle engineering flow and starts calling tools."

**On screen:** visible prompt + tool streaming in the panel.

---

### 2:15–3:15 — Flow montage

| Beat | What to say | What to show |
|------|-------------|--------------|
| Scaffold | "Scaffold with the token-vault template and Hardhat configured for Sepolia." | `contracts/`, `hardhat.config.ts` |
| Tests | "Test suite passing." | `npm run test` output or agent message |
| Security | "Agent-assisted security review — not a professional audit." | `reports/security.md` |
| Gas | "Gas analysis with safe recommendations." | `reports/gas.md` |
| Deploy prep | "Demo wallet and `.env` in the project — never in chat." | *(do not show the key)* |

> If live run is slow: "In production this pipeline takes about 20–40 minutes; here we show the verified run from June 5."

---

### 3:15–4:00 — Deploy + on-chain proof

> "Deploy to **Mantle Sepolia**, chainId 5003."

**On screen:**

- Terminal / Hermes message with contract address
- **TokenVault:** `0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee`
- Open Mantlescan: https://sepolia.mantlescan.xyz/address/0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee

> "Live contract on testnet. Tx and address are saved in `deployments/mantleSepolia.json`."

---

### 4:00–4:30 — Final report

**On screen:** `FINAL_REPORT.md`

> "The deliverable isn't just the contract — it's **`FINAL_REPORT.md`**: tests, security, gas, deploy details, explorer links, and next steps.  
> That's what an engineering team needs to review and continue."

---

### 4:30–4:50 — Architecture + repo

> "Architecture: prompt → skill pack → `mantle-*` CLIs → Hardhat templates → Mantle Sepolia.  
> Open-source MIT repo, artifacts in `examples/demo-runs/2026-06-05-hermes-desktop/`, Desktop guide in `knowledge/hermes-desktop-smoke-test.md`."

**On screen:** `docs/architecture-visual.html` or README + `examples/demo-runs/` folder.

---

### 4:50–5:10 — Close

> "Thanks for watching. I'm **[YOUR NAME]** — **Mantle Forge for Hermes**. Build. Harden. Deploy. On Mantle.  
> GitHub repo, AI DevTools track, Turing Test Hackathon 2026."

**On screen:** README + Sepolia address + (optional) QR to repo.

---

# Shared — Recording tips / Checklist

## Recording tips

1. **Resolution:** 1920×1080, 100–110% zoom in Hermes so text is readable.
2. **Audio:** mic close; no background music.
3. **Secrets:** never show `.env`, private keys, or API keys on screen.
4. **Length:** if over 5 min, shorten setup and live deploy; keep prompt + Mantlescan + `FINAL_REPORT.md`.
5. **Plan B:** if live fails during recording, use the completed run and say "verified run" with repo artifacts.

## DoraHacks short description (copy/paste)

> Mantle Forge turns Hermes into a Mantle-native development agent. One natural-language prompt scaffolds a Hardhat project, runs tests, performs agent-assisted security review and gas analysis, deploys to Mantle Sepolia, and generates FINAL_REPORT.md. Built as a skill + CLI layer on Hermes Agent (not a new runtime). Live deploy: TokenVault `0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee` on Mantle Sepolia.

## Pre-recording checklist

- [ ] Hermes Desktop open, `mantle-*` skills enabled
- [ ] Clean workspace folder or session ready to show
- [ ] `.env` with Sepolia funds (only for live deploy)
- [ ] `architecture-visual.html` open in browser
- [ ] Mantlescan tab with your contract address
- [ ] Practiced Part 1 (ES) — edits applied to Part 2 (EN) before recording

When the video is ready, paste the URL in `docs/SUBMISSION.md` (`Video URL: _pending_`).
