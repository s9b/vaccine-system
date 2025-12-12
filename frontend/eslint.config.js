import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  {
    ignores: ["dist", "node_modules"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: pluginReact,
    },
    settings: {
        react: {
            version: "detect"
        }
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
        project: './tsconfig.eslint.json', // Specify project for type-aware linting
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // React 17+ doesn't require React to be in scope
      "@typescript-eslint/no-explicit-any": "off", // Temporarily disable for now
      "@typescript-eslint/no-unused-vars": "off", // Temporarily disable for now
      // Add other rules as needed
    },
  },
  {
    files: ["eslint.config.js", "vite.config.ts", "scripts/*"],
    languageOptions: {
      parserOptions: {
        project: false, // Disable project for config files
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    }
  }
];
