import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { createServer } from "./server";
import { generateDesignTokens } from "./scripts/generate-design-tokens";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared", "index.html"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [designTokenPlugin(), react(), expressPlugin()],
  resolve: {
    alias: [
      { find: "@shared", replacement: path.resolve(__dirname, "./shared") },
      { find: "@", replacement: path.resolve(__dirname, "./client") },
    ],
  },
}));

function designTokenPlugin(): Plugin {
  const tokenDirectory = path.resolve(__dirname, "./tokens");

  return {
    name: "design-token-generator",
    async buildStart() {
      await generateDesignTokens();
    },
    configureServer(server) {
      server.watcher.add(tokenDirectory);
      server.watcher.on("change", (filePath) => {
        const isTokenFile =
          path.resolve(filePath).startsWith(`${tokenDirectory}${path.sep}`) &&
          filePath.endsWith(".tokens.json");

        if (isTokenFile) {
          void generateDesignTokens().then(() => {
            server.ws.send({ type: "full-reload" });
          });
        }
      });
    },
  };
}

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
