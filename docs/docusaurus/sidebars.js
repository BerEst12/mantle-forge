/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    "intro",
    "quickstart",
    {
      type: "category",
      label: "Plugins",
      collapsed: false,
      link: { type: "doc", id: "plugins/index" },
      items: [
        { type: "doc", id: "plugins/index", label: "Overview" },
        { type: "doc", id: "plugins/install-hermes", label: "Install — Hermes" },
        { type: "doc", id: "plugins/install-cursor", label: "Install — Cursor" },
        { type: "doc", id: "plugins/install-codex", label: "Install — Codex" },
        { type: "doc", id: "plugins/install-claude", label: "Install — Claude" },
        { type: "doc", id: "plugins/install-openclaw", label: "Install — OpenClaw" },
        { type: "doc", id: "plugins/install-opencode", label: "Install — OpenCode" },
      ],
    },
    "skills",
    "tools",
    "demo",
    "business",
  ],
};

module.exports = sidebars;
