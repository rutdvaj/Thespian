const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // 👈 ensures TS files are recognized
  transformIgnorePatterns: ["/node_modules/"], // 👈 makes sure node_modules aren’t skipped incorrectly
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json", // 👈 link to your tsconfig so Jest knows about your TS settings
    },
  },
};
