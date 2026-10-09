import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://ismayc.github.io",
  base: "/sql-tutorial/",
  trailingSlash: "ignore",
  // Astro 7 defaults to "jsx", which drops the line-break space between text
  // and an inline element ("Source on <a>GitHub</a>" renders "onGitHub").
  // true is the Astro 5 default: lossless whitespace compression.
  compressHTML: true,
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["sql.js/dist/sql-wasm.js"],
    },
  },
});
