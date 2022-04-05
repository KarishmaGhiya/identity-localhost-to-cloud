import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import shim from "rollup-plugin-shim";

export default {
  input: "bundledBrowserCode/src/index.js",
  output: {
    file: "bundledBrowserCode/dist/index.js",
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
