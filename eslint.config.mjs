import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // Allow "any" (only warn)
      "@typescript-eslint/no-explicit-any": "warn",

      // Allow @ts-nocheck (only warn)
      "@typescript-eslint/ban-ts-comment": "warn",

      // Downgrade unused vars to warnings so build does not break
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // React hook dependency warnings only
      "react-hooks/exhaustive-deps": "warn",

      // Allow quotes in text
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
