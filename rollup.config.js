import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import shim from "rollup-plugin-shim";

export default {
  input: "dist/index.js",
  output: {
    file: "rollup/dist/index.js",
    format: "iife",
    name: "main",
  },
  plugins: [
    shim({}),
    resolve({
      preferBuiltins: false,
      mainFields: ["module", "browser"],
    }),
    cjs({
      namedExports: {
        events: ["EventEmitter"],
      },
    }),
    json(),
  ],
};
