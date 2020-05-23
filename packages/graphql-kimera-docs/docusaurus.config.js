module.exports = {
  title: "Kimera",
  tagline: "A library for mocking GraphQL servers with precision",
  url: "https://lola-tech.github.io",
  baseUrl: "/graphql-kimera/",
  favicon: "img/favicon.png",
  organizationName: "lola-tech",
  projectName: "graphql-kimera",
  plugins: ["docusaurus-plugin-sass"],
  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap",
    // "https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap",
  ],
  themeConfig: {
    disableDarkMode: true,
    sidebarCollapsible: false,
    image: "img/kimera-logo.svg",
    prism: {
      defaultLanguage: "js",
      plugins: ["line-numbers", "show-language"],
      // theme: require("prism-react-renderer/themes/oceanicNext"),
      // theme: require("prism-react-renderer/themes/shadesOfPurple"),
      // theme: require("prism-react-renderer/themes/synthwave84"),
    },
    navbar: {
      title: "Kimera",
      logo: {
        alt: "Kimera Logo",
        src: "img/kimera-logo.svg",
      },
      links: [
        {
          to: "/docs/getting-started",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://github.com/lola-tech/graphql-kimera",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      // links: [
      //   {
      //     title: 'Docs',
      //     items: [
      //       {
      //         label: 'Style Guide',
      //         to: 'docs/doc1',
      //       },
      //       {
      //         label: 'Second Doc',
      //         to: 'docs/doc2',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'Community',
      //     items: [
      //       {
      //         label: 'Stack Overflow',
      //         href: 'https://stackoverflow.com/questions/tagged/docusaurus',
      //       },
      //       {
      //         label: 'Discord',
      //         href: 'https://discordapp.com/invite/docusaurus',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'Social',
      //     items: [
      //       {
      //         label: 'Blog',
      //         to: 'blog',
      //       },
      //       {
      //         label: 'GitHub',
      //         href: 'https://github.com/lola-tech/graphql-kimera',
      //       },
      //       {
      //         label: 'Twitter',
      //         href: 'https://twitter.com/docusaurus',
      //       },
      //     ],
      //   },
      // ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://www.lola.tech/" target="_blank">Lola Tech</a>`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "./docs/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/lola-tech/graphql-kimera/edit/master/packages/graphql-kimera-docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
      },
    ],
  ],
};
