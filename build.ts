import { context } from "esbuild";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

const isDev = process.argv.includes("--development");

const ctx = await context({
  entryPoints: ["./src/index.ts"],
  outfile: "./dist/index.js",
  bundle: true,
  minify: !isDev,
  sourcemap: !isDev,
  platform: "browser",
  target: "esnext",
  format: "iife",
  globalName: "webfs",
  plugins: [polyfillNode()]
});

if (isDev) {
  await ctx.watch();
  console.log("Watching...");
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
