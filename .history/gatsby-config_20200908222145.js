module.exports = {
  plugins: [
    `gatsby-plugin-theme-ui`,
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        jsxPragma: `React`,
        allExtensions: true,
      },
    },
  ],
};
