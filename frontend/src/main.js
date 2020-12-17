import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import "@/mixins/emojiMixin";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLaugh,
  faLaughWink,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vuelidate from "vuelidate";
import Amplify from "aws-amplify";
import "@aws-amplify/ui-vue";
import awsconfig from "./aws-exports";
import router from "./router";
import store from "./store";
import Notifications from "vue-notification";

Amplify.configure(awsconfig);
library.add(faLaughWink, faLaugh, faPaperPlane);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;
[[VueAxios, axios], [Vuelidate], [Notifications]].forEach((args) =>
  Vue.use(...args),
);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
