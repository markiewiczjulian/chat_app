import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/authorization/Login.vue";
import Register from "../views/authorization/Register.vue";
import ConfirmRegister from "../views/authorization/ConfirmRegister.vue";
import ResendConfirmation from "../views/authorization/ResendConfirmation.vue";
import ChatRoom from "../views/ChatRoom.vue";
import ErrorPage from "../views/Error.vue";
import store from "../store/";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/confirm-register",
    name: "ConfirmRegister",
    component: ConfirmRegister,
  },
  {
    path: "/resend-confirmation",
    name: "ResendConfirmation",
    component: ResendConfirmation,
  },
  {
    path: "/",
    name: "ChatRoom",
    component: ChatRoom,
    beforeEnter: (to, from, next) => {
      if (store.getters["user/getCurrentUser"]) {
        next();
      } else {
        next({ name: "Login" });
      }
    },
  },
  {
    path: "*",
    name: "ErrorPage",
    component: ErrorPage,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
