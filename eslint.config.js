import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),

  // Frontend files (React)
  {
    files: ["**/*.{js,jsx}"],
    excludedFiles: ["functions/**/*.js"], // exclude backend
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        sourceType: "module", // ES Modules for frontend
      },
    },
  },

  // Backend files (Node.js)
  {
    files: ["functions/**/*.js"],
    env: {
      node: true,
      es2021: true,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "unambiguous", // auto-detect CJS or ESM
    },
  },
]);
