import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  {
    ignores: ["**/node_modules/**", ".next/**", "dist/**", "build/**"],
  },
  ...compat.config({
    extends: ["next/core-web-vitals", "prettier"],
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  }),
];
