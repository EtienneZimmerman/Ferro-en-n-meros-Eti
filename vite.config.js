import { defineConfig } from "vite";

// El sitio vive en https://ferroweb.github.io/ferro-en-numeros/
export default defineConfig({
  base: "/ferro-en-numeros/",
  build: { outDir: "dist", sourcemap: false },
});
