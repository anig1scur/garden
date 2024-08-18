import svgr from "vite-plugin-svgr";
import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
import path from 'path';

export default defineConfig(({ }) => {
  return {
    base: "./",
    server: {
      hmr: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          followRedirects: true,
          changeOrigin: true,
          secure: false,
        },
      },
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
