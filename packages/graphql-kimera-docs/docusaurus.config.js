module.exports = {
  title: "Kimera",
  tagline: "A tool for building mock servers with precision",
  url: "https://lola-tech.github.io",
  baseUrl: "/graphql-kimera/",
  // url: "localhost",
  // baseUrl: "/",
  favicon: "img/favicon.png",
  organizationName: "lola-tech",
  projectName: "graphql-kimera",
  themeConfig: {
    sidebarCollapsible: false,
    navbar: {
      title: "Kimera",
      logo: {
        alt: "Kimera Logo",
        src: "img/logo-dark.png",
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
      copyright: `Copyright © ${new Date().getFullYear()} Lola Tech`,
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
            "https://github.com/lola-tech/graphql-kimera/edit/master/website/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
