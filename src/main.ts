// main.ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createAppRouter } from "./core/router";
import App from "./App.vue";
import "./style.css";

const app = createApp(App);
app.use(createPinia());
const router = createAppRouter();
app.use(router);
window.__appRouter = router;
app.mount("#app");
