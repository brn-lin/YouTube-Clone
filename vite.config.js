import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  base: "./", // relative paths for Firebase Hosting
  build: {
    outDir: "dist", // explicitly set output folder
    emptyOutDir: true, // clear dist folder before building
  },
});
