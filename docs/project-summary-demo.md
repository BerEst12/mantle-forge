# Project Summary — Demo, Judging, and Plan

## Flagship demo prompt

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

## Demo success criteria

The demo wins only if it shows:

- one prompt
- project generated
- tests executed
- security review generated
- gas analysis generated
- Mantle Sepolia deployment completed
- tx hash and contract address captured
- final report generated

A dashboard, chatbot, scaffolder-only, or audit-only demo is **not enough**.

## Final report must include

- Project name and generated files
- Contract summary
- Test results
- Gas report
- Security findings and hardening changes
- Mantle Sepolia deployment (address, tx hash, explorer link)
- Next improvements
- Agent execution log

## Demo script (six scenes)

1. **Problem** — Chat tools explain Solidity but rarely complete build → test → harden → deploy → document
2. **Setup** — `npm install && npm run plugin:hermes` (or `plugin:cursor`, etc.)
3. **Prompt** — Send flagship request to Hermes
4. **Execution** — Files, tests, gas, security, deploy, report
5. **On-chain proof** — Address, tx, explorer, report
6. **Close** — "Mantle Forge turns Hermes into an autonomous Mantle development agent"

## Judging alignment (AI DevTools)

| Signal | How we address it |
|--------|-------------------|
| Real utility | Full engineering loop on Mantle |
| Autonomous execution | Multi-step workflow from one prompt |
| Mantle integration | Sepolia config, deploy, templates, context |
| Measurable results | Tests, gas, security, tx, report |
| Operational capability | Creates, tests, hardens, deploys, documents |

Hackathon track keywords: smart gas optimization, Mantle-specific audit assistants, developer infrastructure, deployment automation.

## Implementation milestones

| Phase | Focus |
|-------|-------|
| Foundation | Repo skeleton, Hardhat starter, Hermes system instructions |
| Skills | Skills and flagship workflow |
| CLI layer | scaffold, check, report |
| Hardening | Tests, gas reporter, security review |
| Deploy | Mantle Sepolia deploy pipeline |
| Distribution | Installer, quickstart docs, gateway guides |
| Submission | Demo recording, submission polish |

Active plan: hackathon phases (build → harden → deploy → report).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Looks like a Hermes wrapper | Emphasize Mantle engineering layer (skills, tools, workflows) |
| Scope too large | One flagship workflow first |
| Dashboard distraction | Skip until workflow works |
| Audit claims too strong | "Agent-assisted hardening and security review" |
| Deploy fails live | Pre-record demo; commit sample artifacts |

## Roadmap (post-MVP)

- More Mantle templates
- Harden existing repo workflow
- PR generation, contract verification automation
- MCP server for Mantle tooling
- Dashboard for execution evidence
- Additional agent harness adapters

## Strategic close

> One command installs Mantle Forge. One prompt asks Hermes to build. One workflow creates, hardens, tests, optimizes, deploys, and reports a Mantle project.

Do not overbuild the runtime. Do not hide Hermes. Do not start with the dashboard. Prove it with a real Mantle Sepolia deployment.
