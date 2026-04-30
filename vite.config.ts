import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";
import VueJsxVapor from "vue-jsx-vapor/vite";

export default defineConfig({
  fmt: {},
  lint: { options: { typeAware: false, typeCheck: false } },
  base: "/xiv-todays-frontline/",
  plugins: [
    VueJsxVapor({
      macros: true,
      interop: true,
    }),
    tailwindcss(),
  ],
});
