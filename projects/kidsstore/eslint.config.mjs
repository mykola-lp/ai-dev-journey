import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import prettierConfig from "eslint-config-prettier/flat";
import simpleImportSort from "eslint-plugin-simple-import-sort";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  // next/core-web-vitals already bundles jsx-a11y's recommended rules
  // alongside eslint-plugin-react and eslint-plugin-react-hooks.
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // Import order: 1) node builtins, 2) external packages, 3) internal
      // "@/..." aliases, 4) relative imports — one blank line between groups.
      "simple-import-sort/imports": [
        "error",
        {
          groups: [["^node:"], ["^react", "^next", "^(?!@/)[a-z]"], ["^@/"], ["^\\./", "^\\.\\./"]],
        },
      ],
      "simple-import-sort/exports": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  // Must be last: turns off any ESLint stylistic rules that would
  // otherwise conflict with Prettier's own formatting.
  prettierConfig,
  {
    ignores: [".next/**", "node_modules/**", "data/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
