import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { createAppRouter } from "./core/router";

const app = createApp(App);
app.use(createPinia());

const router = createAppRouter();

app.use(router);
app.mount("#app");
