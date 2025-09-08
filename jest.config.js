const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "./tsconfig.json" }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // 👈 ensures TS files are recognized
  transformIgnorePatterns: ["/node_modules/"], // 👈 makes sure node_modules aren’t skipped incorrectly
  globals: {
    "ts-jest": {
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // 👈 tells Jest what `@/` means
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
  },
};
