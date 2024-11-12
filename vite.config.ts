import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";

dotenv.config();

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [react(), tsconfigPaths()],
  define: {
    "process.env": process.env,
  },
});
