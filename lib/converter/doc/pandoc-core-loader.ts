// Re-export createPandocInstance from the pandoc-wasm core module.
// pandoc-wasm's package.json doesn't include ./src/core.js in its
// "exports" field, so bundlers with strict ESM resolution reject the
// bare specifier. We resolve this through a bundler alias:
//  - next.config.ts:  turbopack.resolveAlias + webpack.resolve.alias
//  - vitest.config.ts: test.alias
// All map "pandoc-wasm-core" → node_modules/pandoc-wasm/src/core.js

// @ts-expect-error — no type declarations for this aliased module
export { createPandocInstance } from "pandoc-wasm-core";
