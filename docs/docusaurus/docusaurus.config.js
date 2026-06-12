// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Mantle Forge",
  tagline: "Mantle execution layer for coding agents.",
  url: "https://mantle-forge.vercel.app",
  baseUrl: "/",
  onBrokenLinks: "throw",
  organizationName: "mantle-forge",
  projectName: "mantle-forge",

  favicon: "img/logo.png",

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/docs",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Mantle Forge",
        logo: {
          alt: "Mantle Forge Logo",
          src: "img/logo.png",
        },
        items: [
          { to: "/docs/intro", label: "Docs", position: "left" },
          { to: "/docs/plugins/", label: "Plugins", position: "left" },
          { to: "/docs/quickstart", label: "Quickstart", position: "left" },
          { to: "/docs/skills", label: "Skills", position: "left" },
          { to: "/docs/tools", label: "Tools", position: "left" },
          { to: "/docs/demo", label: "Demo", position: "left" },
          {
            href: "https://github.com/BerEst12/mantle-forge",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [],
        copyright: `Mantle Forge · The Turing Test Hackathon 2026 — Phase 2: AI Awakening`,
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      metadata: [
        { name: "og:image", content: "img/logo.png" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    }),
};

module.exports = config;
