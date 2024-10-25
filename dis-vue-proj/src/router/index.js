import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import ProfileView from "../views/ProfileView.vue";
import IngredientsView from "../views/IngredientsView.vue";

const routes = [
  {
    path: "/",
    name: "RegisterView",
    component: RegisterView,
  },
  {
    path: "/user/:ulogin",
    name: "ProfileView",
    component: ProfileView,
  },
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
  },
  {
    path: "/ingredients",
    name: "IngredientsView",
    component: IngredientsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
