
import { createApp } from 'vue';
import App from './App.js';

try {
  const app = createApp(App);
  app.mount('#root');
} catch (e) {
  console.error("Vue mounting error:", e);
}
