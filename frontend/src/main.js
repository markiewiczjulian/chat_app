import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLaugh,
  faLaughWink,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import "@aws-amplify/ui-vue";

Amplify.configure(awsconfig);
library.add(faLaughWink, faLaugh, faPaperPlane);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;
Vue.use(VueAxios, axios, Auth);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
