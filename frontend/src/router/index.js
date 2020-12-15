import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ConfirmRegister from "../views/ConfirmRegister.vue";
import ChatRoom from "../views/ChatRoom.vue";
import ErrorPage from "../views/Error.vue";

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
    path: "/",
    name: "ChatRoom",
    component: ChatRoom,
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
