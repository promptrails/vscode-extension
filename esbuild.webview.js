const esbuild = require("esbuild");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const watch = process.argv.includes("--watch");

// Build Tailwind CSS
function buildCss() {
  execSync("npx tailwindcss -i webview/index.css -o dist/webview.css --minify", {
    stdio: "inherit",
  });
}

/** @type {import('esbuild').BuildOptions} */
const config = {
  entryPoints: ["webview/index.tsx"],
  bundle: true,
  outfile: "dist/webview.js",
  format: "iife",
  platform: "browser",
  target: "es2022",
  sourcemap: true,
  minify: !watch,
  jsx: "automatic",
  define: {
    "process.env.NODE_ENV": watch ? '"development"' : '"production"',
  },
};

async function main() {
  buildCss();

  if (watch) {
    const ctx = await esbuild.context({
      ...config,
      plugins: [
        {
          name: "rebuild-css",
          setup(build) {
            build.onEnd(() => {
              try {
                buildCss();
              } catch {}
            });
          },
        },
      ],
    });
    await ctx.watch();
    console.log("[webview] watching...");
  } else {
    await esbuild.build(config);
    console.log("[webview] build complete");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
