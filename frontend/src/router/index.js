import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: "/login",
    name: "loginView",
    component: () =>
      import( "../components/loginView.vue"),
  },
  {
    path: "/posts",
    name: "postPage",
    component: () =>
      import( "../components/postPage.vue"),
    beforeEnter: (to, from, next) => {
      let token = localStorage.getItem("token");
      if (token) {
        next();
      } else {
        next({ name: "login" });
      }
    },
  },
  {
    path: "/profil",
    name: "profilPage",
    component: () =>
      import( "../components/profilPage.vue"),
    beforeEnter: (to, from, next) => {
      let token = localStorage.getItem("token");
      if (token) {
        next();
      } else {
        next({ name: "login" });
      }
    },
  },

  {
    path: "/comment/:id",
    name: "commentPage",
    component: () =>
      import("../components/commentPage.vue"),
    beforeEnter: (to, from, next) => {
      let token = localStorage.getItem("token");
      if (token) {
        next();
      } else {
        next({ name: "/posts" });
      }      
    },
    props : true
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
