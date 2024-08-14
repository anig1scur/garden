import svgr from "vite-plugin-svgr";
import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
import path from 'path';

export default defineConfig(({ }) => {
  return {
    server: {
      hmr: true
    },
    plugins: [
      svgr({
        svgrOptions: { exportType: 'named', ref: true, svgo: false, titleProp: true },
        include: '**/*.svg',
      }),
      react(),
    ],
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "public/assets/"),
        "@": path.resolve(__dirname, "src/"),
      },
    }
  };
});
