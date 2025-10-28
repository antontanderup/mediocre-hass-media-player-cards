import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
// @ts-expect-error it's not typed yet
import importPlugin from "eslint-plugin-import";
import * as emotion from "@emotion/eslint-plugin";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      "@emotion": emotion,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.eslint.json",
      },
    },
    settings: {
      react: {
        pragma: "h",
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.eslint.json",
          alwaysTryTypes: true,
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      // Enforce using aliases with no-restricted-imports instead
      "no-restricted-imports": [
        "error",
        {
          patterns: ["../*"],
        },
      ],
      "import/no-unresolved": "error",
      "react/react-in-jsx-scope": "off", // Not needed for Preact with automatic JSX runtime
      "import/export": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "react/prop-types": "off", // Disable prop-types as we're using TypeScript for type checking
      "@emotion/syntax-preference": [2, "object"],
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
    },
  }
);
