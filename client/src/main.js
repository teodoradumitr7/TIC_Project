import App from './App.vue'
import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

import router from './router'
import store from './store/store';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';


import Notifications from '@kyvg/vue3-notification'

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App).use(router).use(store).use(vuetify).use(Notifications)

//.use(vuetify)
//registerPlugins(app)
app.mount('#app')


// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";
// import store from "./store";

// createApp(App).use(store).use(router).mount("#app");
