import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://ismayc.github.io",
  base: "/sql-tutorial/",
  trailingSlash: "ignore",
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["sql.js/dist/sql-wasm.js"],
    },
  },
});
