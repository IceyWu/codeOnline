import { createApp } from "vue";
import { router } from "./router";
import routes from "virtual:generated-pages";

import App from "./App.vue";

import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { MotionPlugin } from "@vueuse/motion";

import "element-plus/dist/index.css";
import "./styles/main.css";
// import '@unocss/reset/tailwind.css'
import "uno.css";
//引入highlight.js
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript"; //引入语言
hljs.registerLanguage("javascript", javascript);
import hljsVuePlugin from "@highlightjs/vue-plugin";
import "highlight.js/styles/stackoverflow-light.css";
import "highlight.js/lib/common";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app.component("hljsVuePlugin", hljsVuePlugin); //全局注册
app.component("highlightjs", hljsVuePlugin.component); //全局注册

app.use(MotionPlugin);
app.use(pinia);
app.use(router);

app.mount("#app");
