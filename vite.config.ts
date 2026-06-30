import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    TanStackRouterVite({
      codeSplittingOptions: {
        addHmr: false,
      },
    }),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
    tsConfigPaths(),
  ],
});
