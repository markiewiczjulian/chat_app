import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import ChatRoom from "../views/ChatRoom.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "ChatRoom",
    component: ChatRoom,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
