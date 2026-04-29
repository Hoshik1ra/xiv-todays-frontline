import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import VueJsxVapor from 'vue-jsx-vapor/vite';

export default defineConfig({
  base: '/xiv-todays-frontline/',
  plugins: [
    VueJsxVapor({
      macros: true,
      interop: true,
    }),
    tailwindcss(),
  ],
});
