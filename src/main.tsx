import { createApp, vaporInteropPlugin } from "vue";
import "@mdui/icons/translate.js";
import "mdui/components/button-icon.js";
import "mdui/components/dropdown.js";
import "mdui/components/menu.js";
import "mdui/components/menu-item.js";
import "mdui/mdui.css";
import "./styles.css";
import App from "./App";
import { i18n } from "./i18n";

createApp(App).use(vaporInteropPlugin).use(i18n).mount("#app");
