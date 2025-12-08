import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
    globalIgnores(["node_modules/**", ".next/**"]),
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],

        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
                project: "./tsconfig.json",
            },
        },

        plugins: {
            "@next/next": nextPlugin,
            import: importPlugin,
            "@typescript-eslint": tsPlugin,
        },

        rules: {
            ...nextPlugin.configs["core-web-vitals"].rules,

            "import/order": [
                "error",
                {
                    groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
                    pathGroups: [{ pattern: "@/**", group: "internal" }],
                    "newlines-between": "always",
                    alphabetize: { order: "asc", caseInsensitive: true },
                    distinctGroup: true,
                },
            ],

            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        },
    },
]);
