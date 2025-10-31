/**
 * This babel.config is only used for publishing.
 *
 * For local dev experience, see the babel.config
 */
module.exports = {
  plugins: [
    [
      "module:decorator-transforms",
      {
        runtime: {
          import: "decorator-transforms/runtime-esm",
        },
      },
    ],
  ],

  generatorOpts: {
    compact: false,
  },
};
