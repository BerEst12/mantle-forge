import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from '../css/home.module.css';

/* ──────────────────────────────────────────────
   PIXEL BLOCKS — decorative, pure CSS divs
   ────────────────────────────────────────────── */
const PIXEL_ANIMS = ['pixelAnimA', 'pixelAnimB', 'pixelAnimC'];

const PIXELS = [
  { cls: styles.pixelGreen, style: { width: 10, height: 10, top: '8%',  left: '4%'  } },
  { cls: styles.pixelAmber, style: { width: 6,  height: 6,  top: '14%', left: '8%'  } },
  { cls: styles.pixelCyan,  style: { width: 8,  height: 8,  top: '6%',  left: '14%' } },
  { cls: styles.pixelDim,   style: { width: 14, height: 14, top: '20%', left: '2%'  } },
  { cls: styles.pixelGreen, style: { width: 6,  height: 6,  top: '30%', left: '6%'  } },
  { cls: styles.pixelAmber, style: { width: 10, height: 10, top: '72%', left: '3%'  } },
  { cls: styles.pixelCyan,  style: { width: 6,  height: 6,  top: '85%', left: '9%'  } },
  { cls: styles.pixelGreen, style: { width: 8,  height: 8,  top: '8%',  right: '4%' } },
  { cls: styles.pixelAmber, style: { width: 12, height: 12, top: '18%', right: '9%' } },
  { cls: styles.pixelCyan,  style: { width: 6,  height: 6,  top: '25%', right: '5%' } },
  { cls: styles.pixelDim,   style: { width: 16, height: 16, top: '60%', right: '3%' } },
  { cls: styles.pixelGreen, style: { width: 8,  height: 8,  top: '78%', right: '7%' } },
  { cls: styles.pixelAmber, style: { width: 6,  height: 6,  top: '40%', left: '1%'  } },
  { cls: styles.pixelCyan,  style: { width: 10, height: 10, top: '50%', right: '2%' } },
  { cls: styles.pixelGreen, style: { width: 4,  height: 4,  top: '45%', left: '11%' } },
  { cls: styles.pixelAmber, style: { width: 4,  height: 4,  top: '90%', left: '18%' } },
  { cls: styles.pixelCyan,  style: { width: 6,  height: 6,  top: '88%', right: '14%'} },
];

function PixelField() {
  return (
    <div className={styles.pixelField} aria-hidden="true">
      {PIXELS.map((p, i) => (
        <div
          key={i}
          className={`${styles.pixel} ${p.cls} ${styles[PIXEL_ANIMS[i % PIXEL_ANIMS.length]]}`}
          style={{ ...p.style, animationDelay: `${(i * 0.45).toFixed(2)}s` }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   HERO
   ────────────────────────────────────────────── */
function Hero() {
  return (
    <section className={styles.hero}>
      <PixelField />
      <img
        src="/img/logo.png"
        alt="Mantle Forge Logo"
        className={styles.heroLogo}
      />
      <h1 className={styles.heroHeadline}>
        Build. Harden.{' '}
        <span className={styles.heroHeadlineGreen}>Deploy.</span>
        <br />
        On Mantle.
      </h1>
      <p className={styles.heroSub}>
        Mantle-native skills and CLI tools for any coding agent.
        Scaffold, test, harden, and deploy contracts — or query
        Mantle DeFi data — from one prompt.
      </p>
      <div className={styles.heroCta}>
        <Link to="/docs/quickstart" className={styles.btnPrimary}>
          Get Started →
        </Link>
        <a
          href="https://github.com/BerEst12/mantle-forge"
          className={styles.btnSecondary}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   TERMINAL STRIP
   ────────────────────────────────────────────── */
function TerminalStrip() {
  return (
    <div className={styles.terminalStrip}>
      <div className={styles.terminalInner}>
        <div className={styles.terminalWindow}>
          <div className={styles.terminalBar}>
            <span className={`${styles.terminalDot} ${styles.terminalDotRed}`} />
            <span className={`${styles.terminalDot} ${styles.terminalDotYellow}`} />
            <span className={`${styles.terminalDot} ${styles.terminalDotGreen}`} />
            <span className={styles.terminalTitle}>mantle-forge — bash</span>
          </div>
          <div className={styles.terminalBody}>
            <span className={styles.terminalCommand}>$ npm run plugin:cursor</span>
            <span className={styles.terminalBlank} />
            <span>
              <span className={styles.terminalCheck}>✓</span>{' '}
              <span className={styles.terminalLabel}>Mantle Forge plugin installed </span>{' '}
              <span className={styles.terminalMeta}>[16 tools · 9 skills]</span>
            </span>
            <br />
            <span>
              <span className={styles.terminalCheck}>✓</span>{' '}
              <span className={styles.terminalLabel}>Hardhat configured           </span>{' '}
              <span className={styles.terminalMeta}>[Mantle Sepolia]</span>
            </span>
            <br />
            <span>
              <span className={styles.terminalCheck}>✓</span>{' '}
              <span className={styles.terminalLabel}>Templates ready              </span>{' '}
              <span className={styles.terminalMeta}>[token-vault, starter]</span>
            </span>
            <br />
            <span>
              <span className={styles.terminalCheck}>✓</span>{' '}
              <span className={styles.terminalLabel}>Agent ready</span>{' '}
              <span className={styles.terminalReady}>— ask your agent anything</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   THE LOOP
   ────────────────────────────────────────────── */
const LOOP_STEPS = [
  { icon: '💬', label: 'Prompt',   num: '01' },
  { icon: '🏗️', label: 'Scaffold', num: '02' },
  { icon: '🧪', label: 'Test',     num: '03' },
  { icon: '🛡️', label: 'Harden',   num: '04' },
  { icon: '🚀', label: 'Deploy',   num: '05' },
  { icon: '🔍', label: 'Verify',   num: '06' },
  { icon: '📋', label: 'Report',   num: '07' },
];

function LoopSection() {
  return (
    <section className={styles.loopSection}>
      <div className={styles.sectionLabel}>The Loop</div>
      <h2 className={styles.sectionTitle}>One prompt. Full dev workflow.</h2>
      <p className={styles.sectionDesc}>
        A single natural-language request drives the entire Mantle smart contract
        development lifecycle — no manual steps.
      </p>
      <div className={styles.loopFlow}>
        {LOOP_STEPS.map((step, i) => (
          <React.Fragment key={step.label}>
            <div className={styles.loopStep}>
              <span className={styles.loopStepIcon}>{step.icon}</span>
              <span className={styles.loopStepNum}>{step.num}</span>
              <span className={styles.loopStepLabel}>{step.label}</span>
            </div>
            {i < LOOP_STEPS.length - 1 && (
              <span className={styles.loopArrow} aria-hidden="true">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   FEATURES
   ────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '🧠',
    strip: 'cyan',
    title: 'Plugin Bundle',
    desc: 'Multi-vendor plugin with 9 skills (7 engineering + 2 Tencent Cloud), commands, rules, and hooks — one install per runtime. DeFi data ships as 7 CLIs.',
    mono: 'mantle-scaffold  mantle-check\nmantle-audit     mantle-deploy\nmantle-tencent-audit',
  },
  {
    icon: '🔧',
    strip: 'green',
    title: 'Tool Layer',
    desc: '16 CLI tools the agent invokes: scaffold, check, audit, gas-report, harden, deploy, report, tencent-audit, cos-upload, scan (4), and moe (3).',
    mono: 'mantle-scaffold    mantle-check\nmantle-audit       mantle-gas-report\nmantle-harden      mantle-deploy\nmantle-report      mantle-tencent-audit\nmantle-cos-upload  mantle-scan\nmantle-moe',
  },
  {
    icon: '⚙️',
    strip: 'amber',
    title: 'Workflow Pack',
    desc: 'Full build-harden-deploy automation from one prompt. Your agent orchestrates each step.',
    mono: 'Prompt → Scaffold → Test\n→ Harden → Deploy → Verify → Report',
  },
  {
    icon: '📚',
    strip: 'green',
    title: 'Knowledge Pack',
    desc: 'Mantle network config, security checklists, gas optimization notes, deployment guides.',
    mono: 'mantle-deployment-checklist.md\nsecurity-review-checklist.md\ngas-optimization-notes.md',
  },
  {
    icon: '📦',
    strip: 'cyan',
    title: 'Templates',
    desc: 'Hardhat Mantle starter project and token-vault flagship contract.',
    mono: 'templates/\n  hardhat-mantle-starter/\n  token-vault/',
  },
  {
    icon: '📊',
    strip: 'amber',
    title: 'Reports',
    desc: 'Generates FINAL_REPORT.md with tx hash, gas data, security findings, and deploy artifacts.',
    mono: 'FINAL_REPORT.md\n  ✓ tx hash  ✓ gas data\n  ✓ security findings',
  },
];

function FeaturesSection() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresInner}>
        <div className={styles.sectionLabel}>What Ships</div>
        <h2 className={styles.sectionTitle}>Everything your agent needs to build on Mantle</h2>
        <p className={styles.sectionDesc}>
          A complete execution layer: skills, CLI tools, workflows, templates, and context —
          packaged for Hermes, Cursor, Codex, Claude, OpenClaw, and OpenCode.
        </p>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={`${styles.featureCardStrip} ${styles[f.strip]}`} />
              <div className={styles.featureCardBody}>
                <span className={styles.featureCardIcon}>{f.icon}</span>
                <h3 className={styles.featureCardTitle}>{f.title}</h3>
                <p className={styles.featureCardDesc}>{f.desc}</p>
                {f.mono && (
                  <pre className={styles.featureCardMono}>{f.mono}</pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SUPPORTED AGENTS
   ────────────────────────────────────────────── */
const AGENTS = [
  { name: 'Hermes', cmd: 'plugin:hermes', note: 'Flagship demo' },
  { name: 'Cursor', cmd: 'plugin:cursor', note: 'IDE agent' },
  { name: 'Codex', cmd: 'plugin:codex', note: 'OpenAI Codex' },
  { name: 'Claude', cmd: 'plugin:claude', note: 'Claude Code' },
  { name: 'OpenClaw', cmd: 'plugin:openclaw', note: 'Gateway plugins' },
  { name: 'OpenCode', cmd: 'plugin:opencode', note: 'Skills path' },
];

function AgentsSection() {
  return (
    <section className={styles.agentsSection}>
      <div className={styles.agentsInner}>
        <div className={styles.sectionLabel}>Supported Agents</div>
        <h2 className={styles.sectionTitle}>One toolkit. Six runtimes.</h2>
        <p className={styles.sectionDesc}>
          Install once per harness. Same skills, same CLI tools, same Mantle workflow.
        </p>
        <div className={styles.agentsGrid}>
          {AGENTS.map((a) => (
            <div key={a.name} className={styles.agentCard}>
              <span className={styles.agentName}>{a.name}</span>
              <code className={styles.agentCmd}>npm run {a.cmd}</code>
              <span className={styles.agentNote}>{a.note}</span>
            </div>
          ))}
        </div>
        <Link to="/docs/plugins/" className={styles.agentsLink}>
          Plugin install guides →
        </Link>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   DEMO PROMPT
   ────────────────────────────────────────────── */
function DemoSection() {
  return (
    <section className={styles.demoSection}>
      <div className={styles.demoInner}>
        <div className={styles.sectionLabel}>Flagship Demo</div>
        <h2 className={styles.sectionTitle}>One prompt. Full Mantle dev loop.</h2>
        <p className={styles.sectionDesc}>
          This is the demo prompt that drives the complete workflow — scaffold to deployment.
        </p>
        <div className={styles.demoPromptBox}>
          <div className={styles.demoPromptBar}>
            <span className={`${styles.terminalDot} ${styles.terminalDotRed}`} />
            <span className={`${styles.terminalDot} ${styles.terminalDotYellow}`} />
            <span className={`${styles.terminalDot} ${styles.terminalDotGreen}`} />
            <span className={styles.demoPromptLabel}>Agent Prompt</span>
          </div>
          <div className={styles.demoPromptBody}>
            Create a Mantle Sepolia-ready token vault project from scratch.
            <br />
            Add tests, run a security review, optimize gas where possible,
            <br />
            deploy it to Mantle Sepolia, and generate an engineering report.
            <span className={styles.demoPromptCaret}>█</span>
          </div>
        </div>
        <div className={styles.demoOutputLabel}>Agent executes</div>
        <div className={styles.demoOutputRow}>
          {['Scaffold', 'Tests', 'Security Review', 'Tencent AI Audit', 'Gas Optimize', 'Deploy', 'Verify', 'FINAL_REPORT.md'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <span className={styles.demoOutputStep}>{step}</span>
              {i < arr.length - 1 && (
                <span className={styles.demoOutputArrow} aria-hidden="true">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ──────────────────────────────────────────────
   PAGE ROOT
   ────────────────────────────────────────────── */
export default function Home() {
  return (
    <Layout
      title="Build. Harden. Deploy. On Mantle."
      description="Mantle Forge gives coding agents Mantle-native skills and CLI tools. Scaffold, test, harden, deploy, and report smart contract projects from a single prompt."
    >
      <main className={styles.homePage}>
        <Hero />
        <TerminalStrip />
        <AgentsSection />
        <LoopSection />
        <FeaturesSection />
        <DemoSection />
      </main>
    </Layout>
  );
}
