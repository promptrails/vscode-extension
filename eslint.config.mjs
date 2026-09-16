import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";

// Biome (see biome.json) is the formatter and the general linter for this repo.
// ESLint survives for exactly one thing: eslint-plugin-react-hooks. Biome covers
// rules-of-hooks (correctness/useHookAtTopLevel) and exhaustive-deps
// (correctness/useExhaustiveDependencies) but has no equivalent for the React
// Compiler rules this plugin ships -- set-state-in-effect, set-state-in-render,
// purity, immutability, refs, preserve-manual-memoization, static-components,
// error-boundaries, use-memo. Those catch real bugs, so they stay.
export default [
  {
    ignores: ["dist/**", "node_modules/**", "media/**", "*.js", "*.mjs"],
  },
  {
    ...reactHooks.configs.flat.recommended,
    files: ["src/**/*.ts", "webview/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
  },
];
