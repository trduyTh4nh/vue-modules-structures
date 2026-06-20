// main.ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createAppRouter } from "./core/router";
import App from "./App.vue";
import "./style.css";
import vuetify from './plugins/vuetify' 


const app = createApp(App);
app.use(vuetify)
app.use(createPinia());
const router = createAppRouter();
app.use(router);
window.__appRouter = router;
app.mount("#app");
