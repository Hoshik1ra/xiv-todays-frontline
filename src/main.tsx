import { createApp, vaporInteropPlugin } from 'vue';
import '@mdui/icons/translate.js';
import 'mdui/mdui.css';
import 'mdui';
import './styles.css';
import App from './App';
import { i18n } from './i18n';

createApp(App).use(vaporInteropPlugin).use(i18n).mount('#app');
