import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import * as fs from "node:fs"

const pkg =JSON.parse(fs.readFileSync("package.json","utf8"))
const prod =process.env.NODE_ENV === "production"

/** @type {import('rollup').RollupOptions} */
export default {
  input: "./src/index.ts",
  output: {
    format: "es",
    entryFileNames: "[name].js",
    dir: "lib",
    sourcemap: !prod
  },
  external: ["dotenv/config",...Object.keys(pkg?.dependencies || {})],
  plugins: [
    prod && terser({
      compress: true,
      mangle: true,
    }),
    typescript({
      declaration: true,
      sourceMap: !prod
    }),
    resolve({ browser: false })
  ]
}
